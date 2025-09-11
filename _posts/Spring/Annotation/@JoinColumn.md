---
aliases:
  - "@JoinColumn"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 
---
# @JoinColumn
- 연관관계 매핑
## 🚨 주의사항
## 🔍 속성 설명
```java
@Repeatable(JoinColumns.class)
@Target({METHOD, FIELD})
@Retention(RUNTIME)
public @interface JoinColumn {
    String name() default "";
    String referencedColumnName() default "";
    boolean unique() default false;
    boolean nullable() default true;
    boolean insertable() default true;
    boolean updatable() default true;
    String columnDefinition() default "";
    String table() default "";
    ForeignKey foreignKey() default @ForeignKey(PROVIDER_DEFAULT);
}
```
> `name`: (선택 사항) 외래 키 컬럼의 이름, 기본값은 연관된 엔티티의 필드 이름과 "_ID"를 조합한 이름입니다.
> `referencedColumnName`: (선택 사항) 외래 키가 참조하는 대상 테이블의 컬럼 이름입니다. 기본값은 대상 테이블의 기본 키 컬럼 이름입니다.
> `unique`: (선택 사항) 외래 키 컬럼에 유니크 제약 조건을 설정할지 여부를 지정합니다. 기본값은 false입니다.
> `nullable`: (선택 사항) 외래 키 컬럼이 null 값을 허용할지 여부를 지정합니다. 기본값은 true입니다.
> `insertable`: (선택 사항) 외래 키 컬럼이 SQL INSERT 문에 포함될지 여부를 지정합니다. 기본값은 true입니다.
> `updatable`: (선택 사항) 외래 키 컬럼이 SQL UPDATE 문에 포함될지 여부를 지정합니다. 기본값은 true입니다.
> `columnDefinition`: (선택 사항) 외래 키 컬럼의 DDL(SQL 정의 언어) 조각을 지정합니다. 기본값은 자동 생성된 SQL입니다.
> `table`: (선택 사항) 외래 키 컬럼이 포함된 테이블의 이름입니다. 기본값은 연관된 엔티티의 기본 테이블입니다.
> `foreignKey`: (선택 사항) 외래 키 제약 조건을 지정하거나 제어하는 데 사용됩니다. 기본값은 공급자의 기본 외래 키 전략입니다.

### 📌
## 🛠 사용 예제
```java hl:15
@Setter
@Getter
@Entity
@Table(name = "ORDERS")
public class Order {
  @Id @GeneratedValue
  @Column(name = "ORDER_ID")
  private Long id;
  private int orderAmount;

  @Embedded
  private Address address;

  @ManyToOne
  @JoinColumn(name = "PRODUCT_ID")
  private Product product;
}
```