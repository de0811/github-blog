---
aliases:
  - HttpEntity
  - ResponseEntity
  - RequestEntity
tags:
  - Spring
---

# HttpEntity
[[HttpServletRequest#InputStream 으로 데이터 읽는 방법|InputStream 읽는 방법]] 과 [[HttpServletRequest#JSON 으로 데이터 읽는 방법|JSON 읽는 방법]] 두가지를 사용하여 만들어진 기능
HTTP Header, body 정보를 편하게 조회할 수 있도록 하는 것
HttpEntity 응답으로도 사용 가능
[[2.Ref(데이터 및 정보 저장)/Spring/변환기/HttpMessageConverter]] 인터페이스를 이용해 HTTP 메시지 바디를 읽어 문자나 객체로 변환
[[2.Ref(데이터 및 정보 저장)/Spring/변환기/HttpMessageConverter#StringHttpMessageConverter|StringHttpMessageConverter]] 구현체 사용

> [!caution] 해당 기능을 HttpEntity 를 사용하는 것으로 축약

![[HttpServletRequest#InputStream 으로 데이터 읽는 방법]]


## 사용법
### 문자열 사용 방법
```java
@PostMapping("/request-body-string-v3")  
public HttpEntity<String> requestBodyStringV3(RequestEntity<String> httpEntity) {  
  String messageBody = httpEntity.getBody();  
  log.info("messageBody={}", messageBody);  
  return new ResponseEntity<>("ok", HttpStatus.CREATED);  
}
```
### 객체 사용 방법
```java
@PostMapping("/request-body-json-v4")  
public String requestBodyJsonV4(HttpEntity<HelloData> httpEntity) {  
  HelloData helloData = httpEntity.getBody();  
  log.info("username={}, age={}", helloData.getUsername(), helloData.getAge());  
  return "ok";  
}
```

## RequestEntity 
HttpMethod, URL 추가 정보, 요청에서 사용

## ResponseEntity 
HTTP 상태 코드 설정 가능, 응답에서 사용
[[@ResponseStatus]] + [[@ResponseBody]] 동일 기능
```java
return new ResponseEntity<>(helloData, HttpStatus.OK);
```
### 기본적인 사용 방법
```java
@GetMapping("/response-body-string-v2")  
public ResponseEntity<String> responseBodyV2() {  
  return new ResponseEntity<>("ok", HttpStatus.OK);  
}
```



![[2.Ref(데이터 및 정보 저장)/Spring/HTTP/Cache-Control|Cache-Control 사용 방법]] 
