---
aliases:
  - "@DiscriminatorColumn"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 엔티티를 구분하기 위해 사용하는 컬럼을 추가
---
# @DiscriminatorColumn
- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]]를 구분하기 위해 사용하는 컬럼을 추가
- 자식에서 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@DiscriminatorValue]]를 사용하여 타입의 값의 이름을 지정 가능
- 어떤 상속된 클래스의 데이터인지 알기 위해서 사용하는 것을 추천
## 🚨 주의사항
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/InheritanceType|InheritanceType.TABLE_PER_CLASS]]에서는 의미 없음 
## 🔍 속성 설명
```java
@Target({TYPE}) 
@Retention(RUNTIME)

public @interface DiscriminatorColumn {
    String name() default "DTYPE";
    DiscriminatorType discriminatorType() default STRING;
    String columnDefinition() default "";
    int length() default 31;
}
```
> `name`: (선택 사항) 구분자 컬럼의 이름, 기본값은 "DTYPE"
> `discriminatorType`: (선택 사항) 구분자 컬럼의 데이터 타입, 기본값은 DiscriminatorType.STRING
> `columnDefinition`: (선택 사항) 구분자 컬럼의 DDL(SQL 정의 언어) 조각을 지정, 기본값은 공급자에 의해 생성된 SQL
> `length`: (선택 사항) 문자열 기반 구분자 타입의 컬럼 길이, 다른 구분자 타입에는 무시, 기본값은 31
### 📌
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