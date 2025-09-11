---
aliases:
  - Slice
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: 
---
# Slice
- 추가 `count` 쿼리 없이 다음 페이지만 확인 가능(내부적으로 limit + 1 조회)
- `org.springframework.data.domain.Slice`
## 🚨 주의사항
## 🔍 속성 설명
```java
public interface Slice<T> extends Streamable<T> {
  int getNumber();
  int getSize();
  int getNumberOfElements();
  List<T> getContent();
  boolean hasContent();
  Sort getSort();
  boolean isFirst();
  boolean isLast();
  boolean hasNext();
  boolean hasPrevious();
  default Pageable getPageable() {
    return PageRequest.of(this.getNumber(), this.getSize(), this.getSort());
  }
  Pageable nextPageable();
  Pageable previousPageable();
  <U> Slice<U> map(Function<? super T, ? extends U> converter);
  default Pageable nextOrLastPageable() {
    return this.hasNext() ? this.nextPageable() : this.getPageable();
  }
  default Pageable previousOrFirstPageable() {
    return this.hasPrevious() ? this.previousPageable() : this.getPageable();
  }
}

```
> `int getNumber()` : 페이지 번호
> `List<T> getContent()` : 내용 반환
> `boolean isFirst()`  : 가장 첫번째 페이지 인지 반환
> `boolean isLast()` : 가장 마지막 페이지 인지 반환
> `boolean hasNext()` : 다음 페이지가 있는지 반환
### 📌
## 🛠 사용 예제