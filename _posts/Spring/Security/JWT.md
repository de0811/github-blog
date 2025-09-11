---
aliases:
  - JWT
  - JWT(JSON Web Token)
tags:
  - Spring
  - Spring/Security
특징: 
---
# JWT(JSON Web Token)

## JSESSIONID 단점
토큰에 유저 데이터를 넣을 수 없음
JSESSIONID 훔치기 가능 (JWT 또한 훔칠 수 있는데?)
## 토큰의 장점
자격 증명을 반복해서 공유하지 않아도 되므로 보안적인 이점
해커가 토큰을 탈취해도 토큰을 무효화시킬 수 있어서 보안에 유리 (? 누가 들으면 JSESSIONID 는 무효화 안되는지 알겠네)
토큰의 수명 설정 가능 및 재사용 가능
무상태 유지 가능
단순하게 무상태 유지와 토큰의 발행자가 서버라는 것을 증명가능한 것
## JWT 토큰의 내부 구조
`aaaaaaa.bbbbbbb.ccccc`
aaa 로 된 부분은 헤더(header) 부분
bbb 로 된 부분은 내용(payload) 부분
ccc 로 된 부분은 서명(signature) 부분 - 해당 부분은 선택 사항

각 부분의 구분은 `.` 을 통해서 구분
`HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)`

### header 
어떤 알고리즘을 사용하는지 
토큰의 종류가 무엇인지 
JWT 토큰을 생성하며 사용된 토큰의 형식은 어떤것인지
보통 해당 데이터를 Base64 Encoded 를 진행하여 가장 앞에 붙임

```json
{
	"alg":"HS256",
	"typ":"JWT"
}
```
> 해당 데이터를 Base64 로 변환하여 header 위치에 등록
### payload 
유저에 대한 정보를 저장 (넣는 사람이 넣고 싶은 내용을 작성)
```json
{
	"sub":"12345",
	"name":"John Doe",
	"iat":1516239022
}
```
> 해당 데이터를 Base64 로 변환하여 payload 위치에 등록

#### Registered Claim(등록된 클레임)
- `iss`: 토큰 발급자(issuer)
- `sub`: 토큰 제목 (subject)
- `aud`: 토큰 대상자 (audience)
- `exp`: 토큰의 만료시간 (expiraton), 시간은 NumericDate 형식으로 되어있어야 하며 (예: 1480849147370) 언제나 현재 시간보다 이후로 설정되어있어야합니다.
- `nbf`: Not Before 를 의미하며, 토큰의 활성 날짜와 비슷한 개념입니다. 여기에도 NumericDate 형식으로 날짜를 지정하며, 이 날짜가 지나기 전까지는 토큰이 처리되지 않습니다.
- `iat`: 토큰이 발급된 시간 (issued at), 이 값을 사용하여 토큰의 `age` 가 얼마나 되었는지 판단 할 수 있습니다.
- `jti`: JWT의 고유 식별자로서, 주로 중복적인 처리를 방지하기 위하여 사용됩니다. 일회용 토큰에 사용하면 유용합니다.
### signature 
서명 값을 등록해서 보낼 경우 내부 값을 해시값에 의해 보호 됨으로 수정해도 의미가 없기 때문에 보안적으로 안전

## jjwt 라이브러리 JWT 설정
```xml
<dependency>  
    <groupId>io.jsonwebtoken</groupId>  
    <artifactId>jjwt-api</artifactId>  
    <version>0.12.3</version>  
</dependency>  
<dependency>  
    <groupId>io.jsonwebtoken</groupId>  
    <artifactId>jjwt-impl</artifactId>  
    <version>0.12.3</version>  
    <scope>runtime</scope>  
</dependency>  
<dependency>  
    <groupId>io.jsonwebtoken</groupId>  
    <artifactId>jjwt-jackson</artifactId>  
    <version>0.12.3</version>  
</dependency>
```
> pom.xml

```java
@EnableWebSecurity
@Configuration  
public class SecurityConfig {  
  @Bean  
  SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {  
  ...
  http.sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
  ...
  }
  ...
  public CorsConfiguration corsConfiguration() {  
    CorsConfiguration corsConfig = new CorsConfiguration();  
    ...
    // JWT 토큰을 사용하기 위해 Authorization 헤더를 노출시킴  
    corsConfig.setExposedHeaders(List.of("Authorization"));  
    return corsConfig;
  }
}
```
> session 불필요, Authorization 헤더 받는 것을 허용

