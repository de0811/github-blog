---
aliases:
  - "@SequenceGenerator"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 시퀀스를 직접 관리하고 싶을때 사용
---
# @SequenceGenerator
 - 시퀀스를 직접 관리하고 싶을때 사용
 - 일반적으로 `ORACLE`에서 사용
## 🚨 주의사항
## 🔍 속성 설명
```java
@Repeatable(SequenceGenerators.class)
@Target({TYPE, METHOD, FIELD}) 
@Retention(RUNTIME)
public @interface SequenceGenerator {
    String name();
    String sequenceName() default "";
    String catalog() default "";
    String schema() default "";
    int initialValue() default 1;
    int allocationSize() default 50;
}
```
> `name`: (필수) 시퀀스 생성기의 고유한 이름, 소스 코드에서 시퀀스 생성기를 참조할 때 사용하는 이름, [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|영속성 컨텍스트]]에서 전역적으로 참조 가능
> `sequenceName`: (선택) 기본 키 값을 얻기 위해 사용할 DB 시퀀스 객체의 이름, 기본값은 공급자에 의해 선택
> `catalog`: (선택) 시퀀스 생성기의 카탈로그
> `schema`: (선택) 시퀀스 생성기의 스키마
> `initialValue`: (선택) 시퀀스 객체가 생성할 초기 값, 기본값 1
> `allocationSize`: (선택) 시퀀스 번호를 할당할 때 증가할 양, 기본값 50
> 	DB 시퀀스 값이 하나씩 증가하도록 설정되어 있으면 이 값을 반드시 1로 설정
### 📌`initialValue` `allocationSize` 이용한 성능 최적화
- `allocationSize` 설정은 미리 정한 값 만큼 서버 메모리 상으로 모두 먼저 가지고 있고 DB는 그 이후 값을 지정하도록 설정
> [!note] 
> 예를 들어 처음에 서버에서 1~50 까지 값을 가지고 있고 DB에는 51부터 시작되도록 설정
> 서버에서 50까지 모두 다 쓸 경우 51~100까지 서버에서 가지고 DB는 101부터 쓸 수 있도록 설정
> 이렇게 할 경우 동시성 문제 또한 해결
## 🛠 사용 예제
```java
@Entity
@SequenceGenerator(
    name = "MEMBER_SEQ_GENERATOR",        // 식별자 생성기 이름
    sequenceName = "MEMBER_SEQ",          // 매핑할 데이터베이스 시퀀스 이름
    initialValue = 1, allocationSize = 50 // 시작값, 증가값
)
public class Member {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "MEMBER_SEQ_GENERATOR")
  private Long id;
  @Column(nullable = false)
  private String name;
}
```
