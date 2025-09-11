---
aliases:
  - Proxy
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: 
---
# Proxy
- 객체 내부의 다른 객체도 바로 로딩이 필요하지 않을 때 사용 ([[2.Ref(데이터 및 정보 저장)/Spring/JPA/FetchType|FetchType.LAZY]] 또는 `em.getReference()` 사용 )
## 🚨 주의사항
- 프록시 객체는 처음 사용할 때 한번만 초기화
- 프록시 객체를 초기화할 때 프록시 객체가 실제 엔티티로 바뀌는 것이 아닌 내부에 들고 있는 `target` 에 엔티티를 담음
- 프록시 객체는 원본 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]]를 상속 받음
	- == 비교 대신 `instance of` 사용
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|영속성 컨텍스트]]에 찾는 엔티티가 이미 있으면 `em.getReference()` 를 호출해도 실제 엔티티 반환
-  [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|영속성 컨텍스트]]의 도움을 받을 수 없는 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/준영속|준영속 상태]]일 때 프록시 초기화 문제 발생
	- [[하이버네이트]]는 `org.hibernate.LazyInitializationException` 예외 발생
## 🛠 사용 예제

```java title:"Proxy 로딩 확인"
public class JpaMain {

    public static void main(String[] args) {

        EntityManagerFactory emf = Persistence.createEntityManagerFactory("hello");
        EntityManager em = emf.createEntityManager();
        EntityTransaction transaction = em.getTransaction();
        try {
            transaction.begin();
            //code
            Member member = new Member();
            member.setName("member1");
            member.setCreatedBy("kim");
            em.persist(member);

            em.flush();
            em.clear();

//            Member findMember = em.find(Member.class, member.getId());
//            System.out.println("findMember = " + findMember.getClass());

            //Proxy 객체
            Member findMember = em.getReference(Member.class, member.getId());
            System.out.println("findMember = " + findMember.getClass());
            System.out.println("-------Proxy 로딩 후-------");
            System.out.println("findMember.id = " + findMember.getId());
            System.out.println("findMember = " + findMember.getClass());

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