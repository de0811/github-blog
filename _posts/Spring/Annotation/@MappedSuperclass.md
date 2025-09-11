---
aliases:
  - MappedSuperclass
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 
---
# @MappedSuperclass
- 공통 매핑 정보가 필요할 때 사용
- 단순한 매크로 기능
## 🚨 주의사항
- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 가 아님
- 직접 사용할 일이 없기 때문에 [[2.Ref(데이터 및 정보 저장)/개발 이론/추상화 (Abstraction)|Abstract]] 로 사용하는 것을 추천
## 🔍 속성 설명
### 📌
## 🛠 사용 예제
```java title:"공통적으로 사용할 컬럼을 매크로 처럼 만들어서 등록 하는 방법"
@Setter
@Getter
@MappedSuperclass
public abstract class BaseEntity {
  @CreationTimestamp
  private ZonedDateTime createdDt;
  @UpdateTimestamp
  private ZonedDateTime updatedDt;
  private String createdBy;
}

@Getter
@Setter
@Entity
public class Member extends BaseEntity {
  @Id
  @GeneratedValue
  @Column(name = "MEMBER_ID")
  private Long id;
  private String name;
}

@Entity
public class Team extends BaseEntity {
  @Id @GeneratedValue
  private Long id;
  private String name;
  @OneToMany(mappedBy = "team")
  private List<Member> members = new ArrayList<>();
}
```