---
aliases:
  - "@PersistenceUnit"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: EntityManagerFactory 자동으로 할당
---
# @PersistenceUnit
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/EntityManagerFactory|EntityManagerFactory]] 자동으로 할당
## 🚨 주의사항
- 최신의 Spring boot 에서는 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Autowired|@Autowired]] 를 쓰거나 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RequiredArgsConstructor|@RequiredArgsConstructor]] 를 사용하여 단축적으로 사용 가능
## 🔍 속성 설명
```java
@Repeatable(PersistenceUnits.class)
@Target({ElementType.TYPE, ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface PersistenceUnit {
  String name() default "";

  String unitName() default "";
}
```
### 📌
## 🛠 사용 예제
```java
  @PersistenceUnit
  private EntityManagerFactory emf;
```