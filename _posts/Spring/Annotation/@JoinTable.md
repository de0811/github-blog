---
aliases:
  - "@JoinTable"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 
---
# @JoinTable
- 조인 테이블 지정
## 🚨 주의사항
- 성능상 문제
- 이걸 사용하기보단 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@OneToMany|@OneToMany]] [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ManyToOne|@ManyToOne]] 을 사용하여 확장성을 확보하는게 훨씬 유리
## 🔍 속성 설명
```java
public @interface JoinTable {
    String name() default "";
    String catalog() default "";
    String schema() default "";
    JoinColumn[] joinColumns() default {};
    JoinColumn[] inverseJoinColumns() default {};
    ForeignKey foreignKey() default @ForeignKey(ConstraintMode.PROVIDER_DEFAULT);
    ForeignKey inverseForeignKey() default @ForeignKey(ConstraintMode.PROVIDER_DEFAULT);
    UniqueConstraint[] uniqueConstraints() default {};
    Index[] indexes() default {};
}
```
> `name`: (선택 사항) 조인 테이블의 이름, 기본값은 연관된 두 엔티티의 기본 테이블 이름을 밑줄로 연결한 이름
> `catalog`: (선택 사항) 테이블의 카탈로그, 기본값은 기본 카탈로그
> `schema`: (선택 사항) 테이블의 스키마, 기본값은 기본 스키마
> `joinColumns`: (선택 사항) 조인 테이블의 외래 키 컬럼을 정의, 기본값은 @JoinColumn의 기본값을 사용
> `inverseJoinColumns`: (선택 사항) 연관된 엔티티의 외래 키 컬럼을 정의, 기본값은 @JoinColumn의 기본값을 사용
> `uniqueConstraints`: (선택 사항) 테이블에 배치할 고유 제약 조건, 기본값은 추가 제약 조건이 없음
> `indexes`: (선택 사항) 테이블에 대한 인덱스, 기본값은 추가 인덱스가 없음
### 📌
## 🛠 사용 예제
```java hl:11-14
@Entity
@Getter @Setter
public class Category {
  @Id @GeneratedValue
  @Column(name = "CATEGORY_ID")
  private Long id;

  private String name;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(name = "CATEGORY_ITEM",
    joinColumns = @JoinColumn(name = "CATEGORY_ID"),
    inverseJoinColumns = @JoinColumn(name = "ITEM_ID")
  )
  private List<Item> items = new ArrayList<>();

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "PARENT_ID")
  private Category parent;

  @OneToMany(mappedBy = "parent")
  private List<Category> child = new ArrayList<>();

  public void addChildCategory(Category child) {
    this.child.add(child);
    child.setParent(this);
  }

  public void addItem(Item item) {
    items.add(item);
    item.getCategories().add(this);
  }
}
```