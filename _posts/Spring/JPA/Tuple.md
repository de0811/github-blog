---
aliases:
  - Tuple
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: JPA에서 여러 필드 값을 하나의 객체로 묶어 반환할 수 있도록 하는 클래스
---
# Tuple
- [[2.Ref(데이터 및 정보 저장)/Spring/Repository/QueryDSL|QueryDSL]] 에서 여러 값으로 반환할 때 사용
- 여러 필드 값을 하나의 객체로 묶어 반환할 수 있도록 하는 클래스
## ⚙️ 설정
## 🚨 주의사항
## 🔍 속성 설명
- `get(int index, Class<T> type)`: 인덱스와 타입을 사용하여 튜플의 값을 가져옵니다.
- `get(Expression<T> expr)`: 표현식을 사용하여 튜플의 값을 가져옵니다.
- `size()`: 튜플의 크기를 반환합니다.
- `toArray()`: 튜플의 값을 배열로 반환합니다.
- `equals(Object obj)`: 튜플의 동등성을 비교합니다.
- `hashCode()`: 튜플의 해시 코드를 반환합니다.
### 📌
## 🛠 사용 예제
```java title:"각종 조회"
  @Test
  public void aggregation() {
    QMember member = QMember.member;
    List<Tuple> fetch = new JPAQueryFactory(em)
      .select(
        member.count(),
        member.age.sum(),
        member.age.avg(),
        member.age.max(),
        member.age.min()
      )
      .from(member)
      .fetch();

    for (Tuple tuple : fetch) {
      System.out.println("tuple count = " + tuple.get(member.count()));
      System.out.println("tuple sum = " + tuple.get(member.age.sum()));
      System.out.println("tuple avg = " + tuple.get(member.age.avg()));
      System.out.println("tuple max = " + tuple.get(member.age.max()));
      System.out.println("tuple min = " + tuple.get(member.age.min()));
    }
  }
```

```java
@Test
public void tupleProjection() {
	QMember member = QMember.member;
	List<Tuple> fetch = new JPAQueryFactory(em)
		.select(member.username, member.age)
		.from(member)
		.fetch();

	for (Tuple tuple : fetch) {
		String username = tuple.get(member.username);
		Integer age = tuple.get(member.age);
		System.out.println("username = " + username);
		System.out.println("age = " + age);
	}
}
```