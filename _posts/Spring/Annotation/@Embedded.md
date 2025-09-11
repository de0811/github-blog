---
aliases:
  - "@Embedded"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 엔티티 내에서 엔티티 가 아닌 클래스를 사용한다는 표시를 하는 어노테이션
---
# @Embedded
- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 내에서 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 가 아닌 클래스를 사용한다는 표시를 하는 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|어노테이션]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Embeddable|@Embeddable]]과 쌍으로 사용 
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@AttributeOverrides|@AttributeOverrides]] 사용하여 복수 사용 가능
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@MappedSuperclass|@MappedSuperclass]] 와 유사하게 느껴질 수 있지만 이 방법은 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]]로 따로 등록하는 방법이 아닌 클래스를 사용하는 방법
- DB에서는 없는 개념이지만 [[2.Ref(데이터 및 정보 저장)/개발 이론/객체지향프로그래밍(OOP)|객체지향프로그래밍(OOP)]] 의 효과를 올리기 위해 사용
## 🚨 주의사항
- 내부로 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|Entity]] 클래스를 변수로 가지고 있을 수 있음
- 얕은 복사 문제 주의 ([[0.New Note/Immutable Object(불변 객체)|Immutable Object(불변 객체)]] 로 설계 필요)
## 🔍 속성 설명
```java
@Target({METHOD, FIELD})
@Retention(RUNTIME)
public @interface Embedded {
}
```
### 📌
## 🛠 사용 예제
```java hl:2,38
@Getter
@Embeddable
public class Address {
  private final String city;
  private final String street;
  private final String zipcode;

  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (obj == null || getClass() != obj.getClass()) return false;
    Address address = (Address) obj;
    if (!Objects.equals(city, address.city)) return false;
    if (!Objects.equals(street, address.street)) return false;
    if (!Objects.equals(zipcode, address.zipcode)) return false;
    return true;
  }

  @Override
  public int hashCode() {
    return Objects.hash(city, street, zipcode);
  }
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

  @Embedded
  private Address homeAddress;

  @Embedded
  @AttributeOverrides({
    @AttributeOverride(name = "city", column = @Column(name = "WORK_CITY")),
    @AttributeOverride(name = "street", column = @Column(name = "WORK_STREET")),
    @AttributeOverride(name = "zipcode", column = @Column(name = "WORK_ZIPCODE"))
  })
  private Address workAddress;
}
```