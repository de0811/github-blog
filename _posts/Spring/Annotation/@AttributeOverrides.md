---
aliases:
  - "@AttributeOverrides"
  - "@AttributeOverride"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 
---
# @AttributeOverrides
- 동일한 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Embedded|@Embedded]] 클래스를 사용할 경우 구분 값으로 사용
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Embeddable|@Embeddable]] 과 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Embedded|@Embedded]]와 함께 사용
## 🚨 주의사항
- 얕은 복사 문제 주의 ([[0.New Note/Immutable Object(불변 객체)|Immutable Object(불변 객체)]] 로 설계 필요)
## 🔍 속성 설명
### 📌
## 🛠 사용 예제
```java
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