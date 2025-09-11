---
aliases:
  - JPQL
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: SQL 이 테이블을 대상으로 한다면 JPQL은 엔티티 객체를 대상
---
# JPQL(Java Persistence Query Language)
- SQL 이 테이블을 대상으로 한다면 JPQL은 엔티티 객체를 대상으로 SQL 실행
- 여러 DB의 방언을 신경쓸 필요 없음
- 복잡한 조건으로 조회할 때 사용
- 여전한 동적 쿼리의 문제
	- `findById()` 함수를 보면 JPQL 또한 동적 쿼리의 문제를 벗어날 수 없는 것을 확인
	- 동적 쿼리를 깔끔하게 해결하기 위해서 [[2.Ref(데이터 및 정보 저장)/Spring/Repository/QueryDSL|QueryDSL]] 사용하는 방법이 있음
- 테이블이 아닌 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 객체를 대상으로 작성
## 🚨 주의사항
- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]]와 속성은 대소문자 구분 
- JPQL 키워드는 대소문자 구분하지 않음
- `<property name="hibernate.default_batch_fetch_size" value="100"/>` 사용 필요 ([[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@BatchSize|@BatchSize]])
- JPQL에서 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 를 직접 사용하면 [[SQL]] 에서 해당 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 의 기본 키 값을 사용
### [[2.Ref(데이터 및 정보 저장)/Spring/JPA/FetchType|FetchType.EAGER]] 사용시 주의 사항
- 즉시 로딩은 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPQL|JPQL]] 에서 N + 1 문제 발생
	- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPQL|JPQL]] 은 가져올 데이터 타입만 보고 일단 `Query`를 작성 후 실행한 뒤 
	  내부에 또 다른 데이터가 있는 것을 보고 또 SELECT `Query`를 가져오기 떄문에 여러번의 `Query` 발생
	- 해당 행동은 만약 목록을 가져오는 경우 N + 내부 객체 개수 만큼 또 Query를 발생 시킴
	- 해결 방법으로 `fetch join` 을 사용 또는 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 그래프 기능 사용
## 🔍 속성 설명
### 📌 select
```sql
select
from
[where]
[group by]
[having]
[order by]
```
### 📌 update
```sql
update
[where]
```
### 📌 delete
```sql
delete
[where]
```
### 📌 집합과 정렬
```sql
select
	COUNT(m),    // 회원 수
	SUM(m.age),  // 나이 합
	AVG(m.age),  // 평균 나이
	MAX(m.age),  // 최대 나이
	MIN(m.age)   // 최소 나이
from Member m
```
### 📌 반환타입
```java
TypedQuery<Member> query = em.createQuery("select m from Member as m", Member.class);
Query query1 = em.createQuery("select m.username, m.age from Member as m");
```
> `TypeQuery` : 반환 타입이 명확할 때 사용
> `Query` : 반환 타입이 명확하지 않을 때 사용
### 📌 결과 조회
```java title:"getResultList 를 이용한 리스트 반환" hl:2
TypedQuery<Member> query = em.createQuery("select m from Member as m", Member.class);
List<Member> resultList = query.getResultList();
```
> getResultList 함수를 통해 목록 반환
```java title:"getSingleResult 이용한 단일 목록 반환" hl:3
TypedQuery<Member> query2 = em.createQuery("select m.username, m.age from Member as m where m.username = :username", Member.class)
        .setParameter("username", "member1");
Member singleResult = query2.getSingleResult();
```
> getSingleResult 함수를 통한 단일 반환

