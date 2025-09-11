---
aliases:
  - flush
tags:
  - Spring
  - Spring/용어
  - Spring/JPA
특징: 영속성 컨텍스트 변경 내용을 데이터베이스에 반영
---
# flush
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|영속성 컨텍스트]]변경 내용을 데이터베이스에 반영
## 호출 일어나는 시기
- `em.flush()`  : 강제 호출 방법
- [[2.Ref(데이터 및 정보 저장)/Spring/Repository/1.Transaction|Transaction]]  commit : flush 자동 호출
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPQL|JPQL]]  쿼리 실행 : flush 자동 호출