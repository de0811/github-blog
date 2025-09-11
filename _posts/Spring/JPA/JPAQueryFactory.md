---
aliases:
  - JPAQueryFactory
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: QueryDSL에서 쿼리를 생성하고 실행하는 클래스
---
# JPAQueryFactory
- [[2.Ref(데이터 및 정보 저장)/Spring/Repository/QueryDSL|QueryDSL]] 을 사용하여 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPA|JPA]] 를 통해 타입에 안정적인 쿼리를 생성하고 실행할 수 있도록 도와주는 클래스
- 마지막 실질적인 실행은 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/AbstractJPAQuery|AbstractJPAQuery]] 통해서 실행
## ⚙️ 설정
## 🚨 주의사항
- where 절에서 and() 로 묶지 않고 [[2.Ref(데이터 및 정보 저장)/개발 이론/Parameter|파라메터]] 로 넘길 경우 모두 and 로 자동 할당
```java hl:4-5 title:"파라메터로 묶을 경우 모두 and 로 할당"
    Member findMember = new JPAQueryFactory(em)
      .selectFrom(member)
      .where(
        member.username.eq("member1"),
        member.age.eq(10)
      )
      .fetchOne();
```
## 🔍 속성 설명
- `delete(EntityPath<?> path)`: 지정된 엔티티 경로를 사용하여 DELETE 쿼리를 생성  
- `select(Expression<T> expr)`: 지정된 표현식을 사용하여 SELECT 쿼리를 생성  
- `select(Expression<?>... exprs)`: 여러 표현식을 사용하여 SELECT 쿼리를 생성  
- `selectDistinct(Expression<T> expr)`: 지정된 표현식을 사용하여 DISTINCT SELECT 쿼리를 생성  
- `selectDistinct(Expression<?>... exprs)`: 여러 표현식을 사용하여 DISTINCT SELECT 쿼리를 생성  
- `distinct()` : DISTINCT SELECT 쿼리 생성
- `selectOne()`: 상수 1을 반환하는 SELECT 쿼리를 생성  
- `selectZero()`: 상수 0을 반환하는 SELECT 쿼리를 생성  
- `selectFrom(EntityPath<T> from)`: 지정된 엔티티 경로를 사용하여 SELECT 쿼리를 생성하고 FROM 절을 추가  
- `from(EntityPath<?> from)`: 지정된 엔티티 경로를 사용하여 FROM 절을 생성  
- `from(EntityPath<?>... from)`: 여러 엔티티 경로를 사용하여 FROM 절을 생성  
- `update(EntityPath<?> path)`: 지정된 엔티티 경로를 사용하여 UPDATE 쿼리를 생성  
- `insert(EntityPath<?> path)`: 지정된 엔티티 경로를 사용하여 INSERT 쿼리를 생성  
- `query()`: 새로운 JPAQuery 객체를 생성
- paging(페이징)
	- `offset(int)`: 몇 번째 행부터 시작할지 지정
	- `limit(int)` : 최대 몇 개의 행을 가져올지 지정
- join(조인)
	- `join(Q-Type, Q-Type)`: Inner Join : 두 테이블 간의 일치하는 데이터 결합
	- `leftJoin(Q-Type, Q-Type)`: Left Join : 왼쪽 테이블의 모든 행과 오른쪽 테이블의 일치하는 행을 결합, 일치하지 않는 경우 오른쪽 테이블의 값은 `null`
	- `rightJoin(Q-Type, Q-Type)` : Right Join : 오른쪽 테이블의 모든 행과 왼쪽 테이블의 일치하는 행을 결합, 일치하지 않는 경우 왼쪽 테이블의 값은 `null`
	- ❓Theta Join(세타조인) : 두 테이블 간의 임의의 조건을 사용하여 결합
		```java title:"Theta Join(세타조인)"
QMember member = QMember.member;
QTeam team = QTeam.team;

List<Tuple> result = new JPAQueryFactory(em)
	.select(member, team)
	.from(member, team)
	.where(member.username.eq(team.name))
	.fetch();
		```
	- `on`
		- `LEFT JOIN` 사용 시 효과적
		- 조인 대상 필터링
		```java title:"조인 대상 필터링"
List<Tuple> fetch = new JPAQueryFactory(em)
	.select(member, team)
	.from(member)
	.leftJoin(member.team, team)
	.on(team.name.eq("teamA"))
	.fetch();
		```
		- 연관관계 없는 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 외부 조인
		```java title:"연관관계 없는 엔티티 외부 조인"
  @Test
  public void join_on_no_relation() {
    em.persist(new Member("teamA"));
    em.persist(new Member("teamB"));
    em.persist(new Member("teamC"));
    
    QMember member = QMember.member;
    QTeam team = QTeam.team;

    List<Tuple> fetch = new JPAQueryFactory(em)
      .select(member, team)
      .from(member)
      .leftJoin(team).on(member.username.eq(team.name))
      .fetch();

    for (Tuple tuple : fetch) {
      System.out.println("tuple = " + tuple);
    }
  }
		```
	- `join(Q-Type, Q-Type).fetchJoin()`: 연관된 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]]를 한번의 쿼리로 함께 로드
		```java title:"fetch join"
  @Test
  public void fetchJoinUse() {
    em.flush();
    em.clear();

    QMember member = QMember.member;
    Member findMember = new JPAQueryFactory(em)
      .selectFrom(member)
      .join(member.team, QTeam.team).fetchJoin()
      .where(member.username.eq("member1"))
      .fetchOne();

    boolean loaded = emf.getPersistenceUnitUtil().isLoaded(findMember.getTeam());
    Assertions.assertThat(loaded).as("페치 조인 적용").isTrue();
  }
		```

### 📌
## 🛠 사용 예제