> [!note] getSingleResult 결과는 무조건 한개가 나와야 됨
> 결과가 없으면 `NoResultException`
> 결과가 둘 이상이라면 `NonUniqueResultException`
### 📌 다중 결과 조회
```java title:"Query 로 다중 결과 받기" hl:2-3
Query query1 = em.createQuery("select m.username, m.age from Member as m");
List query1ResultList = query1.getResultList();
Object[] result = (Object[]) query1ResultList.get(0);
System.out.println("username = " + result[0]);
System.out.println("age = " + result[1]);
```
```java title:"위 방법과 유사하지만 캐스팅 과정을 생략" hl:2-3
Query query1 = em.createQuery("select m.username, m.age from Member as m");
List<Object[]> query1ResultList = query1.getResultList();
Object[] objects = query1ResultList.get(0);
System.out.println("username = " + objects[0]);
System.out.println("age = " + objects[1]);
```
```java title:"new 를 사용하여 Dto 에 바로 넣는 방법" hl:1
TypedQuery<MemberDto> query1 = em.createQuery("select new jpabook.jpashop.domain.MemberDto( m.username, m.age ) from Member as m", MemberDto.class);
List<MemberDto> resultList1 = query1.getResultList();
for (MemberDto m : resultList1) {
	System.out.println("memberDto = " + m);
}
```
### 📌 파라미터 바인딩
#### 이름 기준
```java
TypedQuery<Member> query2 = em.createQuery("select m.username, m.age from Member as m where m.username = :username", Member.class)
        .setParameter("username", "member1");
Member singleResult = query2.getSingleResult();
```
#### 위치 기준(추천하지 않음)
```java
TypedQuery<Member> query2 = em.createQuery("select m.username, m.age from Member as m where m.username =?1", Member.class)
        .setParameter(1, "member1");
Member singleResult = query2.getSingleResult();
```
### 📌 프로젝션
- SELECT 절에 조회할 대상을 지정, 프로젝션으로 검색된 내용은 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|영속성 컨텍스트]]로 관리
 - `SELECT m FROM Member m` -> 엔티티 프로젝션
-  `SELECT m.team FROM Member m` -> 엔티티 프로젝션
-  `SELECT m.address FROM Member m` -> 임베디드 타입 프로젝션
-  `SELECT DISTINCT m.username, m.age FROM Member m` -> 스칼라 타입 프로젝션
-  `DISTINCT`로 중복 제거 
### 📌 페이징
- `setFirstResult(int startPosition)` : 조회 시작 위치(0부터 시작)
- `setMaxResults(int maxResult)` : 조회할 데이터 수
```java title:"페이징 방법"
List<Member> resultList2 = em.createQuery("select m from Member as m order by m.age desc", Member.class)
		.setFirstResult(1)
		.setMaxResults(10)
		.getResultList();
      
resultList2.forEach(System.out::println);
```
### 📌 조인
- 내부 조인
	- `SELECT m FROM Member m [INNER] JOIN m.team t`
- 외부 조인
	- `SELECT m FROM Member m LEFT [OUTER] JOIN m.team t`
- 세타 조인 (연관관계가 없는 관계의 조인)
	- `SELECT COUNT(m) from Member m, Team t where m.username=t.name`
- ON 절 (JPA 2.1 부터 지원)
	- 조인 대상 필터링
	- 연관관계 없는 엔티티 외부 조인([[하이버네이트]]  5.1부터 가능)
	- `SELECT m, t FROM Member m LEFT JOIN m.team t on t.name = 'A'`
### 📌 서브쿼리
- 서브쿼리 끼리는 연관되면 성능이 잘 안나옴(일반적인 [[SQL]]과 동일)
- 서브쿼리는 WHERE, HAVING 절에서만 사용 가능
- SELECT 절도 가능([[하이버네이트]] 에서 지원)
- FROM 절의 서브 쿼리는 현재 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPQL|JPQL]] 에서 불가능
	- 조인으로 풀 수 있다면 풀어서 해결하는 것을 추천
- 나이가 평균보다 많은 회원
	- `select m from Member m where m.age > (select avg(m2.age) from Member m2)`
- `[NOT] EXISTS(subquery)`: 서브쿼리에 결과가 존재하면 `true`
	- {ALL|ANY|SOME} (subquery)
	- `ALL` : 모두 만족하면 `true`
	- `ANY, SOME` : 같은 의미, 조건을 하나라도 만족하면 `true`
