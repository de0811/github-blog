---
aliases:
  - "@Lock"
tags:
  - Java
  - Spring
  - Spring/JPA
  - spring/Repository
특징: 
---
# @Lock
- DB 엔티티에 대한 동시성 제어를 위해 사용
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/LockModeType|LockModeType]] 사용
## 🚨 주의사항
- 성능 문제가 될 수 있기 때문에 사용을 추천하지 않음
## 🔍 속성 설명
### 📌
## 🛠 사용 예제
```java
  public interface MemberRepository extends JpaRepository<Member, Long> {
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  List<Member> findLockByUsername(String username);
}
```