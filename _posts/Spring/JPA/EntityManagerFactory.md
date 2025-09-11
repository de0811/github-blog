---
aliases:
  - EntityManagerFactory
tags:
  - Spring
  - Spring/JPA
특징: EntityManager 관리하는 팩토리
---
# EntityManagerFactory
- 하나만 생성해서 애플리케이션 전체에서 공유하여 사용
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/EntityManager|EntityManager]] 관리하는 팩토리
- persistence.xml([[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence]] ) 에 정의된 것
- 스레드 세이프함
```java
EntityManagerFactory emf = Persistence.createEntityManagerFactory("hello");
```
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/PersistenceUnitUtil|PersistenceUnitUtil]] 사용 가능
## 🚨 주의사항
## 🔍 속성 설명
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/PersistenceUnitUtil|PersistenceUnitUtil]]  [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Proxy|Proxy]] 가 현재 로딩이 되었는지 확인
### 📌
## 🛠 사용 예제