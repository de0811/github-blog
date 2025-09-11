---
aliases:
  - "@RequestBody"
tags:
  - Annotation
  - Spring/Request
특징: Request
---
# @RequestBody
전달 되는 데이터는 POST, PUT, DELETE... 등등의 메서드를 통해서 전달되며 폼데이터가 아닌 HTTP 요청 본문(Body)의 내용을 처리
HTTP 메시지 바디 정보를 편리하게 조회
헤더 정보가 필요할 경우 [[HttpEntity]] 또는 [[#@RequestHeader ]] 사용하여 조회
[[HttpEntity]] 를 이용하여 만들어짐
- 빈생성자가 필수로 필요
#### 모든 내용을 String 으로 받는 방법
```java
@PostMapping("/request-body-json-v2")  
public String requestBodyJsonV2(@RequestBody String messageBody) throws IOException {  
  log.info("messageBody={}", messageBody);  
  
  HelloData helloData = objectMapper.readValue(messageBody, HelloData.class);  
  log.info("username={}, age={}", helloData.getUsername(), helloData.getAge());  
  return "ok";  
}  
```
#### JSON 데이터를 객체로 받는 방법
```java
@PostMapping("/request-body-json-v3")  
public String requestBodyJsonV3(@RequestBody HelloData helloData) {  
  log.info("username={}, age={}", helloData.getUsername(), helloData.getAge());  
  return "ok";  
}
```

> [!danger] [[#@RequestBody]] 을 생략하면 [[#@RequestParam]] 또는 [[#@ModelAttribute]] 붙기 때문에 생략할 수 없음
