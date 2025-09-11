---
aliases:
  - FilterChainProxy
  - SecurityFilter
  - SecurityFilterChain
tags:
  - Spring
  - Spring/Security
  - Spring/Request
특징: 
---
# FilterChainProxy
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@EnableWebSecurity]]를 통해서 `FilterChainProxy` 활성화 하여 확인
[[2.Ref(데이터 및 정보 저장)/Spring/Security/보안 설정|보안 설정]] 방법
```properties
logging.level.org.springframework.security.web.FilterChainProxy=DEBUG
```
> 해당 설정을 통해서 [[2.Ref(데이터 및 정보 저장)/Spring/Security/FilterChainProxy|FilterChainProxy]] 의 로그를 참조 가능

최신의 3.2.3 버전의 `SecurityFilter` 의 개수는 설정에 따라 추가되고 삭제

> [!note] SecurityFilter 목록
> 1. DisableEncodeUrlFilter
> 2. WebAsyncManagerIntegrationFilter 
> 3. SecurityContextHolderFilter 
> 4. HeaderWriterFilter 
> 5. CorsFilter (CORS)
>6. CsrfFilter (CSRF 보안 적용 했을 때 등록)
> 7. LogoutFilter 
> 8. OAuth2AuthorizationRequestRedirectFilter
> 9. OAuth2LoginAuthenticationFilter (OAuth2 인증 응답)
> 10. UsernamePasswordAuthenticationFilter (로그인)
> 11. DefaultLoginPageGeneratingFilter (로그인 페이지)
> 12. DefaultLogoutPageGeneratingFilter (로그아웃 페이지)
> 13. BasicAuthenticationFilter (로그인된 사용자인지 확인)
> 14. RequestCacheAwareFilter 
> 15. SecurityContextHolderAwareRequestFilter 
> 16. AnonymousAuthenticationFilter 
> 17. SessionManagementFilter (세션 사용한다고 했을 때 등록)
> 18. ExceptionTranslationFilter 
> 19. AuthorizationFilter (권한 확인)

## 주의 사항
400 에러 발생 시 AuthorizationFilter 필터에서 ERROR 인 상태라도 filterErrorDispatch 의 값이 ...? 403 이었나 아니 왜 여기가 짤려있어 미친
## Filter 를 Spring Security FilterChain 에 주입 할 수 있는 방법
`addFilterBefore` 또는 `addFilterAfter` `addFilterAt` 사용
```java
@Configuration  
public class SecurityConfig {  
  @Bean  
  SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
  http.addFilterAfter(new CsrfCookieFilter(), BasicAuthenticationFilter.class);
  }
}
```

- addFilterBefore(오른쪽에 넣을 필터 이전에 동작할 필터, 대상이 되는 필터)
- addFilterAfter(오른쪽에 넣을 필터 이후에 동작할 필터, 대상이 되는 필터)
- addFilterAt(필터, 위치한 필터) : 정확히 같은 위치에 필터 체인을 두기 때문에 무엇이 먼저 실행될 지 알 수 없음(무작위)

Spring Security Filter 를 사용하기 위한 필터는 [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/OncePerRequestFilter|OncePerRequestFilter]] 를 사용

일단 필터 체인에 이렇게 많다는거 같은데?

[정리 나름 되어 있는 곳](https://somuchthings.tistory.com/196)



## SecurityFilter
해당 설정의 유무는 [[2.Ref(데이터 및 정보 저장)/Spring/Security/보안 설정|보안 설정]] 을  통해서 사용
### BasicAuthenticationFilter
인증이 완료된 사용자가 다시 들어왔을 때 검증을 하는 필터
로그인을 이미 완료한 사용자가 `Header` 에 가지고 있는 `Authorization` 헤더의 값을 추출해서 `Basic XXXXX:XXXXX` 보통 이런 형식의 데이터를 구분하여 인증된 사용자라는 것을 확인하는 필터
클라이언트에서는 `Authorization` 헤더를 전달해줘야만 인증을 확인할 수 있음
기본적인 인증 방법은 `Basic Base64(ID:PASS)` 형식으로 되어 있음
### AuthorizationFilter
URL 접근을 제한
공개 URL 일 경우 자격증명 요구하지 않음
### DefaultLoginPageGeneratingFilter
기본으로 만들어주는 `Login` 페이지를 만들어주는 역활
### UsernamePasswordAuthenticationFilter
`username과` `credentials`(자격검증)를 이용해서 `UsernamePasswordAuthenticationToken` 생성
`AuthenticationManager` 의 구현체인 `ProviderManager` 의 `authenticate` 함수를 통해 `UsernamePasswordAuthenticationToken` 전달하여 `AuthenticationProvider` 중에 하나라도 자격검증에 통과하는게 있다면 성공 없다면 실패

### OAuth2LoginAuthenticationFilter 
`{http}/login/oauth2/code/*` 인증 요청을 처리하도록 설정
`OAuth2LoginAuthenticationFilter` 상속 받기 때문에 [[#UsernamePasswordAuthenticationFilter]]와 동일한 기능
자격 검증을 하는 구간으로 보임
### OAuth2AuthorizationRequestRedirectFilter 
`{http}/oauth2/authorization/{registrationId}`
인증 요청을 받아서 인증 서버로 리다이렉트 처리
인증 실패할 경우 `ClientAuthorizationRequiredException` 에러 발생
