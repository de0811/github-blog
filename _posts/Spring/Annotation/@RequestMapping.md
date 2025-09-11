---
aliases:
  - "@RequestMapping"
tags:
  - Annotation
  - Spring
특징: URI
---

- 요청 정보를 [[2.Ref(데이터 및 정보 저장)/Spring/HandlerMapping]], [[2.Ref(데이터 및 정보 저장)/Spring/HandlerAdapter]] 등록 
```java
@RequestMapping("/hello-basic")
@RequestMapping("/hello-basic/") // 동일하게 처리
@RequestMapping({"/hello-basic", "hello-gogo"}) // 여러 URL 등록 가능
@RequestMapping("/hello-basic")
```
#### Parameters 
##### name
##### value 
##### path
##### method
###### @GetMapping

###### @PostMapping

###### @PutMapping

###### @PatchMapping

###### @DeleteMapping

##### params
[[Query String or URL Params or Query Parameters, Path Variable|Query String]]  조건이 맞을 경우만 동작
> [!example] `http://localhost:8080/mapping-param?mode=debug`
```java
/*  
파라메타로 추가 매핑  
params="mode",  
params="!mode",  
params="mode=debug",  
params="mode!=debug",  
params={"mode=debug", "data=good"},  
 */
 // http://localhost:8080/mapping-param?mode=debug
@GetMapping(value="/mapping-param", params="mode=debug")  
public String mappingParam() {  
  log.info("mappingParam");  
  return "ok";  
}
```
##### headers
header 데이터가 포함되어 있을 경우만 동작
```java
/*  
특정 헤더로 추가 매핑  
headers="mode",  
headers="!mode",  
headers="mode=debug",  
headers="mode!=debug",  
 */@GetMapping(value="/mapping-header", headers="mode=debug")  
public String mappingHeader() {  
  log.info("mappingHeader");  
  return "ok";  
}
```
##### consumes
Media Type 에 따라서 동작
```java
/*  
Content-Type 헤더 기반 추가 매핑 Media Typeconsumes="application/json",  
consumes="!application/json",  
consumes="application/*",  
consumes="*\/*",  
produces="text/html",  
produces="!text/html",  
produces="text/*",  
produces="*\/*",  
 */
//@PostMapping(value="/mapping-consume", consumes="application/json")
@PostMapping(value="/mapping-consume", consumes= MediaType.APPLICATION_JSON_VALUE)
public String mappingConsumes() {  
  log.info("mappingConsumes");  
  return "ok";  
}
```
##### produces
Client 전달해주는 Accept 헤더 기반으로 전달
이건 추후에 HTTP  기본 지식 정리할때 링크 걸어둬야할듯
```java
/*  
Accept 헤더 기반 Media Typeconsumes="application/json",  
consumes="!application/json",  
consumes="application/*",  
consumes="*\/*",  
produces="text/html",  
produces="!text/html",  
produces="text/*",  
produces="*\/*",  
 */
// @PostMapping(value="/mapping-produce", produces="text/html")  
@PostMapping(value="/mapping-produce", produces= MediaType.TEXT_HTML_VALUE)
public String mappingProduces() {  
  log.info("mappingProduces");  
  return "ok";  
}
```
