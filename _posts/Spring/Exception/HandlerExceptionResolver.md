---
aliases:
  - HandlerExceptionResolver
tags:
  - Spring
  - Spring/Exception
특징:
---
# HandlerExceptionResolver 
컨트롤러 바로 다음 단계에서 `Exception` 처리하는 기능
![[config/AttachedFile/Pasted image 20240207160458.png]]
> 기존의 Exception 과정

![[config/AttachedFile/Pasted image 20240207160544.png]]
> ExceptionResolver 적용 후

`ExceptionResolver`등록하게 되면 에러가 발생하면 중간에 `ExceptionResolver` 로 전달


## 등록 방법
 ![[2.Ref(데이터 및 정보 저장)/Spring/WebMvcConfigurer#2.Ref(데이터 및 정보 저장)/Spring/Exception/HandlerExceptionResolver HandlerExceptionResolver 등록 방법]]


## 사용방법
```java
@Slf4j  
public class MyHandlerExceptionResolver implements HandlerExceptionResolver {  
  @Override  
  public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {  
    try {  
      if(ex instanceof IllegalArgumentException) {  
        //// 이렇게 해결하는 방법은 WAS로 넘어가기 전에 처리하는 방법 Page 처리 유리
//      return new ModelAndView("error/400");  
        response.sendError(HttpServletResponse.SC_BAD_REQUEST, ex.getMessage());  
        return new ModelAndView();  
      }  
    } catch (IOException e) {  
      throw new RuntimeException(e);  
    }  
  
    log.error("handle ex", ex);  
    // null을 반환하면 다음 ExceptionResolver가 처리한다.  
    return null;  
  }  
}
```
### 반환 값에 따른 처리 방법
- `new ModelAndView()` : 뷰를 렌더링하지 않고, 정상 흐름으로 서블릿이 리턴
- `ModelAndView` 지정 : `ModelAndView` 에 `View`, `Model`등의 정보를 지정하여 반환하면 뷰 렌더링 진행
	- 단점으로 status 값이 200으로 전달
- `null`: 다음 `ExceptionResolver`를 찾아 실행, 만일 끝까지 처리 안된다면 기존에 발생한 예외를 서블릿 밖으로 전달 (WAS한테 준다는 말이겠지)

추가 예제 소스
```java
@Slf4j  
public class UserHandlerExceptionResolver implements HandlerExceptionResolver {  
  ObjectMapper objectMapper = new ObjectMapper();  
  @Override  
  public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {  
    try {  
      if( ex instanceof UserException ) {  
        log.info("UserException resolver to 400");  
        String accept = request.getHeader("accept");  
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);  
        if(accept.matches(".*application/json.*")) {  
          log.info("json response");  
          Map<String, Object> errorResult = Map.of(  
            "ex", ex.getClass().getName(),  
            "message", ex.getMessage()  
          );  
          String result = objectMapper.writeValueAsString(errorResult);  
  
          response.setContentType("application/json");  
          response.setCharacterEncoding("utf-8");  
          response.getWriter().write(result);  
          return new ModelAndView();  
        } else if (accept.matches(".*text/html.*")) {  
          log.info("html response");  
          // 뷰 리졸버를 사용해서 뷰를 렌더링한다.  
//          return new ModelAndView();  
          // status는 200으로 내려가고, 뷰 리졸버가 렌더링한다.  
          return new ModelAndView("error/500");  
        }  
      }  
    }catch (Exception e) {  
      e.printStackTrace();  
    }  
    return null;  
  }  
}
```
> json 형태로도 보내고 html 형태도 보내는 방법
## spring 제공하는 ExceptionResolver
- `ExceptionHandlerExceptionResolver`
- `ResponseStatusExceptionResolver`
- `DefaultHandlerExceptionResolver` -> 가장 낮은 우선 순위
### `ExceptionHandlerExceptionResolver`
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ExceptionHandler|@ExceptionHandler]] 을 처리
### `ResponseStatusExceptionResolver`
HTTP 상태 코드를 지정
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ResponseStatus|@ResponseStatus]] 처리
`@ResponseStatus(value = HttpStatus.NOT_FOUND`)

```java
@GetMapping("/api/response-status-ex2")  
public String responseStatusEx2() {  
  throw new ResponseStatusException(HttpStatus.NOT_FOUND, "error.bad", new IllegalArgumentException());  
}
```
> 상태 코드와 오류 메세지를 한번에 처리하는 방법
### `DefaultHandlerExceptionResolver`
스프링 내부 기본 예외를 처리