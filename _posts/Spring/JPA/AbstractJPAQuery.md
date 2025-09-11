---
aliases:
  - AbstractJPAQuery
  - JPQLQuery
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: 
---
# AbstractJPAQuery
- 쿼리를 생성하고 실행하는데 사용되는 추상 클래스
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPAQueryFactory|JPAQueryFactory]] 에 의해서 동작
## ⚙️ 설정
## 🚨 주의사항
## 🔍 속성 설명
### 쿼리 실행
- `fetch()` : 리스트 조회, 데이터 없으면 빈 리스트 반환
- `fetchOne()` : 단건 조회
	- 결과가 없으면 : `null`
	- 결과가 둘 이상이면 : `com.querydsl.core.NoneUniqueResultException`
- `fetchFirst()` : `limit(1).fetchOne()`
- `fetchResults()` : 페이징 정보 포함, total count 쿼리 추가 실행
- `fetchCount()`: count 쿼리로 변경해서 count 수 조회
### 📌
## 🛠 사용 예제