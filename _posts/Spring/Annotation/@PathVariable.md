---
aliases:
  - "@PathVariable"
tags:
  - Annotation
  - Spring/Request
특징: URI
---

- [[Query String or URL Params or Query Parameters, Path Variable|Path Variable]] 사용할 때 필요
[[Parameter]] name 과 value 는 같은 것
```java
@GetMapping("/mapping/{userId}")  
// @PathVariable("userId") 받는 변수 이름과 다를 경우 이렇게 지정 가능
public String mappingPath(@PathVariable("userId") String userId) {  
  log.info("mappingPath userId={}", userId);  
  return "ok";  
}
```
- 다중 매핑
```java
// PathVariable 다중 사용  
@GetMapping("/mapping/users/{userId}/orders/{orderId}")  
public String mappingPath(@PathVariable("userId") String userId, @PathVariable("orderId") Long orderId) {  
  log.info("mappingPath userId={}, orderId={}", userId, orderId);  
  return "ok";  
}
```

