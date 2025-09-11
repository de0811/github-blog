---
aliases:
  - JPA
  - OSIV
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징:
isPublic: false
---
# JPA
- [[2.Ref(데이터 및 정보 저장)/Spring/Repository/ORM(Object-relational mapping)|ORM(Object-relational mapping)]] 기술의 표준
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPQL|JPQL]] 사용으로 DB 호환성 유지
- JPA만의 [[2.Ref(데이터 및 정보 저장)/Spring/Exception/PersistenceException|PersistenceException]] 에러 처리 흐름
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Spring Data JPA|Spring Data JPA]]
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|영속성 컨텍스트]]를 통한 관리
## 구동방식
![[config/AttachedFile/Pasted image 20250125145102.png|400]]
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|Persistence]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/EntityManagerFactory|EntityManagerFactory]]
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/EntityManager|EntityManager]] 
## 옵션 설정
```xml
<property name="hibernate.show_sql" value="true"/> <!-- SQL을 보여줄 것인지 -->  
<property name="hibernate.format_sql" value="true"/> <!-- SQL을 보기 좋게 포맷팅 -->  
<property name="hibernate.use_sql_comments"  value="true"/> <!-- SQL이 왜 나왔는지 주석으로 추가 -->  
<property name="hibernate.hbm2ddl.auto" value="create" />
```
```properties title:"JPA 설정"
# JPA  
hibernate.hbm2ddl.auto=create #DB를 새로 만들지 말지 등 여러 설정
# hibernate 생성하고 실행하는 SQL을 출력  
logging.level.org.hibernate.SQL=DEBUG  
# hibernate가 SQL을 바인딩할 때의 로그를 출력  
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE  
# hibernate가 생성하는 SQL을 System.out에 출력 (추천하지 않음)  
#spring.jpa.show-sql=true #SQL을 보여줄 것인지
#hibernate.format-sql=true #SQL을 보기 좋게 포맷팅
#hibernate.use-sql-comments=true #SQL이 왜 나왔는지 주석으로 추가
```
### `hibernate.hbm2ddl.auto`
- `create` : `DROP` + `CREATE`
- `create-drop` : `create`와 같으나 종료시점에 테이블 모두 `DROP`
- `update` : 변경된 부분만 반영(운영 DB에는 사용 추천하지 않음)
- `validate` : 엔티티와 테이블이 정상 매핑되었는지만 확인 (운영 추천)
- `none` : 사용하지 않음 (운영 추천)
### 쿼리 [[2.Ref(데이터 및 정보 저장)/개발 이론/Parameter|파라메터]] 확인을 위한 플러그인
- [[0.New Note/p6spy|p6spy]] 
## 제약조건
- **모든 데이터 변경은 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Transactional|@Transactional]] 또는 [[2.Ref(데이터 및 정보 저장)/Spring/Repository/1.Transaction|Transaction]]  안에서 동작**
- 기본 생성자가 필수로 있어야함
## 🚨 주의사항
### 📌 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Id|@Id]] [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Column|@Column]] 의 이름을 명확히 지정
- 왠만하면 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Id|@Id]] 컬럼의 이름은 직접 지정
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@JoinColumn|@JoinColumn]] 관계를 설정할때 이름이 유니크해야 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|영속성 컨텍스트]] 통해서 작성 가능
```java title:"Id 컬럼 이름이 명확해야 FK로 지정 가능"
@Data
@Table(name = "cs_user_app")
@Entity
public class UserApp implements AuditData {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "cs_user_app_id")
    private Long id;
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "cs_user_id")
    private User user;
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "cs_app_info_id")
    private AppInfo appInfo;
}
```
### 📌 무한루프 주의
- 양방향일 경우
- `toString()`, [[2.Ref(데이터 및 정보 저장)/Intellij/Lombok|Lombok]] , JSON 생성 라이브러리 등을 통한 자동 생성으로 무한루프 주의
## 🔍 속성 설명
### 객체와 테이블 매핑
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Entity|@Entity]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@EntityScan|@EntityScan]] 
### 데이터베이스 스키마 자동 생성
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@GeneratedValue|@GeneratedValue]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@SequenceGenerator|@SequenceGenerator]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@TableGenerator|@TableGenerator]] 
### 필드와 컬럼 매핑
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Column|@Column]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Lob|@Lob]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Temporal|@Temporal]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Enumerated|@Enumerated]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Transient|@Transient]] 
### 기본 키 매핑
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Id|@Id]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@GeneratedValue|@GeneratedValue]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Column|@Column]] 
### 연관관계 매핑
- 방향(Direction) : 단방향, 양방향
- 다중성(Multiplicity) : [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ManyToOne|다대일(N:1)]] , [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@OneToMany|일대다(1:N)]] , [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@OneToOne|일대일(1:1)]] , [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ManyToMany|다대다(N:M)]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/연관관계 주인|연관관계 주인]]  (Owner) : 객체 양방향 연관관계는 관리 주인 필요
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@JoinColumn|@JoinColumn]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@JoinTable|@JoinTable]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ManyToOne|@ManyToOne]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@OneToMany|@OneToMany]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@OneToOne|@OneToOne]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ManyToMany|@ManyToMany]] 
### 상속관계
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Inheritance|@Inheritance]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/InheritanceType|InheritanceType]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@MappedSuperclass|@MappedSuperclass]] 
### 프록시
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/CascadeType|CascadeType]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/FetchType|FetchType]]
### 값 타입
- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 타입
	- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Entity|@Entity]]  로 정의하는 객체
	- 데이터가 변해도 식별자로 지속해서 추적 가능
	- ex) 회원 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]]의 키나 나이 값을 변경해도 식별자로 인식 가능
