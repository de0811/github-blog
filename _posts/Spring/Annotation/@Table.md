---
aliases:
  - "@Table"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 
---
# @Table
- DB에서 테이블의 이름을 지정
```java
@Target(TYPE) 
@Retention(RUNTIME)
public @interface Table {
    String name() default "";
    String catalog() default "";
    String schema() default "";
    UniqueConstraint[] uniqueConstraints() default {};
    Index[] indexes() default {};
}
```
> `name` : 테이블의 이름, [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Entity|@Entity]] 이름으로 기본 설정
> `catalog` : 테이블의 카탈로그, 기본 카탈로그로 기본 설정
> `schema` : 테이블의 스키마, 사용자의 기본 스키마로 기본 설정
> `uniqueConstraints` : 고유 제약조건, 테이블 생성이 적용되는 경우에만 사용
> 	DDL 생성 시에 유니크 제약 조건 생성
> `indexes` : 테이블의 인덱스, 테이블 생성이 적용되는 경우에만 사용
> 	기본 키에 대한 인덱스를 지정할 필요는 없음
> 	인덱스는 자동으로 생성