- `[NOT] IN (subquery)` : 서브쿼리의 결과 중 하나라도 같은 것이 있으면 `true`
### 📌 타입 표현
- 문자 : '' 로 표현 ' 를 적고 싶다면 ''를 두개 넣으면 작성 가능
- 숫자 : 10L(Long), 10D(Double), 10F(Float)
- Boolean : `TRUE`, `FALSE`
- ENUM : `jpabook.memberType.Admin` (패키지명 포함)
	- 파라메타로 쓰는게 더 편리
- 엔티티 타입 : `TYPE(m) = Member` (상속 관계에서 사용)
	- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@DiscriminatorColumn|@DiscriminatorColumn]] 타입으로 분류하고 있는 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@DiscriminatorValue|@DiscriminatorValue]] 로 값을 분류한 것을 검색할 때 사용
	- `em.createQuery( "select i from Item i where type(i) = Book", Item.class)`
###  📌 조건식
- 기본 CASE 식
```sql
select 
	case when m.age <= 10 then '학생요금'
			when m.age >= 60 then '경로요금'
			else '일반요금'
	end
from Member m
```
- 단순 CASE 식
```sql
select
	case t.name
			when '팀A' then '인센티브110%'
			when '팀B' then '인센티브120%'
	    else '인센티브105%'
	end
from Team t
```

- COALESCE : 하나씩 조회해서 null이 아니면 반환
	- 사용자 이름이 없으면 이름 없는 회원을 번환
	- `select coalesce(m.username, '이름없는 회원') from Member m`
- NULLIF : 두 값이 같으면 null 반환, 다르면 첫번째 값 반환
	- 사용자 이름이 관리자면 null 반환하고 나머지는 본인의 이름 반환
	- `select NULLIF(m.username, '관리자') from Member m`
###  📌 기본 함수
- CONCAT : 문자 합치기
- SUBSTRING : 잘라내기
- TRIM : 공백 제거
- LOWER, UPPER : 대소문자
- LENGTH : 길이
- LOCATE : 특정 문자 찾기
- ABS, SQRT, MOD : 수학함수
- SIZE : 컬렉션의 크기, INDEX(JPA 용도) : 컬렉션의 위치값 구하는 방법(추천하지 않음)
###  📌 사용자 정의 함수 호출
- 하이버네이트는 사용전 Dialect 에 추가 필요
- 사용하는 DB 방언을 상속 받고, 사용자 정의 함수를 등록
- [[하이버네이트]] 6 부터는 Dialect 통한 함수 등록이 불가능
- [하이버네이트6에서 사용 방법](https://www.inflearn.com/community/questions/1096265)
- `select function('group_concat', i.name) from Item i`
###  📌 경로 표현식
- `.`을 찍어 경로를 표현
```
select m.username -> 상태 필드
from Member m
join m.team t -> 단일 값 연관 필드
join m.orders o -> 컬렉션 값 연관 필드
where t.name = '팀A'
```
- 상태 필드(state field) : 단순히 값을 저장하기 위한 필드
	- 경로 탐색의 끝이기 때문에 더이상 검색 없음
- 연관 필드(association field) : 연관관계를 위한 필드
	- 단일 값 연관 필드 : [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ManyToOne|@ManyToOne]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@OneToOne|@OneToOne]], 대상이 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]]
		- 묵시적 내부 조인(inner join) 발생, 탐색 진행
	- 컬렉션 값 연관 필드 : [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@OneToMany|@OneToMany]]  , [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ManyToMany|@ManyToMany]], 대상이 컬렉션 
		- FROM 절에서 명시적 조인을 통해 별칭을 얻으면 별칭을 통해 탐색 가능
