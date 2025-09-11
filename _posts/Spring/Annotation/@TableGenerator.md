---
aliases:
  - "@TableGenerator"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 시퀀스를 직접 관리하고 싶을때 사용
---
# @TableGenerator
- 시퀀스를 직접 관리하고 싶을때 사용
## 🚨 주의사항
## 🔍 속성 설명
```java
@Repeatable(TableGenerators.class)
@Target({TYPE, METHOD, FIELD}) 
@Retention(RUNTIME)
public @interface TableGenerator {
    String name();
    String table() default "";
    String catalog() default "";
    String schema() default "";
    String pkColumnName() default "";
    String valueColumnName() default "";
    String pkColumnValue() default "";
    int initialValue() default 0;
    int allocationSize() default 50;
    UniqueConstraint[] uniqueConstraints() default {};
    Index[] indexes() default {};
}
```
> `name`: (필수) 식별자 생성기의 고유한 이름
> `table`: (선택) 생성된 ID 값을 저장하는 테이블의 이름, 기본값은 공급자에 의해 선택
> `catalog`: (선택) 테이블의 카탈로그, 기본값은 기본 카탈로그
> `schema`: (선택) 테이블의 스키마, 기본값은 사용자의 기본 스키마
> `pkColumnName`: (선택) 테이블의 기본 키 열 이름, 기본값은 공급자에 의해 선택
> `valueColumnName`: (선택) 마지막으로 생성된 값을 저장하는 열의 이름, 기본값은 공급자에 의해 선택
> `pkColumnValue`: (선택) 생성기 테이블에서 이 생성기와 관련된 기본 키 값, 기본값은 공급자에 의해 선택
> `initialValue`: (선택) 마지막으로 생성된 값을 초기화하는 데 사용되는 초기 값
> `allocationSize`: (선택) 생성기에서 ID 번호를 할당할 때 증가할 양
> `uniqueConstraints`: (선택) 테이블에 배치할 고유 제약 조건, 기본값은 추가 제약 조건이 없음
> `indexes`: (선택) 테이블에 대한 인덱스, 기본 키에 대한 인덱스는 자동으로 생성되므로 지정할 필요가 없음
### 📌`initialValue` `allocationSize` 이용한 성능 최적화
성능 최적화를 위해 사용
## 🛠 사용 예제
```java
@Entity
@TableGenerator(
  name = "MEMBER_SEQ_GENERATOR",    // 식별자 생성기 이름
  table = "MY_SEQUENCES",           // 키생성 테이블명
  pkColumnValue = "MEMBER_SEQ",     // 키로 사용할 값 이름
  allocationSize = 1                // 시퀀스 한 번 호출에 증가하는 수
)
public class Member {
  @Id
  @GeneratedValue(strategy = GenerationType.TABLE, generator = "MEMBER_SEQ_GENERATOR")
  private Long id;
  @Column(nullable = false)
  private String name;
}
```