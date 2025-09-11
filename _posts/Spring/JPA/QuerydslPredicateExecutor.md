---
aliases:
  - QuerydslPredicateExecutor
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: 
---
# QuerydslPredicateExecutor
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Spring Data JPA|Spring Data JPA]] 에서 제공하는 기능
- [[2.Ref(데이터 및 정보 저장)/개발 이론/Parameter|파라메터]]로 [[2.Ref(데이터 및 정보 저장)/Spring/Repository/QueryDSL|QueryDSL]]  조건을 넣을 수 있음
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/BooleanBuilder|BooleanBuilder]] 또는 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/BooleanExpression|BooleanExpression]] 을 의미
## ⚙️ 설정
## 🚨 주의사항
- 제약이 커서 복잡한 실무 환경에서 사용하기에는 많이 부족
- 묵시적 조인은 가능하지만 left join 불가능
- 클라이언트가 [[2.Ref(데이터 및 정보 저장)/Spring/Repository/QueryDSL|QueryDSL]] 의존
## 🔍 속성 설명
```java
public interface QuerydslPredicateExecutor<T> {
  Optional<T> findOne(Predicate predicate);
  Iterable<T> findAll(Predicate predicate);
  Iterable<T> findAll(Predicate predicate, Sort sort);
  Iterable<T> findAll(Predicate predicate, OrderSpecifier<?>... orders);
  Iterable<T> findAll(OrderSpecifier<?>... orders);
  Page<T> findAll(Predicate predicate, Pageable pageable);
  long count(Predicate predicate);
  boolean exists(Predicate predicate);
  <S extends T, R> R findBy(Predicate predicate, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction);
}
```
### 📌
## 🛠 사용 예제
```java title:"조건을 직접 넣을 수 있음" hl:9
public interface MemberRepository extends JpaRepository<Member, Long>, MemberRepositoryCustom, QuerydslPredicateExecutor<Member> {
  List<MemberTeamDto> search(MemberSearchCondition condition);
  List<Member> findByUsername(String username);
}

@Test
public void querydslPredicatedExecutorTest() {
	QMember qMember = QMember.member;
	Iterable<Member> searchMembers = memberRepository.findAll(qMember.age.between(20, 40).and(qMember.team.name.eq("teamB")));

	for (Member searchMember : searchMembers) {
		System.out.println("searchMember = " + searchMember);
	}

}
```