> [!warning] 🚨 단일 값 연관 필드 또는 컬렉션 값 연관 필드 조회시 주의 사항
> 묵시적 join 이 일어나기 때문에 모두 명시적 조인을 통해서 별칭을 얻으면 별칭을 통해 탐색 진행을 권유
> `{sql}select t.members from Team t` 이렇게 jpql 을 작성하면
> sql에서는 `{sql}select m from Team team inner join Member member on team.id=member.team_id` 형태로 검색하게 되기 때문에
>직접 이렇게 짜는 것을 추천`{sql}select m.username from Team t join t.members m`
### 📌 조인
#### ✨명시적 조인
- join 키워드를 직접 사용하는 것
- `{sql}select m from Member m join m.team t`
#### 묵시적 조인
- 경로 표현식에 의해 묵시적으로 [[SQL]]  조인 발생 (내부 조인만 가능)
- `{sql}select m.team from Member m`
#### ✨페치 조인 (fetch join)
- [[SQL]] 에서 지원하는 조인 종류가 아님
- 성능 최적화를 위해 제공하는 기능
- 연관된 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]]나 컬렉션을 SQL 한번에 함께 조회하는 기능([[2.Ref(데이터 및 정보 저장)/Spring/JPA/FetchType|FetchType.EAGER]] 과 동일한 즉시로딩)
- 객체 그래프를 SQL 한번에 조회하는 개념
- **[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ManyToOne|@ManyToOne]] 과 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@OneToOne|@OneToOne]] 일 경우 가장 효율적**
```sql title:"fetch join을 쓰지 않았을 때 두번 발생하는 SQL"
select m from Member as m -- jpql 요청 명령
select
		m1_0.MEMBER_ID,
		m1_0.age,
		m1_0.TEAM_ID,
		m1_0.username 
from
		Member m1_0
-----------------------------
select
		t1_0.TEAM_ID,
		t1_0.name 
from
		Team t1_0 
where
		t1_0.TEAM_ID=?
select m from Member m join fetch m.team
```
> `{java}em.createQuery("select m from Member as m", Member.class);`
```sql title:"fetch join을 쓸 경우 발생하는 SQL"
select m from Member as m join fetch m.team -- jpql 요청 명령
select
		m1_0.MEMBER_ID,
		m1_0.age,
		t1_0.TEAM_ID,
		t1_0.name,
		m1_0.username 
from
		Member m1_0 
join
		Team t1_0 
				on t1_0.TEAM_ID=m1_0.TEAM_ID
```
> `{java}em.createQuery("select m from Member as m join fetch m.team", Member.class);`

> [!warning] 🚨 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@OneToMany|일대다(1:N)]] 검색 관계 `join fetch` 할 경우 데이터 중복 문제
> `{java}List<Team> selectTFromTeamT = em.createQuery("select t from Team t join fetch t.members", Team.class).getResultList();`
> 이렇게 하면 데이터가 member 개수만큼 뻥튀기가 되는데 [[하이버네이트]]6 버전 이상부터는 이런 중복 제거를 자동으로 처리
> 즉, DISTINCT 을 명시적으로 사용하지 않아도 자동으로 중복 제거
> `{java title:"6버전 이전의 중복 제거 방법"}List<Team> selectTFromTeamT = em.createQuery("select distinct t from Team t join fetch t.members", Team.class).getResultList();`
> JPQL의 DISTINCT 기능 : [[SQL]] 에서 완전히 동일한 데이터 중복 제거, 애플리케이션에서 중복 제거
##### 🚨제약사항
- 별칭을 줄 수 없음
	- 하이버네이트는 가능, 가급적 사용 금지
- 둘 이상의 컬렉션은 페치 조인 할 수 없음(하더라도 하나만)
	- 1:N:M 인 상황이기 때문에 1:N 도 엄청난 데이터 중복이 발생하는데 더 심각한 문제 발생으로 조인 금지
