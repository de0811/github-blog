---
aliases:
  - Native SQL
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: 
---
# Native SQL
- 순정 DB에서 사용하는 SQL
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPQL|JPQL]] 로 해결되지 않는 문제를 JPA 가 DB 종속적인 기능을 제공
- ex) 오라클의 CONNECT BY, 같은 특정 DB만 사용하는 SQL
## 🚨 주의사항
## 🔍 속성 설명
### 📌
## 🛠 사용 예제
```java title:"단순하게 사용하는 소스" hl:10
public class JpaMain {
  public static void main(String[] args) {
    EntityManagerFactory emf = Persistence.createEntityManagerFactory("hello");
    PersistenceUnitUtil persistenceUnitUtil = emf.getPersistenceUnitUtil();
    EntityManager em = emf.createEntityManager();
    EntityTransaction transaction = em.getTransaction(); // JPA의 모든 데이터 변경은 트랜잭션 안에서 실행
    try {
      transaction.begin();
      
      List resultList = em.createNativeQuery("SELECT MEMBER_ID, CITY, STREET, ZIPCODE FROM MEMBER").getResultList();

      transaction.commit();
    } catch (Exception e) {
      transaction.rollback();
    } finally {
      em.close();
    }
    emf.close();
  }
}
```