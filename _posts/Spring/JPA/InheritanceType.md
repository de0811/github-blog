---
aliases:
  - InheritanceType
  - InheritanceType.SINGLE_TABLE
  - InheritanceType.TABLE_PER_CLASS
  - InheritanceType.JOINED
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: 
---
 # InheritanceType
- 상속관계 매핑
## 🚨 주의사항
- 상속하는 부모 클래스는 [[2.Ref(데이터 및 정보 저장)/개발 이론/추상화 (Abstraction)|Abstract]]하게 되면 부모 클래스는 테이블로 남지 않게 할 수 있음
- `TABLE_PER_CLASS` 사용시 부모 클래스 형태로 ID를 찾게 되면 모든 자식을 `union all`로 참조하여 찾기 때문에 성능 문제 발생할 수 있음
- TABLE_PER_CLASS 쓸꺼면 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@MappedSuperclass|@MappedSuperclass]] 를 쓰는게 좋지 않을까 싶음
## 🔍 속성 설명
```java
public enum InheritanceType {
  SINGLE_TABLE,
  TABLE_PER_CLASS,
  JOINED;

  private InheritanceType() {}
}
```
> `SINGLE_TABLE`: 모든 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 를 하나의 테이블에 매핑, 이 전략은 성능이 좋고 단순하지만, 테이블이 커질 수 있음
> `TABLE_PER_CLASS`: 각 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 마다 별도의 테이블을 생성, 이 전략은 테이블이 독립적이지만, 조인 없이 데이터를 조회할 수 없음
> `JOINED`: 부모 엔티티와 자식 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]]를 각각의 테이블에 매핑하고, 조인을 통해 상속 관계를 표현, 구분을 위해 타입을 지정하여 사용, 이 전략은 정규화된 구조를 가지지만, 조인 연산이 필요
### 📌 JOINED
- 기본으로 사용
- 장점
	- 테이블 정규화
	- 외래 키 참조 무결성 제약조건 활용가능
	- 저장공간 효율화
- 단점
	- 조회시 조인을 많이 사용(성능 저하)
	- 조회 쿼리가 복잡
	- 데이터 저장시 `INSERT` `SQL` 2번 호출
### 📌 SINGLE_TABLE
- 장점
	- 조인이 필요 없음(성능이 빠름)
	- 조회 쿼리가 단순
- 단점
	- 자식 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]]가 매핑한 컬럼은 모두 null 허용
	- 모든 컬럼을 저장하기에 테이블이 너무 커져서 조회 성능 저하
### 📌 TABLE_PER_CLASS
- <span style="background:#fff88f">추천하지 않음</span>(DB 전문가와 ORM 전문가 둘 다 비추천)
- 장점
	- 서브 타입을 명확하게 구분해서 처리할 때 효과적
	- `not null` 제약조건 사용 가능
- 단점
	- 여러 자식 테이블을 함께 조회할 때 성능이 느림(UNION SQL)
	- 자식 테이블을 통합해서 쿼리하기 어려움
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
## [[2.Ref(데이터 및 정보 저장)/Spring/JPA/InheritanceType|InheritanceType.JOINED]] 쓰는 방법과 type 을 쓰는 방법 중에 어떤게 나을까
-  [[2.Ref(데이터 및 정보 저장)/Spring/JPA/InheritanceType|InheritanceType.JOINED]]
	- 장점
		- 다양한 데이터를 사용할 수 있도록 가능
		- 테이블이 다르기에 용량에 효과적
	- 단점
		- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|Entity]] 를 다양하게 많이 만들어야함
		- 코드 혼란
- type
	- 장점
		- 단순함
	- 단점
		- 데이터를 다양하게 담을 수 없음