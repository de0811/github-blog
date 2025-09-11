---
aliases:
  - HandlerAdapter
  - RequestMappingHandlerAdapter
tags:
  - Spring
특징: 컨트롤러를 실행할 수 있도록 중간에서 연결해주는 어댑터 역활하는 인터페이스
isPublic: true
---
# HandlerAdapter
- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Controller|Controller(Handler)]] 를 실행할 수 있도록 중간에서 연결해주는 어댑터 역활하는 인터페이스
- [[2.Ref(데이터 및 정보 저장)/Spring/DispatcherServlet|DispatcherServlet]] 은 [[2.Ref(데이터 및 정보 저장)/Spring/HandlerMapping|HandlerMapping]] 통해서 처리할 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Controller|Controller(Handler)]]를 찾지만 어떤 타입인지 알지 못해 직접 실행할 수 없어서 [[2.Ref(데이터 및 정보 저장)/Spring/DispatcherServlet|DispatcherServlet]] 은 `HandlerAdapter`에게 해당 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Controller|Controller(Handler)]]를 처리할 수 있는지 물어보고 처리할 수 있는 어댑터를 찾아 실제 핸들러 실행을 위임
```java title:"HandlerAdapter.class"
public interface HandlerAdapter {
  boolean supports(Object handler);

  @Nullable
  ModelAndView handle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception;
}
```
> `supports` 함수를 통해서 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Controller|Controller(Handler)]]를 처리할 수 있는지 확인
## 구현체
### RequestMappingHandlerAdapter
[[@RequestMapping]] 등록된 함수의 인자와 반환될 내용이 정상인지 확인 
인자를 넣어주고 반환 값을 처리

컨트롤러에서 사용할 [[Argument]] 전달을 위해 [[RequestResponseBodyMethodProcessor]] 클래스를 사용하여 변환
컨트롤러의 반환 값을 Object To HTTP Message 로 만들기 위해 [[RequestResponseBodyMethodProcessor]] 사용