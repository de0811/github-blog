---
aliases:
  - QueryDSL
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: 
---
# QueryDSL
- 쿼리를 java 로 type-safe 하게 개발할 수 있게 지원하는 프레임워크
- 주로 JPA JPQL에 사용
- 장점
	- type-safe 
	- 단순함
	- 쉬움
- 단점
	- Q코드 생성을 위한 APT 설정
- [성능 개선을 위해 노력하는 블로그](https://velog.io/@zini9188/QueryDSL)

## ⚙️ 설정

| **패키지**                                           | **설명**                      | **상세 설명**                                                                                              |
| ------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------ |
| **`com.querydsl:querydsl-jpa`**                   | QueryDSL 내에서 JPA 사용 지원을 제공  | SQL, NoSQL을 사용할 때 데이터 액세스하기 위한 방법을 제공<br>컴파일 시점에 쿼리에 대한 오류 감지<br>IDE의 자동 완성 기능을 사용하여 쿼리를 쉽게 작성 및 유지 관리 |
| **`com.querydsl:querydsl-apt`**                   | QueryDSL의 어노테이션 처리 도구 제공    | 도메인 클래스의 구조가 변경될 때마다 메타 모델(Q-Class)를 수동으로 수정하는 번거로움 없이, 변경된 구조에 맞는 쿼리 작성                               |
| **`jakarta.annotation:jakarta.annotation-api`**   | Jakarta의 어노테이션 API 제공       | 개발자들은 웹 애플리케이션 개발 시 필요한 어노테이션들을 활용하여 코드를 작성                                                            |
| **`jakarta.persistence:jakarta.persistence-api`** | Jakarta의 Persistence API 제공 | 데이터베이스와의 상호작용을 추상화하여 개발자가 직접 SQL 쿼리를 작성하지 않고도 데이터를 저장하고 검색 지원<br>개발 과정을 단순화하고 개발 시간을 줄여주는 장점           |
```groovy title:"build.gradle spring boot 3.x"
dependencies {
	//Querydsl 추가
	implementation 'com.querydsl:querydsl-jpa:5.0.0:jakarta'
	annotationProcessor "com.querydsl:querydsl-apt:${dependencyManagement.importedProperties['querydsl.version']}:jakarta"
	annotationProcessor "jakarta.annotation:jakarta.annotation-api"
	annotationProcessor "jakarta.persistence:jakarta.persistence-api"
}
```
```groovy title:"build.gradle spring boot 2.6.5"
dependencies {
...
//Querydsl 추가  
implementation 'com.querydsl:querydsl-jpa'  
annotationProcessor "com.querydsl:querydsl-apt:${dependencyManagement.importedProperties['querydsl.version']}:jpa"  
annotationProcessor "jakarta.annotation:jakarta.annotation-api"  
annotationProcessor "jakarta.persistence:jakarta.persistence-api"
}

//Querydsl 추가, 자동 생성된 Q클래스 gradle clean으로 제거  
clean {  
    delete file('src/main/generated')  
}
```
### Gradle IntelliJ 사용법
`Gradle -> Tasks -> build -> clean` 
`Gradle -> Tasks -> other -> compileJava`
### Gradle CLI 사용법
`./gradlew clean compileJava`
### Q 타입 생성 위치
- Intellij 설정에서 Gradle 로 빌드 할 경우
	- `build/generated/sources/annotationProcessor/java/main`
- IntelliJ 설정에서 IntelliJ 로 빌드 할 경우
	- `src/main/generated` 경로에서 빌드
## 🚨 주의사항

## 🔍 설명
### 중요 클래스
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPAQueryFactory|JPAQueryFactory]]  : 쿼리 작성
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/AbstractJPAQuery|AbstractJPAQuery]]  : 실질적인 실행
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Tuple|Tuple]] : 여러 값으로 반환횔 때 사용
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPAExpressions|JPAExpressions]] : 서브쿼리
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/CaseBuilder|CaseBuilder]] : case 사용
### 📌 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPQL|JPQL]]  vs [[2.Ref(데이터 및 정보 저장)/Spring/Repository/QueryDSL|QueryDSL]] 
```java
@Test
public void startJPQL() {
	// member1을 찾아라
	String query = "select m from Member m where m.username = :username";
	Member findMember = em.createQuery(query, Member.class)
		.setParameter("username", "member1")
		.getSingleResult();

	Assertions.assertThat(findMember.getUsername()).isEqualTo("member1");
}

@Test
public void startQuerydsl() {
	QMember member = QMember.member;
	// member1을 찾아라
	Member findMember = new JPAQueryFactory(em)
		.select(member)
		.from(member)
		.where(member.username.eq("member1"))
		.fetchOne();

	assert findMember != null;
	Assertions.assertThat(findMember.getUsername()).isEqualTo("member1");
}
```
### 📌 Q-Type
- Aliase 지정하는 방법
	- `{java icon}QMember member = new QMember("m");`
		- 생성 시 넣어주는 이름으로 별칭 지정
