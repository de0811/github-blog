---
aliases:
  - "@RegisteredOAuth2AuthorizedClient"
tags:
  - Spring
  - Spring/Security
  - Annotation
  - Annotation/Security
특징: 컨트롤러 메서드의 파라메터를 OAuth2AuthorizedClient 타입으로 자동 주입 방법
---
# @RegisteredOAuth2AuthorizedClient
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Controller|@Controller]] 메서드의 [[2.Ref(데이터 및 정보 저장)/개발 이론/Parameter|파라메터]]를  [[OAuth2AuthorizedClient]] 타입으로 자동 주입 하는 방법

```java
@GetMapping("/")
public String index(Model model, @RegisteredOAuth2AuthorizedClient OAuth2AuthorizedClient authorizedClient) {
    String clientName = authorizedClient.getClientRegistration().getClientName();
    // clientName을 사용하는 코드
    return "index";
}
```
