---
aliases:
  - "@Repository"
tags:
  - Spring
  - Annotation
  - spring/Repository
특징: 
---
# @Repository
- 이 어노테이션이 붙은 클래스는 컴포넌트 스캔의 대상
- 이 어노테이션이 붙은 클래스는 예외 변환 [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AOP|AOP]] 적용 대상

## 예외 변환 [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AOP|AOP]] 적용 대상
스프링과 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPA|JPA]] 함께 사용하는 경우 스프링은 JPA 예외 변환기 `PersistenceExceptionTranslator` 등록
스프링 부트는 `PersistenceExceptionTranslationPostProcessor` 자동으로 등록하여 내부적으로 `@Repository` 를 모두 예외 변환 [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AOP|AOP]] 프록시를 생성
예외 변환 [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AOP|AOP]] 프록시는 JPA 관련 예외가 발생하면 JPA 예외 변환기를 통해 발생한 예외를 스프링 데이터 접근 예외([[2.Ref(데이터 및 정보 저장)/Spring/Exception/DataAccessException]])로 변환
