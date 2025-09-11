---
aliases:
  - "@DiscriminatorValue"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 
---
# @DiscriminatorValue
- 부모 값에서 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@DiscriminatorColumn|@DiscriminatorColumn]] 를 통해 컬럼이 지정 되었을 때 해당 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|어노테이션]]을 사용하여 컬럼에 저장될 값을 지정 
## 🚨 주의사항
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@DiscriminatorColumn|@DiscriminatorColumn]] 이 지정되어 있을 경우만 사용 가능
## 🔍 속성 설명
```java
@Target({TYPE}) 
@Retention(RUNTIME)
public @interface DiscriminatorValue {
    String value();
}
```
## 🛠 사용 예제
```java title:"어떤 타입인지 값을 지정" hl:2-3,15
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn
public class Item {
  @Id
  @GeneratedValue
  @Column(name = "ITEM_ID")
  private Long id;
  private String name;
  private int price;
  private int stockQuantity;
}

@Entity
@DiscriminatorValue("M")
public class Movie extends Item {
  private String director;
  private String actor;
}
```