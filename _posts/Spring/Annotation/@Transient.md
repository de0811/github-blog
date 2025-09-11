---
aliases:
  - "@Transient"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: DB에 컬럼으로 사용되지 않을 때 적용
---
# @Transient
- DB에 컬럼으로 사용되지 않음
- 임시로 사용되는 데이터의 경우 사용
```java hl:14-15 
@Entity
public class Member {
  @Id
  private Long id;
  @Column
  private String name;

  @Enumerated(EnumType.STRING)
  private ROLE_TYPE roleType;

  @Temporal(TemporalType.TIMESTAMP)
  private Date createdDate;
  
  @Transient
  private int temp;
}
```