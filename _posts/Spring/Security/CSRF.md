---
aliases:
  - CSRF
tags:
  - Spring
  - Spring/Security
특징: 쿠키에 값 꽂아주면 헤더로 전달 못하면 차단박아 버리는 방법
---
# CSRF(CROSS-SITE REQUEST FORGERY)
CSRF 공격을 방어하기 위한 방법
Spring Security는 GET 요청을 제외한 모든 요청인 데이터베이스나 백엔드 내부의 데이터를 수정하고자 하는것을 막도록 되어 있음
CSRF를 완전히 비활성화 하는것은 추천하지 않는 방법 `csrf().disable()`
하지만 API 서버일 경우 세션을 `STATELESS`로 관리하기 때문에 `csrf().disable()` 을 사용해도 무관함
어차피 `JWT` 와 세션은 없기 떄문에 상관 없음
그렇다면 `CSRF`는 세션을 관리할 경우 발생하는 문제라고 생각해도 될 것 같은데
`CSRF` 의 공격 방법은 다른 사이트에서 나의 사이트에 요청을 만들어서 전달할때 쿠키가 자동으로 딸려 날아가면서 발생하는 문제
라고는 하는데 사실 쿠키를 같이 전달하는게 문제라면 `JWT` 관리 방식도 자동으로 전달되기 때문에 문제 아닌가?

> [!hint] 난 `permitAll()` 을 줬는데 !!!
`permitAll()` 도 줬는데 `401(Unauthorized)` 에러나 `403(Forbidden)` 에러가 발생하는 경우가 있는데
이럴땐 CSRF 설정을 해주었는지 확인해야함

보호할 필요 없는 공공으로 사용되는 API의 경우의 설정
```java
http.csrf(csrf -> csrf.ignoringRequestMatchers("/register"));
```

사용할때의 예제
```java
CsrfTokenRequestAttributeHandler csrfTokenRequestAttributeHandler = new CsrfTokenRequestAttributeHandler();  
csrfTokenRequestAttributeHandler.setCsrfRequestAttributeName("_csrf");  
  
http.securityContext(securityContext -> securityContext.requireExplicitSave(false));  
http.sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.ALWAYS));  
http.csrf(  
  csrf -> csrf.ignoringRequestMatchers("/register")  
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())  
    .csrfTokenRequestHandler(csrfTokenRequestAttributeHandler)  
);  
http.addFilterAfter(new CsrfCookieFilter(), BasicAuthenticationFilter.class);
```
## CsrfTokenRequestAttributeHandler
`CSRF` 토큰을 [[2.Ref(데이터 및 정보 저장)/Spring/HttpServletRequest|HttpServletRequest]].setAttribute() 로 등록시키는 역활
## CookieCsrfTokenRepository
`Cookie`로 `CSRF` 토큰을 전달하고 `Header`로 `CSRF` 토큰을 받아서 검증하는 방법
```java
http.csrf(  
  csrf -> csrf.ignoringRequestMatchers("/register")  
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())  
    .csrfTokenRequestHandler(csrfTokenRequestAttributeHandler)  
).addFilterAfter(new CsrfCookieFilter(), BasicAuthenticationFilter.class);
```
withHttpOnlyFalse 함수는 javascript 로도 처리가 가능하도록 하는 설정
React 등의 라이브러리를 사용할 경우 필수
### 프론트 처리 방법
```typescript
let xsrf = getCookie('XSRF-TOKEN')!;
window.sessionStorage.setItem("XSRF-TOKEN", xsrf);
```
> 서버에서 받은 XSRF 토큰을 저장

```typescript
let xsrf = sessionStorage.getItem('XSRF-TOKEN');
if( xsrf ) {
	httpHeaders = HttpHeaders.append('X-XSRF-TOKEN', xsrf);
}
```
> 서버에서 받은 XSRF 토큰을 다시 헤더에 담아서 전달

