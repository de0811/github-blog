---
aliases:
  - "@ExceptionHandler"
tags:
  - Spring
  - Annotation
  - Annotation/Exception
  - Spring/Exception
특징:
---
# 설명
해당 어노테이션 이 호출된 컨트롤러 안에서만 동작되는 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|애노테이션(annotation)]] 
보통 API 처리에 많이 사용
처리 완료 후 따로 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ResponseStatus|@ResponseStatus]] 를 지정하지 않은 이상 HTTP Status 값을 200으로 변경
# 함수를 만들때 인자로 받을 수 있는 목록
[함수 인자로 받을 수 있는 목록](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-exceptionhandler.html#mvc-ann-exceptionhandler-args)
# 사용 방법
`HandlerExceptionResolver` 기능을 그대로 사용하는 것이기 때문에 해당 상태를 기본적으로 정상 상태(200)로 전환

```java
@ResponseStatus(HttpStatus.BAD_REQUEST)  
@ExceptionHandler(BadRequestException.class)  
public ErrorResult handleBadRequestException(BadRequestException e) {  
  log.error("[exceptionHandler] ex", e);  
  return new ErrorResult("BAD(@ExceptionHandler)", e.getMessage());  
}
```

[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ResponseStatus|@ResponseStatus]] 사용하지 않게 되면 정상처리로 200 으로 전달 되기 때문에 에러라고 명확히 표현하고 싶다면 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ResponseStatus|@ResponseStatus]]를 사용해야함

```java
@ExceptionHandler  
public ResponseEntity<ErrorResult> userExHandler(UserException e) {  
  log.error("[exceptionHandler] ex", e);  
  ErrorResult errorResult = new ErrorResult("USER-EX", e.getMessage());  
  return new ResponseEntity<>(errorResult, HttpStatus.BAD_REQUEST);  
}
```
> 해당 소스처럼 @ExceptionHandler(value=)의 값을 생략하면 파라메타 값을 기본으로 지정