- 값 타입
	- int, Integer, String 같이 단순히 값으로 사용하는 자바 기본 타입이나 객체
	- 식별자가 없고 값만 있으므로 변경시 추적 불가
	- 예) 숫자 100을 200으로 변경하면 완전히 다른 값으로 대체
	- 분류
		- 기본값 타입
			- 자바 기본 타입(int, double)
			- 래퍼 클래스(Integer, Long)
			- String 
		- 임베디드 타입(embedded type, 복합 값 타입)
			- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Embeddable|@Embeddable]]
			- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Embedded|@Embedded]] 
			- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@AttributeOverrides|@AttributeOverrides]]
			- x,y,z 값을 좌표로 묶어서 클래스로 사용하는 것
			- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]]  내에서 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 가 아닌 일반 클래스를 사용하는 것
		- 컬렉션 값 타입(collection value type)
			- 이걸 쓸거라면 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@OneToMany|@OneToMany]] 에 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/CascadeType|CascadeType.ALL]] 에다가 `orphanRemoval` 옵션 사용 추천
			- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ElementCollection|@ElementCollection]] 
			- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@CollectionTable|@CollectionTable]] 
			- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|Entity]] 의 리스트가 아닌 값으로 이루어진 List
### 쿼리 지원 방법
- 우회 DB 조회 방법을 사용하기 전에 꼭 JPA의 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/flush|flush]] 진행 필요
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPQL|JPQL]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPA Criteria]]
- [[2.Ref(데이터 및 정보 저장)/Spring/Repository/QueryDSL|QueryDSL]] 
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Native SQL]]
- [[2.Ref(데이터 및 정보 저장)/Spring/Repository/🌱1.데이터 접근 핵심 원리]] 
- [[JDBC]]
- [[2.Ref(데이터 및 정보 저장)/Spring/Repository/MyBatis|MyBatis]] 
- [[SpringJdbcTemplate]]
### xToOne([[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ManyToOne|@ManyToOne]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@OneToOne|@OneToOne]] ) 성능 최적화
```java title:"각 단계별 최적화"
  @GetMapping("/api/v1/simple-orders")
  public List<Order> ordersV1() {
    List<Order> all = orderRepository.findAllByString(new OrderSearch());
    for (Order order : all) {
      order.getMember().getName(); //Lazy 강제 초기화
      order.getDelivery().getAddress(); //Lazy 강제 초기화
    }
    return all;
  }

  @GetMapping("/api/v2/simple-orders")
  public List<ResOrderDto> ordersV2() {
    List<Order> orders = orderRepository.findAllByString(new OrderSearch());
    List<ResOrderDto> result = orders.stream()
      .map(ResOrderDto::new)
      .collect(Collectors.toList());
    return result;
  }

  @GetMapping("/api/v3/simple-orders")
  public List<ResOrderDto> ordersV3() {
    List<Order> orders = orderRepository.findAllWithMemberDelivery();
    List<ResOrderDto> result = orders.stream()
      .map(ResOrderDto::new)
      .collect(Collectors.toList());
    return result;
  }
```
#### [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]]를 그대로 넘기는 방법
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@JsonIgnore]]
- Hibernate6Module 이용한 방법
```java title:"json 으로 나가는 모든 엔티티는 강제 로딩"
	@Bean
	Hibernate6Module hibernate6Module() {
		Hibernate6Module hibernate6Module = new Hibernate6Module();
		hibernate6Module.configure(Hibernate6Module.Feature.FORCE_LAZY_LOADING, true);
		return hibernate6Module;
	}
```
- 단점
	- 엔티티를 그대로 넘기게 되면 무한루프 발생
	- Hibernate6Module 종속적으로 만들어 문제
	- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 수정시 연관된 클라이언트 등 호환성 문제 
