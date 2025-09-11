---
aliases:
  - 인터셉터
  - Interceptor
  - HandlerInterceptor
tags:
  - Spring
  - Spring/Request
  - Spring/공통관심사
특징: 
---
# HandlerInterceptor
스프링이 제공하는 기능
> [!info] 전달 순서
> HTTP 요청 -> WAS -> 필터 -> 서블릿 -> 스프링 인터셉터 -> 컨트롤러

필터보다 더 편리하고 정교하고 다양한 기능을 지원

```java
public interface HandlerInterceptor {
// 컨트롤러 호출 전 | return true 다음으로 진행 / false 중지
 default boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {}
 // 컨트롤러 호출 이후 // 컨트롤러에서 에러가 터졌으면 여기 안옴
 default void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable ModelAndView modelAndView)throws Exception {}
 // HTTP 요청이 완전히 끝난 뒤 //final 기능임
 default void afterCompletion(HttpServletRequest request, HttpServletResponse
response, Object handler, @Nullable Exception ex) throws
Exception {}
}
```

![[config/AttachedFile/Pasted image 20240202150956.png]]

여러 상황에 대해 지원하기 때문에 필터보단 인터셉터를 사용하는 것을 추천
# 등록 방법
등록하기 위해선 [[2.Ref(데이터 및 정보 저장)/Spring/WebMvcConfigurer|WebMvcConfigurer]] 를 통해서 등록 가능
[[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/Interceptor|Interceptor]] 의 경우 Filter 처럼 DispatchType 을 사용할 수 없기 때문에 `excludePathPatterns`를 이용하여 제외 처리
```java
@Configuration  
public class WebConfig implements WebMvcConfigurer {  
  @Override  
  public void addInterceptors(InterceptorRegistry registry) {  
    registry.addInterceptor(new LogInterceptor())  
      .order(1)  
      .addPathPatterns("/**") // 적용할 URL 패턴  
      .excludePathPatterns("/css/**", "/*.ico", "/error", "/error-page/**"); // 제외할 경로  
  }
}
```
> 해당 소스처럼 에러 페이지 자체를 제외 처리를 해버리는 방법을 사용

[PathPatterns](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/util/pattern/PathPattern.html) 규칙은 공식 페이지 확인 필요
[[2.Ref(데이터 및 정보 저장)/Spring/Servlet|Servlet]] PathPatterns 와는 다름

# 사용
```java
@Slf4j  
public class LogInterceptor implements HandlerInterceptor {  
  @Override  
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {  
    log.info("LogInterceptor > preHandle");  
    String requestURI = request.getRequestURI();  
  
    // @RequestMapping: HandlerMethod  
    // 정적 리소스: ResourceHttpRequestHandler  
    if( handler instanceof HandlerMethod) {  
      HandlerMethod hm = (HandlerMethod) handler; // 호출할 컨트롤러 메서드의 모든 정보가 포함  
      log.info("REQUEST [{}][{}]", requestURI, hm.getBeanType().getName() + "." + hm.getMethod().getName());  
    } else {  
      log.info("REQUEST [{}][{}]", requestURI, handler);  
    }  
    return true;  
  }  
  
  @Override  
  public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {  
    log.info("LogInterceptor > postHandle");  
    String requestURI = request.getRequestURI();  
    log.info("REQUEST [{}][{}]",requestURI, modelAndView);  
  }  
  
  @Override  
  public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {  
    log.info("LogInterceptor > afterCompletion");  
    String requestURI = request.getRequestURI();  
    log.info("REQUEST [{}][{}]", requestURI, "afterCompletion");  
    if(ex != null) {  
      log.error("afterCompletion error!!", ex);  
    }  
    HandlerInterceptor.super.afterCompletion(request, response, handler, ex);  
  }  
}
```
### preHandle
`boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)`
HTTP 요청이 들어와서 [[2.Ref(데이터 및 정보 저장)/Spring/DispatcherServlet|DispatcherServlet]] 에서 바로 `preHandle` 로 전달
- `return boolean`
해당 인스턴스에서 기능을 정지시키려면 false 반환
다음 인스턴스 또는 컨트롤러로 동작을 진행 시키려면 true 반환
- `Object handle`
리소스의 종류에 따라 Object handle 의 상속 내용이 달라짐
  `@RequestMapping`을 사용하는 동적 컨트롤러 요청이라면 `HandlerMethod` 를 상속되어 있음
  정적 리소스 요청이라면 `ResourceHttpRequestHandler` 를 상속되어 있음
### postHandle
`Controller` 동작 이후 [[2.Ref(데이터 및 정보 저장)/Spring/DispatcherServlet|DispatcherServlet]] 에서 전달
만일 `Controller`에서 에러가 발생된다면 `postHandle`은 건너 뛰게 됨
- `Object Handler`
아마 [[#preHandle]] 과 동일한게 아닐까 싶음(필요한가?)
- `ModelAndView ModelAndView` 
`Controller`에서 전달된 `ModelAndView`
### afterCompletion 
`view`까지 모두 처리한 뒤에 호출(HTTP 메시지를 모두 처리 후 호출)
모든 결과의 `final` 같은 기능을 수행
`Controller`에서 에러가 발생하더라도 `afterCompletion`는 동작
