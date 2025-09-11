---
aliases:
  - "@Conditional"
tags:
  - Spring
  - Annotation
  - Spring/Configration
특징: 
---
# @Conditional
- 조건부로 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Component|@Component]] 또는 [[@Bean]] 등록할 때 사용하는 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|애노테이션]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/Configuration/Condition|Condition]] 클래스와 함께 사용
- 보통 [[2.Ref(데이터 및 정보 저장)/Spring/Spring boot|Spring boot]]  자동 구성에 사용

## [[2.Ref(데이터 및 정보 저장)/Spring/Spring boot|Spring boot]] 에서 확장한 종류
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ConditionalOnClass|@ConditionalOnClass]], [[@ConditionalOnMissingClass]]  : 클래스가 정의되어 있거나 없거나 할때 동작
- [[@ConditionalOnBean]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ConditionalOnMissingBean|@ConditionalOnMissingBean]] : 빈이 등록되어 있거나 없거나 할때 동작
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ConditionalOnProperty|@ConditionalOnProperty]] : [[2.Ref(데이터 및 정보 저장)/Spring/Configuration/Environment|외부 설정]]이 있는 경우 동작
-  [[@ConditionalOnResource]] : 리소스가 있는 경우 동작
- [[@ConditionalOnWebApplication]], [[@ConditionalOnNotWebApplication]] : 웹 애플리케이션인 경우 동작
- [[@ConditionalOnExpression]] : [[SpEL (Spring Expression Language)]] [[0.New Note/SpEL (Spring Expression Language)|SpEL (Spring Expression Language)]] 표현식에 만족하는 경우 동작
- [[2.Ref(데이터 및 정보 저장)/Spring/Configuration/@Profile|@Profile]] : profile 이 동일할 경우
 