- where(검색 조건)
	- `{java}member.username.eq("member1")` : ==
	- `{java}member.username.ne("member1")` : !=
	- `{java}member.username.eq("member1").not()` : !=
	- `{java}member.username.isNotNull()` : is Not Null
	- `{java}member.age.in(10,20)` : 10, 20 포함
	- `{java}member.age.notIn(10,20)` : 10, 20 포함되지 않음
	- `{java}member.age.between(10,30)` : 10~30 사이
	- `{java}member.username.like("member%")` : like 검색
	- `{java}member.username.contains("member")` : like `%member%` 검색
	- `{java}member.username.startsWith("member")` : like `member%` 검색
- orderBy(정렬)
	- `nullLast()` : `{java}.orderBy(member.age.desc(), member.username.asc().nullLast())`
		- 회원 이름이 없다면 마지막에 출력
	- `nullFirst()` : `{java}.orderBy(member.age.desc(), member.username.asc().nullFirst())`
		- 회원 이름이 없다면 맨 처음에 출력

- 집합
	- `{java}member.count()` : 총 개수
	- `{java}member.age.sum()` : 총 합
	- `{java}member.age.avg()` : 평균
	- `{java}member.age.max()` : 최대 값
	- `{java}member.age.min()` : 최소 값
- 연산
	- `{java}member.age.add(1)` : 1 더하기
	- `{java}member.age.multiply(2)` : 2 곱하기
- 각종 상수
	- `{java}member.age.stringValue()` : [[enum]] 또는 숫자 값을 문자로 반환
	- `{java}Expressions.constant(문자)` : 상수 값을 표현할때 사용, 쿼리 내 특정 값이 항상 나오도록 하기 위해 사용
	- `{java}member.username.concat("_")` : 문자 합치기
### 프로젝션(반환)
#### 단일 프로젝션 반환일 경우
```java
@Test
public void simpleProjection() {
	QMember member = QMember.member;
	List<String> fetch = new JPAQueryFactory(em)
		.select(member.username)
		.from(member)
		.fetch();
}
```
#### 다중 프로젝션 반환일 경우
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Tuple|Tuple]] 또는 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/DTO (Data Transfer Object)|DTO (Data Transfer Object)]] 로 조회
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@QueryProjection|@QueryProjection]] 보통 사용 
```java title:"Tuple 사용 방법"
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

```java title:"JPQL 사용 방법"
@Test
public void findDtoByJPQL() {
	List<MemberDto> resultList = em.createQuery(
		"select new study.querydsl.dto.MemberDto(m.username, m.age) from Member m", MemberDto.class)
		.getResultList();

	for (MemberDto memberDto : resultList) {
		System.out.println("memberDto = " + memberDto);
	}
}
```

```java title:"DTO setter 이용한 사용 방법"
@Test
public void findDtoSetter() {
	QMember member = QMember.member;
	List<MemberDto> fetch = new JPAQueryFactory(em)
		.select(Projections.bean(MemberDto.class, member.username, member.age))
		.from(member)
		.fetch();

	for (MemberDto memberDto : fetch) {
		System.out.println("memberDto = " + memberDto);
	}
}
```

```java title:"DTO field에 바로 넣어버리는 사용 방법"
@Test
public void findDtoField() {
	QMember member = QMember.member;
	List<MemberDto> fetch = new JPAQueryFactory(em)
		.select(Projections.fields(MemberDto.class, member.username, member.age))
		.from(member)
		.fetch();

	for (MemberDto memberDto : fetch) {
		System.out.println("memberDto = " + memberDto);
	}
}
```

```java title:"DTO 생성자를 이용한 사용 방법"
@Test
public void findDtoConstructor() {
	QMember member = QMember.member;
	List<MemberDto> fetch = new JPAQueryFactory(em)
		.select(Projections.constructor(MemberDto.class, member.username, member.age))
		.from(member)
		.fetch();

	for (MemberDto memberDto : fetch) {
		System.out.println("memberDto = " + memberDto);
	}
}
```

```java title:"필드 이름이 다른 DTO를 Field를 이용한 사용 방법" hl:5
@Test
public void findUserDto() {
	QMember member = QMember.member;
	List<UserDto> fetch = new JPAQueryFactory(em)
		.select(Projections.fields(UserDto.class, member.username.as("name"), member.age))
		.from(member)
		.fetch();

	for (UserDto userDto : fetch) {
		System.out.println("userDto = " + userDto);
	}
}
```
> as를 이용해서 alias 를 정하는 것이 포인트
```java title:"ExpressionUtils를 이용해서 alias 지정하는 방법으로 서브쿼리를 특정 이름으로 넣기" hl:10-13
@Test
public void findUserDtoSubQuery() {
	QMember member = QMember.member;
	QMember subMember = new QMember("subMember");

	List<UserDto> fetch = new JPAQueryFactory(em)
		.select(Projections.fields(
			UserDto.class,
			ExpressionUtils.as(member.username, "name"),
			ExpressionUtils.as(JPAExpressions
				.select(subMember.age.max())
				.from(subMember), "age")
		))
		.from(member)
		.fetch();

	for (UserDto userDto : fetch) {
		System.out.println("userDto = " + userDto);
	}
}
```

```java title:"Field 이름이 다른 Dto에 생성자를 이용한 사용 방법"
@Test
public void findUserDtoByConstructor() {
	QMember member = QMember.member;
	List<UserDto> fetch = new JPAQueryFactory(em)
		.select(Projections.constructor(
			UserDto.class, member.username, member.age
		))
		.from(member)
		.fetch();

	for (UserDto userDto : fetch) {
		System.out.println("userDto = " + userDto);
	}
}
```

```java title:"@QueryProjection 쓰는 방법" hl:7
@Data
@NoArgsConstructor
public class MemberDto {
  private String username;
  private int age;

