---
aliases: 
tags:
  - Annotation
  - Spring
  - HTTP/Cookie
  - Spring/Request
특징: Cookie
---

cookie 정보를 추출
```java
@RequestMapping("/headers")  
public String headers(
              @CookieValue(value="myCookie", required=false) String cookie  
) {  
  log.info("myCookie={}", cookie);  
  return "ok";  
}
```
