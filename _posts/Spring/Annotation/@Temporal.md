---
aliases:
  - "@Temporal"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 날짜를 어떻게 저장할지 지정
---
# @Temporal
- 날짜를 어떻게 저장할지 `TemporalType`를 이용하여 지정
- java 8 이후에 [[LocalDate]]과 [[2.Ref(데이터 및 정보 저장)/Spring/Java/LocalDateTime|LocalDateTime]] 클래스가 생기고 자동으로 `TemporalType`지정 되기 때문에 사용할 필요 없음 
> [!note]
> java 8 이후에 [[LocalDate]]과 [[2.Ref(데이터 및 정보 저장)/Spring/Java/LocalDateTime|LocalDateTime]] 클래스가 생기고 자동으로 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|어노테이션]]  없어도 적용되기 때문에
```java
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
}
```