---
aliases: 
tags:
  - Annotation
  - Spring
  - HTTP/Header
  - Spring/Request
특징: Header
---

header 정보를 추출
```java
@RequestMapping("/headers")  
public String headers(
                      @RequestHeader MultiValueMap<String, String> headerMap,  
                      @RequestHeader("host") String host,  
) {  
  log.info("headerMap={}", headerMap);  
  log.info("header host={}", host);  
  return "ok";  
}
```

> [!tip] `MultiValueMap` 중복된 key를 가진 값을 저장 가능
