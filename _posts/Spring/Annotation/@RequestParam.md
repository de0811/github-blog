---
aliases:
  - "@RequestParam"
tags:
  - Annotation
  - Spring/Request
특징: Request
---

- ex)RequestParam("이름")
- [[HttpServletRequest]] .getParameter("이름") 으로 먼저 검색해서 전달
- GET의 [[Query String or URL Params or Query Parameters, Path Variable|쿼리 파라메터]] , Post의 Form 방식을 지원
- 기본 데이터 형이라면 사용가능 (int, Integer, String, ...)
- GET 방식이나 `application/x-www-form-urlencoded` HTML Form 방식으로 전달되는 경우만 가능
```java
@ResponseBody  
@RequestMapping("/request-param-v4")  
public String requestParamV4(String username, int age) {  
  log.info("username={}, age={}", username, age);  
  
  return "ok";  
}
```
> [!tip] 요청 [[Parameter|파라메타]]  의 이름이 같으며 단순타입(int,string,...) 이라면 @RequestParam 또한 생략 가능

```java
@ResponseBody  
@RequestMapping("/request-param-map")  
public String requestParamMap(  
  @RequestParam Map<String, Object> paramMap  
) {  
  log.info("username={}, age={}", paramMap.get("username"), paramMap.get("age"));  
  
  return "ok";  
}  
  
// http://localhost:8080/request-param-map?username=hello&age=20&username=hello2  
@ResponseBody  
@RequestMapping("/request-param-map")  
public String requestParamMultiMap(  
    @RequestParam MultiValueMap<String, Object> paramMap  
) {  
  log.info("username={}, age={}", paramMap.get("username"), paramMap.get("age"));  
  
  return "ok";  
}
```
> [!example] Map | MultiValueMap 사용 방법

#### [[Parameter]]
##### name
##### value
##### required
필수 유무를 설정 (default: true)
필수인데도 없이 보낼 경우 `Bad Request status=400` 에러 반환

> [!danger] required = false 인데 생략하는 [[Parameter|파라메터]]가 null 을 넣을 수 없는 경우
> `@RequestParam(required = false) int age` 경우 int 에 null이 올 수 없기 때문에 age를 보내지 않으면 `Internal Server Error, status=500` 에러 발생
```java
@ResponseBody  
@RequestMapping("/request-param-v5")  
public String requestParamV5(@RequestParam(required = true) String username,  
                             @RequestParam(required = false) int age  
) {  // age 생략시 500 에러 발생
  log.info("username={}, age={}", username, age);  
  
  return "ok";  
}
```

##### defaultValue
`defaultValue` 넣게 되면 [[#required]] 를 쓰는 의미가 없이 `required = true` 더라도 아무 값을 넣지 않아도 `defaultValue` 를 사용
> [!tip] @RequestParam(defaultValue = "guest") String username 
> `http:localhost:8080/request-param-default?username=`이렇게 빈 문자열을 넣더라도 `defaultValue` 의 값을 사용
