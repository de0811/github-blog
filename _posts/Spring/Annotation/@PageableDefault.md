---
aliases:
  - "@PageableDefault"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
  - Spring/Controller
특징: 
---
# @PageableDefault
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Spring Data JPA|Spring Data JPA]] 에서 페이징 처리를 할 때 기본값을 설정
- 기본 페이지 번호, 페이지 크기, 정렬 방식 지정
## 🚨 주의사항
## 🔍 속성 설명
```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.PARAMETER})
public @interface PageableDefault {
  @AliasFor("size")
  int value() default 10;
  @AliasFor("value")
  int size() default 10;
  int page() default 0;
  String[] sort() default {};
  Sort.Direction direction() default Direction.ASC;
}
```
> `value` | `size` : 한 페이지에 포함될 항목의 수, `default 10`
> `page` : 기본 페이지 번호 설정, `default 0`
> `sort` : 정렬할 필드 이름, `default ""`
> `direction`: 정렬 방향 설정, `Sort.Direction` 타입으로 `ASC`(오름차순) 또는 `DESC`(내림차순) 사용, `default ASC`
### 📌
## 🛠 사용 예제