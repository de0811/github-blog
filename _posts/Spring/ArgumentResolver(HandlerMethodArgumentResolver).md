---
aliases:
  - ArgumentResolver
  - HandlerMethodArgumentResolver
  - ArgumentResolver(HandlerMethodArgumentResolver)
tags:
  - Spring
  - Spring/Converter
특징: 컨트롤러 함수(Handler Method)의 파라메터를 동적으로 만들어주는 인터페이스
isPublic:
---
# ArgumentResolver(HandlerMethodArgumentResolver)
- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Controller|Controller(Handler)]]의 매핑된  [[2.Ref(데이터 및 정보 저장)/개발 이론/Parameter|파라메터]]를 동적으로 만들어주는 인터페이스 
- [[@RequestMapping]] 사용하는 함수에서 각각에 필요한 인자를 넣어주기 위한 인터페이스
```java
@RequstMapping("/api/engines")
public String engineList(@RequestBody EngineSelect engineSelect) {}
```
> `EngineSelect engineSelect` 을 넣어주는 기능

[인자를 지원하는 목록](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/arguments.html)

짧게 `ArgumentResolver` 라고 말하며 전체 이름은 `HandlerMethodArgumentResolver` 라는 인터페이스 
## Before & After
### Before 
- 모든 컨트롤러마다 세션을 확인하고, 객체를 형변환하는 코드가 반복적으로 들어감
```java title:"예전 방식은 HttpServletRequest 직접 변환 필요"
@GetMapping("/items")
public String items(HttpServletRequest request) {
    // 세션에서 회원 정보를 찾는 반복적인 로직
    HttpSession session = request.getSession(false);
    if (session == null || session.getAttribute(SessionConst.LOGIN_MEMBER) == null) {
        // 로그인하지 않은 사용자에 대한 처리
        return "redirect:/login";
    }
    
    Member loginMember = (Member) session.getAttribute(SessionConst.LOGIN_MEMBER);
    // ...
}
```
### After 
- ArgumentResolver 생기고 바뀐 모습
```java
@GetMapping("/items")
public String items(@Login Member loginMember) {
    // ArgumentResolver가 세션 처리를 모두 끝내고 Member 객체를 주입해 줌
    if (loginMember == null) {
        return "redirect:/login";
    }
    // ...
	}
```
# 사용방법 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|annotation]] 만들기

> [!todo] 이 방법 제대로 사용한다면 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RequestBody|@RequestBody]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ModelAttribute|@ModelAttribute]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RequestParam|@RequestParam]] 모두 한번에 묶어서 만들 수 있을 것 같은데 연구 필요
## Annotation 만들기
```java
import java.lang.annotation.Retention;  
import java.lang.annotation.Target;  
@Target({java.lang.annotation.ElementType.PARAMETER}) // 이렇게 하면 파라미터에만 사용할 수 있다.  
@Retention(java.lang.annotation.RetentionPolicy.RUNTIME) // 이렇게 하면 런타임까지 유지된다. 실제 실행시에도 유지된다.  
public @interface Login {  
}
```
> Login.java

```java
@Slf4j  
public class LoginMemberArgumentResolver implements HandlerMethodArgumentResolver {  
  
  @Override  
  public boolean supportsParameter(MethodParameter methodParameter) {  
    log.info("supportsParameter 실행");  
  
    boolean hasLoginAnnotation = methodParameter.hasParameterAnnotation(Login.class);  
    boolean hasMemberType = Member.class.isAssignableFrom(methodParameter.getParameterType());  
  
    return hasLoginAnnotation && hasMemberType;  
  }  
  
  @Override  
  public Object resolveArgument(MethodParameter methodParameter, ModelAndViewContainer modelAndViewContainer, NativeWebRequest nativeWebRequest, WebDataBinderFactory webDataBinderFactory) throws Exception {  
    log.info("resolveArgument 실행");  
  
    HttpServletRequest request = (HttpServletRequest) nativeWebRequest.getNativeRequest();  
    HttpSession session = request.getSession(false);  
    if (session == null) {  
      return null;  
    }  
  
    return session.getAttribute(SessionConst.LOGIN_MEMBER);  
  }  
}
```
> LoginMemberArgumentResolver.java
- MethodParameter: 파라미터 정보 (어노테이션 정보, 타입 정보 등)  
- ModelAndViewContainer: ModelAndView를 생성할 때 사용 (뷰 이름, 뷰 객체 등)  
- NativeWebRequest: request, response를 다룰 수 있는 인터페이스 (HttpServletRequest, HttpServletResponse 등)  
- WebDataBinderFactory: 파라미터 바인딩, 검증 기능 제공 (데이터 바인딩, 검증)  
# 등록 방법
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
  @Override
  public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
    resolvers.add(new LoginMemberArgumentResolver());
  }
}
```