#### [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]]를 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/DTO (Data Transfer Object)|DTO]] 로 전달
- 단점
	- N + 1 문제인 엔티티 안의 다른 엔티티가 있을 경우
	- 내부의 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 개수 만큼 조회 쿼리 발생
#### fetch join 을 이용한 최적화
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPQL|JPQL]]을 이용한 fetch join 사용
- 장점
	- 쿼리를 한번에 처리 가능
```java
public List<Order> findAllWithMemberDelivery() {
	List<Order> resultList = em.createQuery("select o from Order o" +
			" join fetch o.member m" +
			" join fetch o.delivery d", Order.class)
		.getResultList();
	return resultList;
}
```
#### 직접적으로 선택한 데이터만 뽑아내기(`QueryDto` 사용 방법)
- 장점이 별거 없기 때문에 fetch join 중에서 효율적인 상황을 쓰면 됨
- 장점
	- 쿼리의 길이가 짧아져서 네트워크를 덜 씀(이게 끝인가)
- 단점
	- 재활용성이 부족
	- 사용의 흐름이 섞여서 문제
```java
public List<ResOrderDto> findOrderDtos() {
	List<ResOrderDto> resultList = em.createQuery(
			"select new jpabook.jpashop.api.ResOrderDto(o.id, m.name, o.orderDate, o.status, d.address)" +
				" from Order o" +
				" join o.member m" +
				" join o.delivery d", ResOrderDto.class)
		.getResultList();
	return resultList;
}
```
### [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@OneToMany|@OneToMany]]  컬렉션 조회 최적화
- 데이터 뻥튀기 문제 발생으로 중복 데이터 발생 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPQL|JPQL]] 에 설명 내용 있음
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@BatchSize|@BatchSize]] 사용 추천
- 인덱스를 먼저 다 뽑아서 한번에 검색 쿼리를 전달하는 방법 추천
### OSIV
- Open Session In View : [[하이버네이트]] 
- Open EntityManager In View : [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPA|JPA]] 
	- 관례상 OSIV라 함
- `WARN 41826 --- JpaBaseConfiguration$JpaWebConfiguration : spring.jpa.open-in-view is enabled by default. Therefore, database queries may be performed during view rendering. Explicitly configure spring.jpa.open-in-view to disable this warning`
	- `spring.jpa.open-in-view: true`
![[config/AttachedFile/Pasted image 20250221163721.png|600]]
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Service|@Service]] 에서 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Transactional|@Transactional]] 부터 DB 커넥션은 생성 되고 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Controller|@Controller]] 이후에는 혹시 로딩을 할 수 있기 때문에 DB 커넥션을 게속 들고 있음
	- 즉, 거의 하나의 세션이 끝날때까지 들고 있다고 생각하면 편함
- `spring.jpa.open-in-view: true`
	- 장점 : 컨트롤 부분에서는 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/DTO (Data Transfer Object)|DTO]]  등 데이터 정리에 용이
	- 단점 : 너무 오랜 DB 커넥션 리소스를 가지고 있기 때문에 실시간 트래픽이 중요한 애플리케이션에서는 커넥션이 모자랄 수 있기에 장애 발생 위험
