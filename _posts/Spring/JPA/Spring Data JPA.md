---
aliases:
  - Spring Data JPA
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: "`Spring Data Common`을 상속받아 JPA 맞게 변화시킨 것"
---
# Spring Data JPA
- `Spring Data Common`을 상속받아 JPA 맞게 변화시킨 것
- 메서드 이름으로 쿼리 생성
- 인터페이스에 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Query|@Query]] 사용하여 직접 JPQL쿼리 작성 가능
- `JpaRepository` 를 이용하여 공통화 가능한 인터페이스 정리

```plantuml
interface Repository 
interface CrudRepository {
	S save(S)
	T findById(ID)
	boolean exists(ID)
	long count()
	void delete(T)
}
interface PagingAndSortingRepository {
	Iterable<T> findAll(Sort)
	Page<T> findAll(Pageable)
}
interface JpaRepository {
	List<T> findAll()
	List<T> findAll(Sort)
	List<T> findAll(Iterable<ID>)
	List<S >  save(Iterable<S >)
	void flush()
	T saveAndFlush(T)
	void deleteInBatch(Iterable<T>)
	void deleteAllInBatch()
	T getOne(ID)
}

Repository <|-- CrudRepository
CrudRepository <|-- PagingAndSortingRepository
PagingAndSortingRepository <|-- JpaRepository 
```
## 🚨 주의사항
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/merge|merge]]  기능의 사용 추천하지 않음
### 🚨 새로운 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]]  확인하는 문제
- Long 또는 long 형태는 null 또는 0 이라는 값을 가질 경우 아직 DB에 등록되지 않은 것을 알 수 있음
- 하지만 String 형의 경우 자동 ID 할당 방식이 아니기 때문에 사용자는 직접 ID 값을 입력하여 처음 넣는 데이터인지 아니면 기존에 있던 데이터인지 알 수 없음
```java title:"처음 넣는 엔티티인지 확인할 수 있도록 로직 작성"
@Entity
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Item implements Persistable<String> {
  @Id
  private String id;
  private String name;
  @CreatedDate
  private LocalDateTime createdDate;

  @Override
  public String getId() {
    return id;
  }

  @Override
  public boolean isNew() {
    return createdDate == null;
  }
}
```
## 🔍 속성 설명
```properties
# 기본 로그만으로 JPA 파라메터 표시  
## SQL 로그 출력  
spring.jpa.properties.hibernate.format_sql=true  
## queryDSL 이용하여 작성된 JPQL 출력
spring.jpa.properties.hibernate.use_sql_comments=true  
## org.hibernate.SQL : SQL 쿼리 출력  
logging.level.org.hibernate.SQL=DEBUG  
## SQL 쿼리 파라메터 표시  
spring.jpa.properties.hibernate.type=trace
```
### 📌 쿼리 메서드
```java
public interface SpringDataJpaItemRepository extends JpaRepository<Item, Long> {
	//쿼리 메서드
	List<Item> findByItemNameLike(String itemName);

	@Query("select i from Item i where i.itemName like :itemName and i.price <= :price")
	List<Item> findItems(@Param("itemName") String itemName, @Param("price") Integer price);
}
```
- [Spring Data JPA Query Method](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html)
- 쿼리 메서드가 너무 길면 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Query|@Query]] 이용해서 JPQL을 직접 작성
- Spring Data JPA 또한 동적 쿼리는 몹시 취약한데 그 취약함을 보안하기 위해 `Example` 이라는 기능이 있지만 기능이 하찮아서 실무에선 사용하지 않음
	- 기본적으로 [[2.Ref(데이터 및 정보 저장)/Spring/Repository/QueryDSL|QueryDSL]] 사용하는 것을 추천
