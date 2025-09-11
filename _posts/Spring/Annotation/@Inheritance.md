---
aliases:
  - "@Inheritance"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 
---
# @Inheritance
- 상속관계 매핑
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/InheritanceType|InheritanceType]] 을 사용하여 상속 방법 선택
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/InheritanceType|InheritanceType.JOINED]] 일 경우 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@DiscriminatorColumn|@DiscriminatorColumn]] 함께 사용할 수 있음
## 🚨 주의사항
- 상속하는 부모 클래스는 [[2.Ref(데이터 및 정보 저장)/개발 이론/추상화 (Abstraction)|Abstract]]하게 되면 부모 클래스는 테이블로 남지 않게 할 수 있음
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/InheritanceType|InheritanceType.TABLE_PER_CLASS]] 쓸꺼면 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@MappedSuperclass|@MappedSuperclass]] 를 쓰는게 좋지 않을까 싶음
## 🔍 속성 설명
```java
@Target({TYPE})
@Retention(RUNTIME)

public @interface Inheritance {
    /** The strategy to be used for the entity inheritance hierarchy. */
    InheritanceType strategy() default InheritanceType.SINGLE_TABLE;
}
```
> `strategy` : 디폴트 속성은 하나의 테이블에 작성
### 📌
## 🛠 사용 예제
```java
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class Item {
  @Id
  @GeneratedValue
  @Column(name = "ITEM_ID")
  private Long id;
  private String name;
  private int price;
}

@Entity
public class Album extends Item {
  private String artist;
}

@Entity
public class Book extends Item {
  private String isbn;
}

@Entity
public class Movie extends Item {
  private String director;
}
```
### [[2.Ref(데이터 및 정보 저장)/Spring/JPA/InheritanceType|InheritanceType.SINGLE_TABLE]]

| Item Table |
| ---------- |
| ITEM_ID    |
| name       |
| price      |
| artist     |
| isbn       |
| director   |
### [[2.Ref(데이터 및 정보 저장)/Spring/JPA/InheritanceType|InheritanceType.JOINED]]

| Item Table | Album Table | Book Table | Movie Table |
| ---------- | ----------- | ---------- | ----------- |
| ITEM_ID    | ITEM_ID     | ITEM_ID    | ITEM_ID     |
| name       | artist      | isbn       | director    |
| price      |             |            |             |
### [[2.Ref(데이터 및 정보 저장)/Spring/JPA/InheritanceType|InheritanceType.TABLE_PER_CLASS]]

| Item Table | Album Table | Book Table | Movie Table |
| ---------- | ----------- | ---------- | ----------- |
| ITEM_ID    | ITEM_ID     | ITEM_ID    | ITEM_ID     |
| name       | artist      | isbn       | director    |
| price      | name        | name       | name        |
|            | price       | price      | price       |
