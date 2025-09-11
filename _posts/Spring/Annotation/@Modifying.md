---
aliases:
  - "@Modifying"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: Spring Data JPA 에서 DB의 변경 작업(INSERT, UPDATE, DELETE) 수행하는 쿼리 메서드에 사용
---
# @Modifying
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Spring Data JPA|Spring Data JPA]] 에서 DB의 변경 작업(INSERT, UPDATE, DELETE) 수행하는 쿼리 메서드에 사용
## 🚨 주의사항
- 우선 동작일 경우 완료 후 영속성 컨텍스트를 자동 정리 필요 (`clearAutomatically`)
- 최후 동작일 경우 쿼리 실행 전 자동 플러시 필요 (`flushAutomatically`)
## 🔍 속성 설명
```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Documented
public @interface Modifying {
  boolean flushAutomatically() default false;

  boolean clearAutomatically() default false;
}
```
> `flushAutomatically` : 쿼리 실행 전에 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|영속성 컨텍스트]] 를 자동으로 플러시
> `clearAutomatically` : [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|영속성 컨텍스트]] 를 자동으로 정리
### 📌 `flushAutomatically`
- 마지막 동작일때 사용
###  📌 `clearAutomatically`
- 처음 동작일때 사용
###  📌  중간 지점에 사용할 경우
- 둘 다 사용해야하지만 성능 손실은 있을 수 있음
## 🛠 사용 예제