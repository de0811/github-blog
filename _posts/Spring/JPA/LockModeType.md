---
aliases:
  - LockModeType
tags:
  - Java
  - Spring
  - Spring/JPA
특징: 
---
# LockModeType
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Lock|@Lock]] [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|어노테이션]]과 함께 사용 
## 🚨 주의사항
## 🔍 속성 설명
```java
package jakarta.persistence;

public enum LockModeType {
  READ,
  WRITE,
  OPTIMISTIC,
  OPTIMISTIC_FORCE_INCREMENT,
  PESSIMISTIC_READ,
  PESSIMISTIC_WRITE,
  PESSIMISTIC_FORCE_INCREMENT,
  NONE;

  private LockModeType() {
  }
}

```
> `LockModeType.READ`: 읽기 잠금 모드로, 다른 트랜잭션이 데이터를 읽을 수 있지만 수정할 수는 없음
> `LockModeType.WRITE`: 쓰기 잠금 모드로, 다른 트랜잭션이 데이터를 읽거나 수정할 수 없음
> `LockModeType.OPTIMISTIC`: 낙관적 잠금 모드로, 엔티티가 수정될 때 버전 번호를 사용하여 충돌을 감지
> `LockModeType.PESSIMISTIC_READ`: 비관적 읽기 잠금 모드로, 다른 트랜잭션이 데이터를 읽을 수 있지만 수정 불가
> `LockModeType.PESSIMISTIC_WRITE`: 비관적 쓰기 잠금 모드로, 다른 트랜잭션이 데이터를 읽기와 수정 불가
### 📌
## 🛠 사용 예제