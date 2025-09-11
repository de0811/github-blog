---
aliases:
  - "@EntityListeners"
tags:
  - Spring
  - Annotation
  - Spring/JPA
  - spring/Repository
특징: 
---
# @EntityListeners
- JPA [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 생명주기 이벤트를 감지하고 처리하기 위해 사용
- 생성, 업데이트, 삭제 등 이벤트에 따라 자동 호출
- 
## 🚨 주의사항
## 🔍 속성 설명
### 📌
## 🛠 사용 예제
```java
@EntityListeners(AuditingEntityListener.class)
@Getter
@MappedSuperclass
public class BaseEntity {
  @CreatedDate
  @Column(updatable = false)
  private LocalDateTime createdDate;
  @LastModifiedDate
  private LocalDateTime lastModifiedDate;
  @CreatedBy
  @Column(updatable = false)
  private String createdBy;
  @LastModifiedBy
  private String lastModifiedBy;
}
```