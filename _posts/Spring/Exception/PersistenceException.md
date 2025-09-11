---
aliases:
  - PersistenceException
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: JPA 만의 에러 처리 흐름
---
# PersistenceException
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPA|JPA]] 가 사용하는 최상위 [[Exception]]
- [[2.Ref(데이터 및 정보 저장)/Spring/1.Spring MVC|Spring]] 하위 기술이 아니기 때문에 자체적인 [[Exception]] 흐름 사용
	- 추가로 `IllegalStateException` , `IllegalArgumentException` 발생 할 수 있음
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPA|JPA]] 예외가 다르기 때문에 [[2.Ref(데이터 및 정보 저장)/Spring/1.Spring MVC|Spring]] 예외 추상화로 변경하는 방법 필요
	- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Repository|@Repository]] 사용 시 자동으로 변환
