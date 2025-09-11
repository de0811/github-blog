---
aliases:
  - "@PersistenceContext"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: EntityManager 자동으로 할당
---
# @PersistenceContext
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/EntityManager|EntityManager]]  자동으로 할당
## 🚨 주의사항
- 최신의 Spring boot 에서는 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Autowired|@Autowired]] 를 쓰거나 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RequiredArgsConstructor|@RequiredArgsConstructor]] 를 사용하여 단축적으로 사용 가능
## 🔍 속성 설명
```java
@Repeatable(PersistenceContexts.class)
@Target({ElementType.TYPE, ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface PersistenceContext {
  String name() default "";
  String unitName() default "";
  PersistenceContextType type() default PersistenceContextType.TRANSACTION;
  SynchronizationType synchronization() default SynchronizationType.SYNCHRONIZED;
  PersistenceProperty[] properties() default {};
}

```
### 📌
## 🛠 사용 예제
```java
@PersistenceContext  
private EntityManager em;
```