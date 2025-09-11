---
aliases:
  - Pageable
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: 
---
# Pageable
- 페이징 클래스(내부 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Sort|Sort]] 포함)
- `org.springframework.data.domain.Pageable`
- 
## 🚨 주의사항
## 🔍 속성 설명
```java
public interface Pageable {
  static Pageable unpaged() {
    return unpaged(Sort.unsorted());
  }
  static Pageable unpaged(Sort sort) {
    return Unpaged.sorted(sort);
  }
  static Pageable ofSize(int pageSize) {
    return PageRequest.of(0, pageSize);
  }
  default boolean isPaged() {
    return true;
  }
  default boolean isUnpaged() {
    return !this.isPaged();
  }
  int getPageNumber();
  int getPageSize();
  long getOffset();
  Sort getSort();
  default Sort getSortOr(Sort sort) {
    Assert.notNull(sort, "Fallback Sort must not be null");
    return this.getSort().isSorted() ? this.getSort() : sort;
  }
  Pageable next();
  Pageable previousOrFirst();
  Pageable first();
  Pageable withPage(int pageNumber);
  boolean hasPrevious();
  default Optional<Pageable> toOptional() {
    return this.isUnpaged() ? Optional.empty() : Optional.of(this);
  }
  default Limit toLimit() {
    return this.isUnpaged() ? Limit.unlimited() : Limit.of(this.getPageSize());
  }
  default OffsetScrollPosition toScrollPosition() {
    if (this.isUnpaged()) {
      throw new IllegalStateException("Cannot create OffsetScrollPosition from an unpaged instance");
    } else {
      return this.getOffset() > 0L ? ScrollPosition.offset(this.getOffset() - 1L) : ScrollPosition.offset();
    }
  }
}
```
- `static Pageable unpaged():` 페이징이 설정되지 않은 Pageable 객체를 반환
- `static Pageable unpaged(Sort sort):` 정렬이 설정된 페이징이 없는 Pageable 객체를 반환
- `static Pageable ofSize(int pageSize):` 주어진 페이지 크기로 Pageable 객체를 생성
- `boolean isPaged():` 페이징이 설정되었는지 여부를 반환
- `boolean isUnpaged():` 페이징이 설정되지 않았는지 여부를 반환
- `int getPageNumber():` 현재 페이지 번호를 반환
- `int getPageSize():` 페이지 크기를 반환
- `long getOffset():` 현재 페이지의 오프셋을 반환
- `Sort getSort():` 정렬 정보를 반환
- `Sort getSortOr(Sort sort):` 정렬 정보가 없을 경우 주어진 정렬 정보를 반환
- `Pageable next():` 다음 페이지의 Pageable 객체를 반환
- `Pageable previousOrFirst():` 이전 페이지 또는 첫 페이지의 Pageable 객체를 반환
- `Pageable first():` 첫 페이지의 Pageable 객체를 반환
- `Pageable withPage(int pageNumber):` 주어진 페이지 번호로 Pageable 객체를 생성
- `boolean hasPrevious():` 이전 페이지가 있는지 여부를 반환
- `Optional<Pageable> toOptional():` Pageable 객체를 Optional로 반환
- `Limit toLimit():` Limit 객체로 변환
- `OffsetScrollPosition toScrollPosition():` OffsetScrollPosition 객체로 변환

### 📌 글로벌 속성 설정 방법
```properties
spring.data.web.pageable.default-page-size=20  # 기본 페이지 사이즈
spring.data.web.pageable.max-page-size=2000    # 최대 페이지 사이즈
```
###  📌 단일 속성 설정 방법
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PageableDefault]] 사용
## 🛠 사용 예제

```java title:"page 추출을 위한 예제"
public interface MemberRepository extends JpaRepository<Member, Long> {
  Page<Member> findByAge(int age, Pageable pageable);
}

PageRequest pageRequest = PageRequest.of(0, 3, Sort.by(Sort.Direction.DESC, "username"));
Page<Member> page = memberRepository.findByAge(age, pageRequest);
```

### 데이터 보내는 예제
- `/members?page=0&size=3&sort=id,desc&sort=username,desc`