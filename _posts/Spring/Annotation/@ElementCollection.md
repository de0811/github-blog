---
aliases:
  - "@ElementCollection"
  - 값 타입 컬렉션
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 엔티티가 아닌 값 목록을 저장할 때 사용
---
# @ElementCollection
- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]]가 아닌 값 목록을 저장할 때 사용
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@CollectionTable|@CollectionTable]] 를 이용해서 테이블의 이름을 지정
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Embeddable|@Embeddable]] 를 통해 만든 클래스의 리스트도 지정 가능
## 🚨 주의사항
- update 기능을 사용할 수 없기 때문에 직접 remove 를 사용해서 삭제해 줘야함
- **이걸 쓸거면 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@OneToMany|@OneToMany]] 를 쓰는게 이득**
### 📌 제약사항
- 값 타입은 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 와 다르게 식별자 개념이 없음(ID 값 처럼 유니크한 구분 값이 없음)
- 값은 변경하면 추적이 어려움
- 값 타입 컬렉션에 변경 사항이 발생하면 주인 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]]와 <span style="background:#ff4d4f">연관된 모든 데이터를 삭제 후 현재 값을 모두 다시 저장</span> 
- 값 타입 컬렉션을 매핑하는 테이블은 모든 컬럼을 묶어서 기본 키를 구성해야함
- null 입력 금지, 중복 저장 금지
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