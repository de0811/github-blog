---
aliases:
  - "@PrePersist"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 엔티티가 처음으로 저장되기 전에 실행
---
# @PrePersist
- 이벤트 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|어노테이션]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 가 처음으로 저장되기 전에 실행
- 주로 생성 날짜를 설정하거나 초기화 작업을 수행하는데 사용
- [EntityListener](https://sterl.org/2017/08/jpa-default-entity-listener/)
## 🚨 주의사항
## 🔍 속성 설명
### 📌
## 🛠 사용 예제
```java
@Entity
public class ExampleEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;
  private LocalDateTime createdDate;
  private LocalDateTime updatedDate;

  // 엔티티가 처음 영속성 컨텍스트에 저장되기 전에 호출됩니다.
  @PrePersist
  public void prePersist() {
    LocalDateTime now = LocalDateTime.now();
    createdDate = now;
    updatedDate = now;
    System.out.println("PrePersist: 엔티티가 저장되기 전에 호출됩니다.");
  }

  // 엔티티가 데이터베이스에 저장된 후에 호출됩니다.
  @PostPersist
  public void postPersist() {
    System.out.println("PostPersist: 엔티티가 저장된 후에 호출됩니다.");
  }

  // 엔티티가 업데이트되기 전에 호출됩니다.
  @PreUpdate
  public void preUpdate() {
    updatedDate = LocalDateTime.now();
    System.out.println("PreUpdate: 엔티티가 업데이트되기 전에 호출됩니다.");
  }

  // 엔티티가 데이터베이스에 업데이트된 후에 호출됩니다.
  @PostUpdate
  public void postUpdate() {
    System.out.println("PostUpdate: 엔티티가 업데이트된 후에 호출됩니다.");
  }
}
```