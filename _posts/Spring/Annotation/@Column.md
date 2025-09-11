---
aliases:
  - "@Column"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - Spring/Repository
특징: 
---
# @Column
- DB의 [[2.Ref(데이터 및 정보 저장)/개발 이론/snake_case|snake_case]] 형태와 소스상의 [[2.Ref(데이터 및 정보 저장)/개발 이론/camelCase|camelCase]] 형태를 자동으로 변환
## 🚨 주의사항
> [!caution] unique 속성 사용 주의
>  보통 `unique`의 속성은 사용할 경우 랜덤으로 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Table|@Table]] 의 `uniqueConstraints`과 똑같은 기능을 
>  랜덤한 이름으로 지정하기에 `@Column`에서는 직접 사용하지 않고 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Table|@Table]] 에서 작성
>  ➜ **[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Table|@Table]] 에서 `uniqueConstraints`를 사용하는 것이 안전**

> [!warning] [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Lob|@Lob]] 사용시 DB 호환성 에러 발생
> Spring 3.x 이상부터 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Lob|@Lob]] 사용시  **[[2.Ref(데이터 및 정보 저장)/Docker/postgresql|postgresql]] 등의 DB에서 호환성 에러 발생**
> ➜ **대체 방법**: [[@Column]]`(columnDefinition = "TEXT")` 사용하여 대체 가능
## 🔍 속성 설명
```java
@Target({METHOD, FIELD}) 
@Retention(RUNTIME)
public @interface Column {
    String name() default "";
    boolean unique() default false;
    boolean nullable() default true;
    boolean insertable() default true;
    boolean updatable() default true;
    String columnDefinition() default "";
    String table() default "";
    int length() default 255;
    int precision() default 0;
    int scale() default 0;
}
```
> `name` : 열의 이름, 기본값은 속성 또는 필드 이름
> `unique` : 열이 고유 키 인지 여부, [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Table|@Table]] 에서 `UniqueConstraint`의 단축키로 사용
> `nullable` : null 허용하는지 여부, 기본 `true`
> `insertable` : 컬럼은 존재하지만 `SQL` `INSERT` 문을 만들때 해당 컬럼 값을 넣지 않음(절대 처음엔 추가하지 않음)
> `updatable` : 컬럼은 존재하지만 `SQL` `UPDATE` 문을 만들때 해당 컬럼 값을 넣지 않음(절대 변경하지 않음)
> `columnDefinition` : [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPA|JPA]] 가 만드는 구문을 무시하고 이 설정으로 넣은 값을 덮어 쓰는 역활
> `table` : 다른 테이블의 컴럼을 매핑할 수 있음
> `length` : 열 길이, 문자열 값 열이 사용되는 경우에만 적용
> `precision` : 소수점(소수점 몇자리까지 가능한지 표기), 숫자의 전체 자릿수
> `scale` : 소수점(소수점 몇자리까지 가능한지 표기), 소수점 최대 몇자리까지 저장할 수 있는지 표기
### 📌 columnDefinition 사용 예시
```java title:"columnDefinition 사용 방법"
@Column(name="example_column", columnDefinition="VARCHAR(255) NOT NULL")
private String exampleColumn;
```

## 🛠 사용 예제
```java title:"사용 예제" hl:8
@Data
@Entity
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_name", length = 10)
    private String itemName;
    @Column
    private Integer price;
    @Column
    private Integer quantity;

    public Item() {
    }

    public Item(String itemName, Integer price, Integer quantity) {
        this.itemName = itemName;
        this.price = price;
        this.quantity = quantity;
    }
}
```