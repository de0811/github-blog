---
aliases:
  - "@Query"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - Spring/Repository
특징: 
---
# @Query
- JPA 인터페이스에 쿼리 직접 작성 가능
- 기본은[[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPQL|JPQL]] 사용, 옵션을 통해 네이티브 쿼리(SQL) 사용가능
- 앱 로딩 시점에 문법 오류 검사
## 🚨 주의사항
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Native SQL|Native SQL]]  사용할 경우 Projections과 함께 사용하는 것을 추천

## 🔍 속성 설명
### 📌
## 🛠 사용 예제
```java title:"위치 기반 사용"
public interface UserRepository extends JpaRepository<User, Long> {
	@Query("select u from User u where u.emailAddress = ?1")
	User findByEmailAddress(String emailAddress);
}
```

```java title:"네이티브 쿼리 지원"
public interface UserRepository extends JpaRepository<User, Long> {
	@Query(value="SELECT * FROM USERS WHERE EMAIL_ADDRESS=?0", nativeQuery = true)
	User findByEmailAddress(String emailAddress);
}
```
### [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/DTO (Data Transfer Object)|DTO]] 조회 방법
```java title:"DTO 로 조회 방법"
public interface MemberRepository extends JpaRepository<Member, Long> {
  @Query("select new study.data_jpa.dto.MemberDto(m.id, m.username, t.name) from Member m join m.team t")
  List<MemberDto> findMemberDto();
}
```
### 컬렉션 조회 방법
```java
@Query("select m from Member m where m.username in :names")
List<Member> findByNames(@Param("names") List<String> names);
```
### [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Page|Page]]  CountQuery 성능 해결
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
### 벌크 연산
-  🚨 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/flush|flush]] 하지 않고 작동하기 때문에 컨텍스트 문제를 조심해야함
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Modifying|@Modifying]] 통해서 처리
```java
@Modifying
@Query("update Member m set m.age = m.age + 1 where m.age >= :age")
int bulkAgePlus(int age);
```