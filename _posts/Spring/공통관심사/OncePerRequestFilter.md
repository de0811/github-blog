---
aliases:
  - OncePerRequestFilter
  - GenericFilterBean
tags:
  - Spring
  - Spring/Security
  - Spring/공통관심사
특징: Spring Security 의 Filter의 확장
---
# GenericFilterBean
매개변수, 초기 매개변수, 서블릿 컨텍스트에 접근해야하는 경우 사용
환경변수, properties, ServletContext




# OncePerRequestFilter
GenericFilterBean 클래스를 상속받은 필터
필터를 Spring Security FilterChain 에 구성하려 할때 필터가 요청당 한번만 실행된다고 보장하지 않음
그 보장을 원할 경우 사용하는 필터

`boolean shouldNotFilter(HttpServletRequest request)`
서브 클래스에서 오버라이드 할 수 있는 메서드
특정 HTTP 요청이 필터링 대상에서 제외 되어야 하는지 결정
web API 일부 REST API 경로에 대해 이 필터를 실행하고 싶지 않다면 반환 값은 `true` 반환
기본 `false` 반환

