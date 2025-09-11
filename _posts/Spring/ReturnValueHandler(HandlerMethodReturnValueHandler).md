---
aliases:
  - ReturnValueHandler
  - HandlerMethodReturnValueHandler
tags:
  - Spring
특징: 응답 처리
isPublic: true
---
# ReturnValueHandler(HandlerMethodReturnValueHandler)
- [[@RequestMapping]] 사용하는 함수에서 반환 값을 HTTP 형태로 변환 하기 위한 인터페이스
- [[2.Ref(데이터 및 정보 저장)/Spring/ArgumentResolver(HandlerMethodArgumentResolver)|ArgumentResolver]] 는 요청을 처리하기 위한 것이라면 이것은 그 반대로 응답을 처리하기 위한 것
- [지원하는 반환 목록](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/return-types.html)
```java title:"인터페이스 코드"
public interface HandlerMethodReturnValueHandler {
  // 반환하려는 값을 지원하는지 확인하는 함수
  boolean supportsReturnType(MethodParameter returnType);

  // 반환하려는 값을 처리
  void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType, ModelAndViewContainer mavContainer, NativeWebRequest webRequest) throws Exception;
}
```
## 내부 동작 흐름
- `ReturnValueHandler`는 [[2.Ref(데이터 및 정보 저장)/Spring/HandlerAdapter|HandlerAdapter]]  내부에서 동작합니다
1.  [[2.Ref(데이터 및 정보 저장)/Spring/DispatcherServlet|DispatcherServlet]] 이 [[2.Ref(데이터 및 정보 저장)/Spring/HandlerAdapter|HandlerAdapter]] 를 통해 컨트롤러 메소드를 실행
2.  컨트롤러가 특정 값(예: `String` `"home"`)을 반환
3.  [[2.Ref(데이터 및 정보 저장)/Spring/HandlerAdapter|HandlerAdapter]] 는 반환 값을 받아서, 등록된 `HandlerMethodReturnValueHandler` 목록을 순회
4.  각 `ReturnValueHandler`에게 **"이 반환 타입을 네가 처리할 수 있니?"**라고 질문 (`supportsReturnType` 호출)
5.  `ViewNameMethodReturnValueHandler`가 "네, `String`은 제가 처리할 수 있습니다"라고 응답 (`true` 반환)
6.  `HandlerAdapter`는 해당 핸들러에게 작업을 위임 (`handleReturnValue` 호출)
7.  `ViewNameMethodReturnValueHandler`는 반환된 `String` 값을 뷰 이름으로 사용하여 `ModelAndView` 객체를 생성하고, 이를 `DispatcherServlet`에 전달하여 뷰 렌더링 절차를 밟게 함
## 다른 컴포넌트와의 관계
-   [[2.Ref(데이터 및 정보 저장)/Spring/HandlerAdapter|HandlerAdapter]]: `ReturnValueHandler`를 **실행**하는 주체
-   [[2.Ref(데이터 및 정보 저장)/Spring/변환기/HttpMessageConverter|HttpMessageConverter]] : [[2.Ref(데이터 및 정보 저장)/Spring/RequestResponseBodyMethodProcessor|RequestResponseBodyMethodProcessor]]가 객체를 JSON 등으로 변환할 때 **사용**하는 도구
-   [[2.Ref(데이터 및 정보 저장)/Spring/ArgumentResolver(HandlerMethodArgumentResolver)|ArgumentResolver]] : 요청 처리 파트너. [[2.Ref(데이터 및 정보 저장)/Spring/ArgumentResolver(HandlerMethodArgumentResolver)|ArgumentResolver]] 가 요청을 객체로 만들고, `ReturnValueHandler`가 객체를 응답으로 만듦
## 구현체
| 컨트롤러 반환 값               | 선택되는 `ReturnValueHandler`              | 최종 결과                                              |
| :---------------------- | :------------------------------------- | :------------------------------------------------- |
| `String`                | `ViewNameMethodReturnValueHandler`     | `ModelAndView` 생성 후 뷰 렌더링                          |
| `ModelAndView`          | `ModelAndViewMethodReturnValueHandler` | `ModelAndView` 그대로 사용하여 뷰 렌더링                      |
| `@ResponseBody` + `DTO` | `RequestResponseBodyMethodProcessor`   | `HttpMessageConverter`를 사용해 DTO를 JSON 등으로 변환 후 응답  |
| `ResponseEntity<DTO>`   | `HttpEntityMethodProcessor`            | `ResponseEntity`의 상태코드, 헤더, Body(객체)를 HTTP 응답으로 변환 |
| `void`                  | `ModelAndViewMethodReturnValueHandler` | 요청 URL을 기반으로 뷰를 렌더링 시도                             |

> [!tip] RequestResponseBodyMethodProcessor
> 이 클래스는 `ArgumentResolver`이면서 동시에 `ReturnValueHandler`입니다
> `@RequestBody` 처리(요청)와 `@ResponseBody` 처리(응답)를 모두 담당하는 만능 해결사입니다
### ViewNameMethodReturnValueHandler
