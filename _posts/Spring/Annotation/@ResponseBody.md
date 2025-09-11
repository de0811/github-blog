---
aliases:
  - "@ResponseBody"
tags:
  - Annotation
  - Spring/Response
특징: Response
---

응답 결과를 HTTP 메시지 바디에 직접 담아 전달
클래스의 [[#@RestController]] 사용할 경우 사용할 필요 없음
```HTTP
HTTP/1.1 200 
Content-Type: text/plain;charset=UTF-8
Content-Length: 2
Date: Mon, 27 Nov 2023 02:19:13 GMT
Keep-Alive: timeout=60
Connection: keep-alive

ok
```
#### 사용방법
##### 기본 사용 방법
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
##### JSON 반환 방법
```java
@ResponseBody  
@PostMapping("/request-body-json-v5")  
public HelloData requestBodyJsonV5(@RequestBody HelloData helloData) {  
  log.info("username={}, age={}", helloData.getUsername(), helloData.getAge());  
  return helloData;  
}
```