### Class
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Sort|Sort]]
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Pageable|Pageable]]
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Page|Page]]
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Slice|Slice]]
### [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|어노테이션]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PersistenceUnit|@PersistenceUnit]]
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PersistenceContext|@PersistenceContext]]
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Query|@Query]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@EntityGraph|@EntityGraph]] 
### JPA Hint, Lock
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@QueryHints|@QueryHints]]
-  [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Lock|@Lock]] 
### 사용자 정의 레포지토리 구현
- 각종 쿼리지원 방법을 사용할 수 있는 방법
- 추가하려는 `Repository 의 이름` + `Impl` 으로 붙여야 동작 가능
```java
public interface MemberRepositoryCustom {  
  List<Member> findMemberCustom();  
}

@RequiredArgsConstructor
public class MemberRepositoryImpl implements MemberRepositoryCustom {
  private final EntityManager em;
  @Override
  public List<Member> findMemberCustom() {
    return em.createQuery("select m from Member m")
      .getResultList();
  }
}

public interface MemberRepository extends JpaRepository<Member, Long>, MemberRepositoryCustom {
}

```
### 감사 기능
- 상속을 통해 공통적인 감사 기능의 인스턴스를 생성하는 것을 추천
- 이벤트 관련 어노테이션
	- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PrePersist|@PrePersist]]
	- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PreUpdate|@PreUpdate]]
	- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PostPersist|@PostPersist]]
	- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PostUpdate|@PostUpdate]]
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@EnableJpaAuditing|@EnableJpaAuditing]]
	- [[AuditorAware]]
	- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@CreatedDate|@CreatedDate]] 
	- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@LastModifiedDate|@LastModifiedDate]] 
	- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@CreatedBy|@CreatedBy]] 
	- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@LastModifiedBy|@LastModifiedBy]] 
### 확장 - 도메인 클래스 컨버터
- Spring boot 에서 자동으로 id 값을 검색해서 전달 가능
- 하지만 해당 방법은 추천하지 않음
- 해당 기능은 오로지 조회용으로만 사용
```java
@RestController
@RequiredArgsConstructor
public class MemberController {
  private final MemberRepository memberRepository;

  @GetMapping("members/{id}")
  public String findMember(@PathVariable("id") Long id) {
    return memberRepository.findById(id).get().getUsername();
  }

  @GetMapping("members/{id}")
  public String findMember2(@PathVariable("id") Member member) {
    return member.getUsername();
  }
}
```
### 확장 - 페이징과 정렬
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Controller|@Controller]] 에서 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Pageable|Pageable]] [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Sort|Sort]] 자동 가능
	- `/members?page=0&size=3&sort=id,desc&sort=username,desc`
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PageableDefault|@PageableDefault]] 
- 접두사 사용
	- 페이징 정보가 둘 이상이면 접두사로 구분
```java title:"접두사로 구분하는 방법"
public String list(
	@Qualifier("member") Pageable memberPageable,
	@Qualifier("order") Pageable OrderPageable,
	...
)
```
> `/members?member_page=0&order_page=1`
#### 시작 페이지의 숫자를 1로 설정 방법
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Pageable|Pageable]] 과 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Page|Page]] 를 직접 정의 하는 방법
- `{properties icon}spring.data.web.apgeable.one-indexed-parameters` 값을  `true`로 설정하는 방법
	-  `page`[[2.Ref(데이터 및 정보 저장)/개발 이론/Parameter|파라메터]] 값을 -1 처리할 뿐 내부 값들은 모두 0에서 시작하기 때문에 혼선 및 에러 발생 위험(추천하지 않음)
### 잡다
#### 명세
[[Specification]] 사용하는 방법이지만 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPA Criteria|JPA Criteria]] 를 사용하는 방법이라서 유지보수가 어려워 사용하는 것을 추천하지 않음
#### Query By Example 
#### Projections
- 엔티티 대신 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/DTO (Data Transfer Object)|DTO (Data Transfer Object)]] 조회할때 사용
#### 네이티브 쿼리

## 🛠 사용 예제
