---
aliases:
  - "@PostConstruct"
tags:
  - Annotation
  - Java
  - JSR-250
  - Annotation/생성자
특징: Init
---
# @PostConstruct
[[JSR-250]] 제공하는 어노테이션
의존성 주입이 완료된 후에 실행되야하는 method 사용
다른 리소스에서 호출되지 않아도 실행
생성자보다 늦게 호출

> [!seealso] 호출 순서
> 1. 생성자 호출
> 2. 의존성 주입([[@Autowired]] || [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RequiredArgsConstructor|@RequiredArgsConstructor]] )
> 3. @PostCo[](2.Ref(데이터%20및%20정보%20저장)/Spring/Annotation/@Autowired.md)2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AOP|AOP]] 적용되지 않은 시점에 동작할 가능성 있음
다른 것들이 초기화된 시점이 아닌 아무 초기에 실행되기 때문에 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@EventListener|@EventListener]] 의 사용을 추천

## 역활
스프링 빈 생성 이후에 빈을 초기화 하는 역활
[[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/Proxy|BeanPostProcessor]] 를 사용하여 AOP 등록하는 용도로 쓰는 듯
Spring 에서 또한 `CommonAnnotationBeanPostProcessor` 를 호출해서 내부에선 [[#@PostConstruct]] 를 사용

