---
aliases:
  - "@NoArgsConstructor"
tags:
  - Spring
  - Annotation
  - Lombok
  - Annotation/생성자
특징: 
---
# @NoArgsConstructor
- 빈 생성자를 생성
## 🚨 주의사항
## 🔍 속성 설명
```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.SOURCE)
public @interface NoArgsConstructor {
  String staticName() default "";

  AnyAnnotation[] onConstructor() default {};

  AccessLevel access() default AccessLevel.PUBLIC;

  boolean force() default false;

  /** @deprecated */
  @Deprecated
  @Retention(RetentionPolicy.SOURCE)
  @Target({})
  public @interface AnyAnnotation {
  }
}
```
> `access` : [[2.Ref(데이터 및 정보 저장)/Spring/AccessLevel|AccessLevel]] 통해 접근 수준 설정
### 📌
## 🛠 사용 예제