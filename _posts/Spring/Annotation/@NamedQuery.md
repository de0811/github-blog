---
aliases:
  - "@NamedQuery"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 정적 쿼리를 정의할 때 사용
---
# @NamedQuery
- **정적 쿼리**를 정의할 때 사용 (쿼리에 이름 붙이기)
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|어노테이션]], XML 에 정의 가능
- 애플리케이션 로딩 시점에 초기화 후 재사용
- **애플리케이션 로딩 시점에 쿼리 검증**
	- 실행 시 먼저 검사되기 때문에 큰 장점
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Spring Data JPA|Spring Data JPA]] 사용할 때 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Query|@Query]] 를 만들때 사용
## 🚨 주의사항
- 관례로 이름을 붙일때 `엔티티이름.쿼리이름` 이런 형식으로 많이 작성 
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Spring Data JPA|Spring Data JPA]] 에서 해당 방법을 이용하여 이름으로 만들지만 직접적인 개발로 사용은 코드가 이쁘지 않음
## 🔍 속성 설명
```java
@Repeatable(NamedQueries.class)
@Target({TYPE}) 
@Retention(RUNTIME)
public @interface NamedQuery {
    String name();
    String query();
    LockModeType lockMode() default LockModeType.NONE;
    QueryHint[] hints() default {};
}

```
### 📌
## 🛠 사용 예제
```java title:"쿼리를 등록하는 방법"
@Setter
@Getter
@Entity
@ToString
@NamedQuery(
  name = "Member.findByUsername",
  query = "select m from Member m where m.username = :username"
)
public class Member {
  @Id @GeneratedValue
  @Column(name = "MEMBER_ID")
  private Long id;
  private String username;
  private int age;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "TEAM_ID")
  private Team team;
}
```

```java title:"main 에서 사용하는 방법"
List<Member> resultList = em.createNamedQuery("Member.findByUsername", Member.class)
	.setParameter("username", "member1")
	.getResultList();

for (Member member : resultList) {
	System.out.println("member = " + member);
	System.out.println("-> member.team = " + member.getTeam());
}
```