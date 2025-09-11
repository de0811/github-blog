---
aliases:
  - "@EnableWebSecurity"
tags:
  - Spring
  - Spring/Security
  - Annotation
  - Annotation/Security
특징: 
---
# @EnableWebSecurity
해당 어노테이션이 있어야만 Spring Security 기능을 제대로 사용 할 수 있음
[[#FilterChainProxy]] 클래스를 활성화(사실 없어도 활성화 되지만 로그 기능 및 다른 몇가지 기능들을 위해 어노테이션을 선언하는 것을 추천)
[[#FilterChainProxy]] 란 내장 필터를 연결하는데 사용되는 로직

`{java}@EnableWebSecurity(debug = true)`
이때의 `(debug = true)` 는 실제 사용에는 사용하지 않는 것을 추천
내부 필터 세부 정보 뿐 아니라 엔드 유저의 민감정보까지 로그에 출력

[[2.Ref(데이터 및 정보 저장)/Spring/Security/FilterChainProxy|FilterChainProxy]] 활성화하여 확인

```properties
logging.level.org.springframework.security.web.FilterChainProxy=DEBUG
```
> 해당 설정을 통해서 [[2.Ref(데이터 및 정보 저장)/Spring/Security/FilterChainProxy|FilterChainProxy]] 의 로그를 참조 가능