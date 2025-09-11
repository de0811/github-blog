---
aliases:
  - Page
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: 
---
# Page
- 추가 `count` 쿼리 결과를 포함하는 페이징
- `org.springframework.data.domain.Page`
## 🚨 주의사항
### CountQuery 의 성능 이슈
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Query|@Query]] 의 `countQuery` 기능을 이용하여 따로 카운터 쿼리 기능을 분리 방법
```java title:"조회 쿼리의 다른 join과 다르게 그저 단순 개수만 필요하기 때문에 join을 빼고 처리"
public interface MemberRepository extends JpaRepository<Member, Long> {
  @Query(
    value = "select m from Member m left join m.team t where m.age = :age", 
    countQuery = "select count(m) from Member m where m.age = :age"
  )
  Page<Member> findByAge(int age, Pageable pageable);
}
```
## 🔍 속성 설명
```java
public interface Page<T> extends Slice<T> {
  static <T> Page<T> empty() {
    return empty(Pageable.unpaged());
  }
  static <T> Page<T> empty(Pageable pageable) {
    return new PageImpl(Collections.emptyList(), pageable, 0L);
  }
  int getTotalPages();
  long getTotalElements();
  <U> Page<U> map(Function<? super T, ? extends U> converter);
}

```
> `long getTotalElements()` : 받아온 개수 반환
> `int getTotalPages()` : 총 페이지 수 반환
> `int getNumber()` : 페이지 번호
> `List<T> getContent()` : 내용 반환
> `boolean isFirst()`  : 가장 첫번째 페이지 인지 반환
> `boolean isLast()` : 가장 마지막 페이지 인지 반환
> `boolean hasNext()` : 다음 페이지가 있는지 반환
> `long getSize()` : 한 페이지에 보여줄 개수
### 📌
## 🛠 사용 예제
```java title:"page 추출을 위한 예제"
public interface MemberRepository extends JpaRepository<Member, Long> {
  Page<Member> findByAge(int age, Pageable pageable);
}

PageRequest pageRequest = PageRequest.of(0, 3, Sort.by(Sort.Direction.DESC, "username"));
Page<Member> page = memberRepository.findByAge(age, pageRequest);
```
