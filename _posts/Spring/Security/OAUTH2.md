---
aliases:
  - OAUTH2
  - OIDC
tags:
  - Spring
  - Spring/Security
특징:
---
# OAUTH2(Open Authorization)
마이크로 서비스는 보안로직, 인증, 허가로직을 분리해야함
OAUTH2 는 인증 공통 처리를 위해 개발
[테스트를 해 볼 수 있는 사이트](https://www.oauth.com/)
## 용어
- 리소스 소유자(Resource Owner), 엔드유저
	- 보호된 리소스(예: 트위터 트윗)의 소유자이며, OAuth 플로우를 통해 다른 애플리케이션이 이러한 리소스에 접근할 권한을 부여
- 클라이언트(Client)
	- OAuth 플로우를 통해 리소스에 접근하려는 애플리케이션
- 승인 서버(Authorization Server)
	- 리소스 소유자의 인증 및 권한 부여를 처리하는 서버
	- 엔드 유저의 자격 증명을 검증하고, 클라이언트에게 접근 권한을 부여
- 리소스 서버(Resource Server)
	- 보호된 리소스가 저장되어 있는 서버
	- 클라이언트가 접근하고자 하는 리소스에 대한 요청을 처리하고 응답
- 스코프(Scope)
	- 클라이언트가 요청하는 리소스에 대한 권한 범위
	- "트윗 읽기"나 "프로필 보기"와 같은 스코프를 설정
## OAuth 2.0 사용하는 과정
1. 인증 받으려는 접속하는 서버에 API 에 대한 액세스 요청
2. 나의 앱을 접속하는 서버에 등록하고 접속하는 서버로부터 클라이언트 ID와 기밀(비밀번호 같은 것)을 받음
3. 사용자가 접속하려는 서버의 인증 서버를 통해 로그인하고 나의 앱에 인증 코드를 부여
4. 앱은 인증 코드와 액세스 토큰을 요청하고 앱의 ID와 기밀을 전달
5. 인증 서버는 앱의 신원을 확인하고 인증 코드를 교환하여 액세스 토큰을 발급
6. 이제 서버에 요청 가능

![[config/AttachedFile/Pasted image 20240418141210.png|800]]

### 앱 서버에 나의 정보를 엑세스 허용 요청 데이터
- `client_id` : 클라이언트 앱의 ID
- `redirect_uri` : 인증 성공 후 인증 서버가 사용자를 리디렉션해야하는 URI
- `scope` : 클라이언트가 요청하는 액세스 수준
- `state` : CSRF 공격으로부터 보호하기 위한 CSRF 토큰 값
- `response_type` : 클라이언트가 인증 코드 부여 유형을 사용하고 있음을 나타내는 `code` 값

### AUTHORIZATION_CODE 와 함께 전달할 데이터
- `code` : 사용자가 허락했음을 전달하는 인증 코드
- `client_id` & `client_secret` : 앱의 ID 및 기밀(비밀번호 같은 것)
- `grant_type` : 클라이언트가 인증 코드 부여 유형을 사용하고 있음을 나타내는 "authorization_code" 값입니다. ???????????
- `redirect_uri` : 인증 성공 후 인증 서버가 사용자를 리디렉션해야하는 URI

![[config/AttachedFile/Pasted image 20240418164831.png|800]]
> 만료된 Access Token 재갱신 방법

refresh 토큰을 사용하는 이유는 Access 토큰은 노출될 수 있기 때문에 만료하여 재갱신 필요

### 만료된 Access Token 재갱신 시 필요 데이터
- `client_id` & `client_secret` : 
- `refresh_token` : 
- `scope` : 
- `grant_type` :

### Resource Server 에서는 어떻게 Auth Server 와 동일하게 검증이 가능할까?
- 매번 Auth Server 를 통해서 검증하는 방법
- 같은 DB를 사용하여 토큰을 DB에 적제하는 방법
- 동일한 공개 인증서를 사용하여 검증하는 방법


# OIDC(OpenID Connect)
 OAuth 2.0 과 차이점
 공통 : 승인과 허가를 활용
 차이점 : 액세스 토큰과 스코프 세부 사항을 파악
OAuth 2.0은 구조물로는 누가 엔드 유저인지 디테일은 무엇인지 이메일은 무엇인지 주소 세부 사항이 무엇인지 알 수 없음 (JWT랑은 다르니까)
OpenID는 OAuth 구조 위에서 동작


사용자의 추가 정보를 알고 싶어서 있는 건가본데


엑세스 토큰 : 승인을 관리
OpenID 토큰 : 사용자 세부 사항의 권한을 관리
리프레시 토큰

엑세스 토큰과 OpenID 토큰을 동시에 보내기 위해 접근 관리 방법으로
IAM 접근 방법이 탄생
IAM 접근 방법을 이용해 keycloak 도 탄생

scope 로 전달하며 openID 는 JWT로 구성되어 있음
payload 에는 각종 아이디 및 사용자의 정보가 포함됨

# Oauth2 인증 서버
[[2.Ref(데이터 및 정보 저장)/Docker/keycloak|keycloak]]  사용하는 방법도 있음


# OAUTH2 Social Login
## 보안 설정 방법
```xml title:"pom.xml 설정"
<dependency>  
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-starter-oauth2-client</artifactId>  
</dependency>  
<dependency>  
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-starter-security</artifactId>  
</dependency>  
<dependency>  
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-starter-web</artifactId>  
</dependency>
```

```java title:"java 에서 client-id, client-secret 등록 방법"
@Configuration
public class SpringSecOAUTH2GitHubConfig {

    @Bean
    SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests((requests)->requests.anyRequest().authenticated())
                .oauth2Login(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    public ClientRegistrationRepository clientRepository() {
        ClientRegistration clientReg = clientRegistration();
        return new InMemoryClientRegistrationRepository(clientReg);
    }

    private ClientRegistration clientRegistration() {
		return CommonOAuth2Provider.GITHUB.getBuilder("github").clientId("8cf67ab304dc500092e3")
	           .clientSecret("6e6f91851c864684af2f91eaa08fb5041162768e").build();
	 }
}

```
