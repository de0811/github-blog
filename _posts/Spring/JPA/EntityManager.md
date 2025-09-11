---
aliases:
  - EntityManager
tags:
  - Spring
  - Spring/JPA
특징:
---
# EntityManager
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/EntityManagerFactory|EntityManagerFactory]] 를 통해서 만들어지는 `EntityManager`
- 하나의 스레드에서 동작하며 다른 스레드간에 공유되어선 안됨(스레드 세이프하지 않음)
```java
EntityManagerFactory emf = Persistence.createEntityManagerFactory("hello");
EntityManager em = emf.createEntityManager();
```
