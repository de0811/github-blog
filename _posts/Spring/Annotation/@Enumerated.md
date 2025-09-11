---
aliases:
  - "@Enumerated"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: enum 타입을 DB에 저장할때 어떻게 저장할지 지정
---
# @Enumerated
- enum 타입을 DB에 저장할때 어떻게 저장할지 `EnumType`을 이용하여 지정
> [!warning] `EnumType`은 `String` 만 사용할 것을 권장
> `ORDINAL` 을 사용할 경우`Enum` 의 순서를 저장하기 때문에 앞에 추가될 경우 `index` 값이 변경되어 값이 유니크하지 않기 때문에 `STRING` 으로 만 타입을 사용해야함
```java
@Entity
public class Member {
  @Id
  private Long id;
  @Column
  private String name;
  
  @Enumerated(EnumType.STRING)
  private ROLE_TYPE roleType;
}
```