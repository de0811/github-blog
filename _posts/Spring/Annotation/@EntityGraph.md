---
aliases:
  - "@EntityGraph"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 
---
# @EntityGraph
-  [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPQL#✨페치 조인 (fetch join)|fetch join]]  으로 사용
## 🚨 주의사항
## 🔍 속성 설명
### 📌
## 🛠 사용 예제
### 동일 동작
```java title:"JPQL 사용한 fetch join 방법"
public interface MemberRepository extends JpaRepository<Member, Long> {
  @Query("select m from Member m left join fetch m.team")
  List<Member> findMemberFetchJoin();
}
```

```java title:"자동 방식"
public interface MemberRepository extends JpaRepository<Member, Long> {
  @Override
  @NonNull
  @EntityGraph(attributePaths = {"team"})
  List<Member> findAll();
}
```
```java title:"jpql 혼용 방법"
public interface MemberRepository extends JpaRepository<Member, Long> {
@EntityGraph(attributePaths = {"team"})  
@Query("select m from Member m")  
List<Member> findMemberEntityGraph();
}
```
### [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@NamedEntityGraph|@NamedEntityGraph]] 
-  [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@NamedEntityGraph|@NamedEntityGraph]] 사용 예제
```java title:"팀을 fetch join 방법"
@NamedEntityGraph(name = "Member.all", attributeNodes = @NamedAttributeNode("team"))
public class Member {
  @Id @GeneratedValue
  @Column(name = "member_id")
  private Long id;
  private String username;
  private int age;
  @ManyToOne(fetch = FetchType.LAZY)  
	@JoinColumn(name = "team_id")  
	Team team;
}

public interface MemberRepository extends JpaRepository<Member, Long> {
  @EntityGraph("Member.all")  
  List<Member> findEntityGraphByUsername(@Param("username") String username);  
}
```

