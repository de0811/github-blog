---
aliases:
  - FetchType
  - FetchType.LAZY
  - FetchType.EAGER
  - 즉시 로딩
  - 지연 로딩
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: 
---
# FetchType
- 늦게 받아올지 처음부터 받아올지 설정
## 🚨 주의사항
### Lazy 사용 추천
- 가급적이면 지연 로딩만 사용하는 것을 추천
- 즉시 로딩 적용 시 예상치 못한 SQL 발생
- 즉시 로딩은 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPQL|JPQL]] 에서 N + 1 문제 발생
	- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPQL|JPQL]] 은 가져올 데이터 타입만 보고 일단 `Query`를 작성 후 실행한 뒤 
	  내부에 또 다른 데이터가 있는 것을 보고 또 SELECT `Query`를 가져오기 떄문에 여러번의 `Query` 발생
	- 해당 행동은 만약 목록을 가져오는 경우 N + 내부 객체 개수 만큼 또 Query를 발생 시킴
	- 해결 방법으로 `fetch join` 을 사용 또는 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 그래프 기능 사용
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ManyToOne|@ManyToOne]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@OneToOne|@OneToOne]] 은 기본이 EAGER 사용하기 때문에 LAZY로 설정 필요
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@OneToMany|@OneToMany]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ManyToMany|@ManyToMany]] 기본이 LAZY 사용
## 🔍 속성 설명
```java
public enum FetchType {
    LAZY,
    EAGER
}
```
> `LAZY` : 지연 로딩
> `EAGER` : 즉시 로딩
### 📌
## 🛠 사용 예제