  @QueryProjection
  public MemberDto(String username, int age) {
    this.username = username;
    this.age = age;
  }
}

@Test
public void findDtoByQueryProjection() {
	QMember member = QMember.member;
	List<MemberDto> fetch = new JPAQueryFactory(em)
		.select(new QMemberDto(member.username, member.age))
		.from(member)
		.fetch();

	for (MemberDto memberDto : fetch) {
		System.out.println("memberDto = " + memberDto);
	}
}
```
### 동적 쿼리
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/BooleanBuilder|BooleanBuilder]]
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/BooleanExpression|BooleanExpression]]
#### 🚨 주의사항
- 동적 쿼리에서 조건이 없을 경우 모든 데이터를 가져와서 문제
	- 한번에 받아올 수 있는 개수 제한
	- 기본 검색 조건 설정
	- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Pageable|Pageable]]을 사용해서 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Page|Page]]로 받는 것을 추천
### 수정, 삭제 패치 쿼리
```java title:"수정 방법, 영속성 컨텍스트에 이미 있을 경우 초기화가 필요(기존의 컨텍스트 내용만 사용)"
@Test
public void bulkUpdate() {
	QMember member = QMember.member;
	long count = new JPAQueryFactory(em)
		.update(member)
		.set(member.username, "비회원")
		.where(member.age.lt(28))
		.execute();

	// 영속성 컨텍스트에 있는 데이터와 DB에 있는 데이터의 차이를 해결하기 위해 flush, clear를 사용
	em.flush();
	em.clear();
}
```

```java title:"삭제 방법"
@Test
public void bulkDelete() {
	QMember member = QMember.member;
	long count = new JPAQueryFactory(em)
		.delete(member)
		.where(member.age.gt(18))
		.execute();
}
```
### SQL Function 호출하기
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Dialect|Dialect]]  에 등록 필요
```java
@Test
public void sqlFunction() {
	QMember member = QMember.member;
	List<String> fetch = new JPAQueryFactory(em)
		.select(Expressions.stringTemplate("function('replace', {0}, {1}, {2})",
			member.username, "member", "M"))
		.from(member)
		.fetch();

	for (String s : fetch) {
		System.out.println("s = " + s);
	}
}
```
### CountQuery 최적화
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/PageableExecutionUtils|PageableExecutionUtils]]  사용하는 방법

### Sort를 [[2.Ref(데이터 및 정보 저장)/Spring/Repository/QueryDSL|QueryDSL]] 의 정렬로 변환
- OrderSpecifier 로 변경 기능 제공
- Sort 조건이 조금만 복잡해져도 Pageable 의 Sort 기능을 사용하기 어려움
- 루트 엔티티 범위를 넘어가는 동적 정렬 기능이 필요하면 스프링 데이터 페이징이 제공하는 Sort 를 사용하기 보다 [[2.Ref(데이터 및 정보 저장)/개발 이론/Parameter|파라메터]]를 받아서 직접 처리하는 것을 권장
	- 루트 엔티티 : 엔티티 안에 다른 엔티티들은 루트 엔티티가 아님
```java title:"Sort를 QueryDSL 의 정렬로 변환"
JPAQuery<Member> query = queryFactory.selectFrom(member);
for (Sort.Order o : pageable.getSort()) {
	PathBuilder pathBuilder = new PathBuilder(member.getType(), member.getMetadata());
	query.orderBy(new OrderSpecifier(o.isAscending() ? Order.ASC : Order.DESC,
	pathBuilder.get(o.getProperty())));
}
List<Member> result = query.fetch();
```

### 스프링 데이터 JPA가 제공하는 QueryDSL 기능
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/QuerydslPredicateExecutor|QuerydslPredicateExecutor]] 
- [QueryDSL의 웹 지원 기능](https://docs.spring.io/spring-data/jpa/docs/2.2.3.RELEASE/reference/html/#core.web.type-safe)
	- 컨트롤러가 [[2.Ref(데이터 및 정보 저장)/Spring/Repository/QueryDSL|QueryDSL]] 의존 상태 발생
	- 조인 문제 발생
	- `eq`만 됨
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/QuerydslRepositorySupport|QuerydslRepositorySupport]]
 
## 🛠 사용 예제



 
