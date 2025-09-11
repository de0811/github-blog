---
aliases:
  - "@ResponseStatus"
tags:
  - Annotation
  - Spring/Response
특징: Response
---

응답 상태를 HTTP 메세지에 담아 전달
[[#@ResponseBody]] 를 함께 쓰거나 클래스의 [[#@RestController]] 사용할 경우 사용 가능

# 동일 기능
```java
response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ex.getMessage());
```
해당 방법처럼 response 를 이용해서 sendError 발생 가능

# 사용방법
## Controller
```java
@ResponseStatus(HttpStatus.OK)  
@ResponseBody  
@GetMapping("/response-body-json-v2")  
public HelloData responseBodyJsonV2() {  
  HelloData helloData = new HelloData();  
  helloData.setUsername("userA");  
  helloData.setAge(20);  
  
  return helloData;  
}
```

## Exception
```java
@ResponseStatus(
	code = org.springframework.http.HttpStatus.BAD_REQUEST, 
	reason = "잘못된 요청 오류"
)  
public class BadRequestException extends RuntimeException {  
}
```

# 옵션
`reason`을 메세지 코드로도 사용가능 (사용 방법은 그냥 메세지 코드를 넣으면 됨)
```java
@ResponseStatus(
	code = org.springframework.http.HttpStatus.BAD_REQUEST, 
	reason = "error.bad"
)  
public class BadRequestException extends RuntimeException {  
}
```