```java
@Slf4j  
public class JWTTokenGeneratorFilter extends OncePerRequestFilter {  
  @Override  
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {  
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();  
    if (null != authentication) {  
      SecretKey secretKey = Keys.hmacShaKeyFor(JwtProperties.getSecretKey().getBytes());  
      String jwt = Jwts.builder()  
        .issuer("EasyBank")  
        .subject("JWT Token")  
        .claim("username", authentication.getName())  
        .claim("authorities", populateAuthorities(authentication))  
        .issuedAt(new Date())  
        .expiration(new Date(System.currentTimeMillis() + (JwtProperties.getExpirationMinuteTime() * 60 * 1000)))  
        .signWith(secretKey)  
        .compact();  
  
      response.addHeader(JwtProperties.getHeaderString(), JwtProperties.getTokenPrefix() + jwt);  
  
      filterChain.doFilter(request, response);  
    }  
  
  }  

// 로그인 할때만 해당 필터를 타도록 설정
  @Override  
  protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {  
    return !request.getServletPath().equals("/login");  
  }  
  
  private String populateAuthorities(Authentication authentication) {  
    Set<String> authorities = authentication.getAuthorities().stream()  
      .map(grantedAuthority -> grantedAuthority.getAuthority())  
      .collect(Collectors.toSet());  
    return String.join(",", authorities);  
  }  
}
```

## Auth0 라이브러리 JWT 사용
```xml
<dependency><!-- JWT Token -->  
    <groupId>com.auth0</groupId>  
    <artifactId>java-jwt</artifactId>  
    <version>3.18.2</version>  
</dependency>
```

```java
public class JwtUtil {  
    public static String create(String subject, Long expirationMinuteTime, String secretKey, Map<String, String> claim){  
        JWTCreator.Builder builder =JWT.create()  
                .withSubject(subject)  
                .withExpiresAt(new Date(System.currentTimeMillis()+ (1000L * 60 * expirationMinuteTime) )); //만료 시간 milliSecond 1/1000초 30분으로 설정함  
        claim.forEach(builder::withClaim);  
        String jwtToken = builder.sign( Algorithm.HMAC512(secretKey) ); //서버만 아는 고유한 값으로 설정  
  
        return jwtToken;  
    }  
}
```
> JWT 생성 방법

```java
String jwtToken = request.getHeader(jwtProperties.getHeaderString()).replace(jwtProperties.getTokenPrefix(), "");  
            DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC512(jwtProperties.getSecretKey())).build().verify(jwtToken);  
            // 이거 만료 제대로 되는지를 모르겠는데  
//            decodedJWT.getExpiresAt()  
            String username = decodedJWT.getClaim("username").asString();  
            //서명이 정상적으로 됨  
            if( username != null ){  
                User user = userRepository.findByUsername(username);  
  
                PrincipalDetails principalDetails = new PrincipalDetails(user);  
                //JWT 토큰 서명을 통해서 서명이 정상이면 Authentication 객체 생성  
                //2번째 인자는 비밀번호 인데  
                Authentication authentication = new UsernamePasswordAuthenticationToken(principalDetails, null, principalDetails.getAuthorities());  
                //Security Session  
                //강제로 시큐리티 세션에 접근하여 Authentication 객체를 저장  
                SecurityContextHolder.getContext().setAuthentication(authentication);  
  
                String token_ip = decodedJWT.getClaim("ip").asString();  
                if( xsConfig.getConsoleConfig().isJwtIpCheckYn() && !WebUtil.getIp(request).equals(token_ip) ){  
                    throw new InvalidClaimException(String.format("The Claim '%s' value doesn't match the required one.", "ip"));  
                }  
                {   //강제로 재갱신 로직을 추가  
                    Map<String, String> claim = new HashMap<>();  
                    claim.put( "id", principalDetails.getUser().getId().toString() );  
                    claim.put( "username", principalDetails.getUser().getUsername() );  
                    String ip = WebUtil.getIp(request);  
                    claim.put( "ip", ip );  
                    String newJwtToken = JwtUtil.create(principalDetails.getUsername(), jwtProperties.getExpirationMinuteTime(), jwtProperties.getSecretKey(), claim);  
  
                    // 클라이언트에게 JWT 토큰을 전달  
                    response.addHeader(jwtProperties.getHeaderString(), jwtProperties.getTokenPrefix() + newJwtToken);  
                }  
            }
```
> JWT 검증 방법