- 컬렉션을 페치 조인하면 페이징 API를 사용 할 수 없음
	- 페이징을 할 경우 우선 중복된 데이터로 페이징 데이터로 필터링 하는 것이기 때문에 문제 발생 
		- 그런데 내가 해본 바로는 중복 제거 된 뒤 하는지 정상적으로 값이 나오는걸 확인
	- [[하이버네이트]] 는 경고 로그를 남기고 메모리에서 페이징(매우 위험)
		- `WARN: HHH90003004: firstResult/maxResults specified with collection fetch; applying in memory`
		- DB의 모든 데이터를 가져와서 메모리에서 처리(`OutOfMemoryError` 발생 위험)
	- 🌟 해결 방법1 : [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@OneToOne|일대일(1:1)]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ManyToOne|다대일(N:1)]] 경우 단일 값 연관 필드들은 페치 조인해도 페이징이 가능하기 때문에 방향을 반대로 바꾸면 해결
	- 🌟 해결 방법2 : [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@BatchSize]]을 쓰거나 글로벌한 속성을 설정
- 여러 테이블 조인해서 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 형태가 아닌 전혀 다른 결과를 낼때는 페치 조인보다는 일반 조인을 사용하여 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/DTO (Data Transfer Object)|DTO]] 로 반환하는 것이 효과적
### 📌 다형성 쿼리
- type()
	- 조회 대상을 특정 자식으로 한정
```sql title:"Item 을 상속한 Book과 Movie 만 조회"
select i from Item i
where type(i) IN (Book, Movie)
```
- TREAT (JPA 2.1 이후 부터 가능)
	- 타입 캐스팅 개념
```sql title:"아이템 중에서 타입은 Book이고 auther 가 'kim'인 것"
select i from Item i
where treat(i as Book).auther = 'kim'
```
### 📌 Named 쿼리
- 정적 쿼리를 미리 정의 하는 방법
	1. XML 사용 방법(가장 높은 우선권)
	2. [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@NamedQuery]] 사용 방법
		- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Spring Data JPA|Spring Data JPA]] 사용할 때 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Query|@Query]] 를 만들때 사용
### 📌 벌크 연산
- update 와 delete 기능을 한번에 하는 것
```java
int resultCount = em.createQuery("update Member m set m.age = 20")
	.executeUpdate();
System.out.println("resultCount = " + resultCount);
```
#### 🚨주의 사항
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|영속성 컨텍스트]]를 무시하고 DB에 직접 쿼리
	- 해결방법
		- 벌크 연산을 먼저 실행하고 끝내는 방법
			- 끝나고 실행을 종료하면 그 뒤에 컨텍스트를 통해 가져와도 정상
		- 벌크 연산을 수행 후 영속성 컨텍스트 초기화 하는 방법
			- 가장 먼저 시작해서 초기화해버리면 모두 다시 가져오기 때문에 정상
## 🛠 컬렉션 조회
```java
String jpql = "select m from Member m where m.username in :names"
```
## 🛠  페이징
```java
public List<Member> findByPage(int age, int offset, int limit) {
	return em.createQuery("select m from Member m where m.age = :age order by m.username desc", Member.class)
		.setParameter("age", age)
		.setFirstResult(offset)
		.setMaxResults(limit)
		.getResultList();
}
public long totalCount(int age) {
	return em.createQuery("select count(m) from Member m where m.age = :age", Long.class)
		.setParameter("age", age)
		.getSingleResult();
}
```
## 🛠 사용 예제
```java title:"단순한 검색 기능"
public class JpaMain {
  public static void main(String[] args) {
    EntityManagerFactory emf = Persistence.createEntityManagerFactory("hello");
    PersistenceUnitUtil persistenceUnitUtil = emf.getPersistenceUnitUtil();
    EntityManager em = emf.createEntityManager();
    EntityTransaction transaction = em.getTransaction(); // JPA의 모든 데이터 변경은 트랜잭션 안에서 실행
    try {
      transaction.begin();

      String jpql = "select m From Member m where m.name like '%kim%'";
      List<Member> result = em.createQuery(jpql, Member.class)
        .setFirstResult(1)
        .setMaxResults(10)
        .getResultList();

      transaction.commit();
    } catch (Exception e) {
      transaction.rollback();
    } finally {
      em.close();
    }
    emf.close();
  }
}

```