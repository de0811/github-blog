---
aliases:
  - "@NamedEntityGraph"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 
---
# @NamedEntityGraph
- fetch join 할 대상을 함수 이름까지 미리 지정해놓는 방법
## 🚨 주의사항
- 사용할 키워드를 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|Entity]] 에서 지정해야하기 때문에 비효율
## 🔍 속성 설명
### 📌
## 🛠 사용 예제
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