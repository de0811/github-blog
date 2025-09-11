---
aliases:
  - "@CollectionTable"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 값 타입 컬렉션을 저장할때 테이블의 이름 지정
---
# @CollectionTable
- 값 타입을 하나 이상 저장할 때 사용
- 저장할 테이블의 이름을 지정
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ElementCollection|@ElementCollection]] 짝으로 사용
## 🚨 주의사항
- update 기능을 사용할 수 없기 때문에 직접 remove 를 사용해서 삭제해 줘야함
## 🔍 속성 설명
### 📌
## 🛠 사용 예제
```java title:"기본값 목록 저장 방법과 임베디드 값 목록 저장 방법" hl:34-37,39-41
@Embeddable
public class Address {
  private String city;
  private String street;
  private String zipcode;

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

  @ElementCollection
  @CollectionTable(name = "FAVORITE_FOOD", joinColumns = @JoinColumn(name = "MEMBER_ID"))
  @Column(name = "FOOD_NAME")
  private Set<String> favoriteFoods = new HashSet<>();

  @ElementCollection
  @CollectionTable(name = "ADDRESS", joinColumns = @JoinColumn(name = "MEMBER_ID"))
  private List<Address> addressHistory = new ArrayList<>();
}
```