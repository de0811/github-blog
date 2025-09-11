---
aliases:
  - "@JsonIgnore"
tags:
  - Spring
특징: jackson이 JSON 직렬화 또는 역직렬화 시 특정 필드를 무시하는 설정
---
# @JsonIgnore
- jackson이 JSON 직렬화 또는 역직렬화 시 특정 필드를 무시하는 설정
## 🚨 주의사항
## 🔍 속성 설명
```java
@Target({ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.FIELD, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@JacksonAnnotation
public @interface JsonIgnore {
  boolean value() default true;
}
```
## 🛠 사용 예제
```java
@Getter @Setter
@Entity
public class Member {
  @Id @GeneratedValue
  @Column(name = "MEMBER_ID")
  private Long id;
  private String name;

  @JsonIgnore
  @OneToMany(mappedBy = "member")
  private List<Order> orders = new ArrayList<>();
}
```