- `spring.jpa.open-in-view: false`
	- 장점 : 커넥션 리소스를 낭비하지 않음
	- 단점 : 모든 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/FetchType|지연 로딩]] 처리를 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Transactional|@Transactional]] 안에서 모두 처리 필요
	- 단점 : [[2.Ref(데이터 및 정보 저장)/Spring/View Template/View Template|뷰 템플릿]]에서 지연로딩이 동작하지 않음 
	- 해결 방법
		- 커맨드와 쿼리 기능을 분리 하는 방법
			- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/FetchType|지연 로딩]] 을 처리하는 특수한 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Service|@Service]] 를 만드는 방법
			- 커맨드(Service), 쿼리 기능(QueryService)
				- 은근 유지보수에 유용 (생각해보면 꽤나 유용은 개뿔 readOnly 로 되어 있어서 쓸만한곳은 진짜 검색 뿐임)
### 자기 자신에 트리형태 참조 예제
```java
@Entity
public class Category {
  @Id @GeneratedValue
  @Column(name = "CATEGORY_ID")
  private Long id;

  private String name;
  @ManyToOne
  @JoinColumn(name = "PARENT_ID")
  private Category parent;

  @OneToMany(mappedBy = "parent")
  private List<Category> child = new ArrayList<>();

  @ManyToMany
  @JoinTable(name = "CATEGORY_ITEM",
    joinColumns = @JoinColumn(name = "CATEGORY_ID"),
    inverseJoinColumns = @JoinColumn(name = "ITEM_ID")
  )
  private List<Item> items = new ArrayList<>();
}
```
### 상속관계 매핑
- 객체의 상속관계와 유사한 관계형 DB 에서 슈퍼타입 서브타입 관계라는 모델링 기법이 객체 상속과 유사
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/InheritanceType]] 이용하여 상속 사용
### JPA 테스트 하기 위한 기본 구조
```java
public class JpaMain {

    public static void main(String[] args) {

        EntityManagerFactory emf = Persistence.createEntityManagerFactory("hello");
        EntityManager em = emf.createEntityManager();
        EntityTransaction transaction = em.getTransaction(); // JPA의 모든 데이터 변경은 트랜잭션 안에서 실행
        try {
            transaction.begin();
            //code
            // 이렇게 작성
            //Member member = new Member();
            //member.setName("member1");
            //member.setCreatedBy("kim");
            //em.persist(member);
            
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
### 이뭐
```java title:"JPA 이용한 사용방법"
@Slf4j
@Repository
@Transactional
@RequiredArgsConstructor
public class JpaItemRepository implements ItemRepository {

  private final EntityManager em;

  @Override
  public Item save(Item item) {
    em.persist(item);
    return item;
  }

  @Override
  public void update(Long itemId, ItemUpdateDto updateParam) {
    Item item = em.find(Item.class, itemId);
    item.setItemName(updateParam.getItemName());
    item.setPrice(updateParam.getPrice());
    item.setQuantity(updateParam.getQuantity());
  }

  @Override
  public Optional<Item> findById(Long id) {
    Item item = em.find(Item.class, id);
    return Optional.ofNullable(item);
  }

  @Override
  public List<Item> findAll(ItemSearchCond cond) {
    String jpql = "select i from Item i";

    Integer maxPrice = cond.getMaxPrice();
    String itemName = cond.getItemName();

    if( StringUtils.hasText(itemName) || maxPrice != null ) {
      jpql += " where";
    }

    boolean andFlag = false;
    List<Object> param = new ArrayList<>();
    if (StringUtils.hasText(itemName)) {
      jpql += " i.itemName like concat('%', :itemName, '%')";
      param.add(itemName);
      andFlag = true;
    }

    if (maxPrice != null) {
      if (andFlag) {
        jpql += " and";
      }
      jpql += " i.price <= :maxPrice";
      param.add(maxPrice);
    }

    log.info("jpql = {}", jpql);

    TypedQuery<Item> query = em.createQuery(jpql, Item.class);
    if( StringUtils.hasText(itemName) ) {
      query.setParameter("itemName", itemName);
    }
    if( maxPrice != null ) {
      query.setParameter("maxPrice", maxPrice);
    }

    return query.getResultList();

//    List<Item> result = em.createQuery(jpql, Item.class)
//            .getResultList();
//    return result;
  }
}

```




