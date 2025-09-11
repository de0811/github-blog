---
aliases:
  - CORS
  - CorsConfiguration
tags:
  - Spring
  - Spring/Security
특징: CORS 관련 설명
---
# CORS(Cross Origin Resource Sharing)
`Access-Control-Allow-Origin`
서로 다른 URL 일 경우에 브라우저는 서로간의 통신을 차단
프론트와 백엔드가 서로 다른 URL 다르기 때문에 서로 대화를 하는 것을 최신 브라우저는 차단
해당 기능은 브라우저에서 차단하는 기능이기 때문에 API 형태로 작동하는 백엔드의 경우 사용에 의미가 없음

> [!NOTE] 서로 다른 조건 3가지
> * Protocol 인 HTTP 또는 HTTPS 가 다른 경우
> * domain 이름이 다를 경우
> * port 번호가 다를 경우

브라우저들은 대부분 pre-flight(교차출처소통?) 요청을 하기 때문에 백엔드에서만 해줘도 문제 없음

![[config/AttachedFile/Pasted image 20240328151205.png]]
최신 브라우저들에서는 기본적으로 가지고 있는 CORS 기능으로 인한 에러 발생

## 해결 방법 1
 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@CrossOrigin|@CrossOrigin]] 사용하는 방법
 어디와 소통하는데 허용하겠다는 의미
## 해결 방법 2
[[#CorsConfiguration]]  설정을 작성하는 방법
필수 설정
- 허용 Method 설정
- 허용 Origin 설정
- 허용 Headers 설정
3가지 중 하나라도 없을 경우 CORS 해지되지 않음
# CorsConfiguration

```java
public class CorsConfiguration {
	// 교차 출처 요청이 허용되는 출처 목록 List.of("http://localhost:3000") 이렇게 넣기도 하지만 "${origin}" 이렇게 넣는게 더 쓰기 좋음
	public void setAllowedOrigins(@Nullable List<String> origins)
	// 해당 방법은 setAllowedOrigins 처럼 ${origin} 방법을 사용하지 못하고 문자열 그대로 저장
	public void addAllowedMethod(String method)
	// 인증정보를 넘기고 받는데 동의할지 말지 선택 (이거 굳이 필요하나?)
	// 내 서버가 응답할 때 json을 자바스크립트에서 처리할 수 있게 할지를 설정하는 것 (json 오는 데이터를 처리할지 선택)
	public void setAllowCredentials(@Nullable Boolean allowCredentials)
}
```

## 사용 예제
```java
  public CorsConfiguration corsConfiguration() {  
    CorsConfiguration corsConfig = new CorsConfiguration();  
//    corsConfig.addAllowedOrigin("http://localhost:3000");  
    corsConfig.setAllowedOrigins(List.of("http://localhost:3000"));  
    corsConfig.addAllowedMethod("*");  
    corsConfig.addAllowedHeader("*");  
    corsConfig.setMaxAge(3600L);  
    return corsConfig;  
  }
```

```java
@Configuration  
public class CorsConfig {  
    XsConfig xsConfig;  
  
    @Autowired  
    public CorsConfig(  
            XsConfig xsConfig  
    ){  
        this.xsConfig = xsConfig;  
    }  
    @Bean  
    public CorsFilter corsFilter(){  
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();  
        CorsConfiguration configuration = new CorsConfiguration();  
//        configuration.addAllowedOrigin("*"); //모든 ip에 응답을 허용(이제 막힘)
        configuration.addAllowedOrigin(xsConfig.getConsoleFrontUrl());  
        configuration.setAllowCredentials(true); // 내 서버가 응답할 때 json을 자바스크립트에서 처리할 수 있게 할지를 설정하는 것 (json 오는 데이터를 처리할지 선택)  
        configuration.addAllowedHeader("*"); //모든 header 응답을 허용  
//        configuration.addAllowedMethod("*"); //모든 post, get, put, delete, patch 허용  
        configuration.addAllowedMethod(HttpMethod.GET);  
        configuration.addAllowedMethod(HttpMethod.POST);  
        configuration.addExposedHeader("Authorization");  
        source.registerCorsConfiguration("/**", configuration); //해당 패턴으로 오는 모든 내용은 해당 configuration을 적용  
        return new CorsFilter(source);  
    }  
}
```