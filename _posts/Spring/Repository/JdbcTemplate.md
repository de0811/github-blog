---
aliases:
  - JdbcTemplate
tags:
  - Spring
  - spring/Repository
특징: 
---
# JdbcTemplate
JDBC 개발할 때 발생하는 소스 반복을 대부분 해결
트랜잭션을 위한 커넥션 동기화도 자동
스프링 예외 변환기도 자동
[공식 홈페이지 설명](https://docs.spring.io/spring-framework/reference/data-access/jdbc/core.html#jdbc-JdbcTemplate)
기타 사용 방법은 공식 홈페이지를 참조

## 기능 정리
- `JdbcTemplate`
	- 순서 기반 파라미터 바인딩 지원
- `NamedParameterJdbcTemplate`
	- 이름 기반 파라미터 바인딩 지원
- `SimpleJdbcInsert`
	- `INSERT` SQL을 편리하게 사용할 수 있도록 지원
- `SimpleJdbcCall`
	- 스토어드 프로시저를 편리하게 호출할 수 있도록 지원

## 장점 (아무것도 사용하지 않을 때와 비교)
- 중복 소스 제거
- 공통 Exception 사용
- 트랜잭션을 위한 커낵션 자동 지원
## 단점
- 동적 SQL 만들기 힘듬
- 자바 코드로 작성하기 때문에 너무 길어지면 + 를 이용해서 합쳐줘야 하는 불편함
	해당 단점을 해결하기 위한 JOOQ 라는 것도 있지만 사용하는 사람이 많지 않음으로 패스

## JdbcTemplate 순서 기반 바인딩
```java title:"JdbcTemplate 이용하여 극단적으로 짧아진 소스 구경"
@Slf4j  
public class MemberRepositoryV5 implements MemberRepository {  
  private final JdbcTemplate jdbcTemplate;  
  
  public MemberRepositoryV5(DataSource dataSource) {  
    this.jdbcTemplate = new JdbcTemplate(dataSource);  
  }  
  
  @Override  
  public Member save(Member member) {  
    log.info("save={}", member);  
    String sql = "insert into member(member_id, money) values(?, ?)";  
    jdbcTemplate.update(sql, member.getMemberId(), member.getMoney());  
    return member;  
  }  
  
  @Override  
  public Member findById(String memberId) {  
    String sql = "select * from member where member_id = ?";  
  
    Member member = jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {  
      return new Member(rs.getString("member_id"), rs.getInt("money"));  
    }, memberId);  
  
    return member;    
  }  
  
  @Override  
  public void update(String memberId, int money) {  
    String sql = "update member set money = ? where member_id = ?";  
  
    jdbcTemplate.update(sql, money, memberId);  
  }  
  
  @Override  
  public void delete(String memberId) {  
    String sql = "delete from member where member_id = ?";  
  
    jdbcTemplate.update(sql, memberId);  
  }  
  
  private void close(Connection connection, PreparedStatement preparedStatement, ResultSet rs) {  
    JdbcUtils.closeResultSet(rs);  
    JdbcUtils.closeStatement(preparedStatement);  
  }  
}
```

하지만 동적 쿼리일 경우에는 문제가 발생
```java title:"동적 쿼리시 문제" hl:62-79
@Slf4j
public class JdbcTemplateItemRepositoryV1 implements ItemRepository {
  private final JdbcTemplate jdbcTemplate;

  public JdbcTemplateItemRepositoryV1(DataSource dataSource) {
    jdbcTemplate = new JdbcTemplate(dataSource);
  }
  @Override
  public Item save(Item item) {
    String sql = "insert into item (item_name, price, quantity) values (?, ?, ?)";
    KeyHolder keyHolder = new GeneratedKeyHolder();
    jdbcTemplate.update(connection -> {
      PreparedStatement ps = connection.prepareStatement(sql, new String[] {"id"});
      ps.setString(1, item.getItemName());
      ps.setInt(2, item.getPrice());
      ps.setInt(3, item.getQuantity());
      return ps;
    }, keyHolder);
    Number key = keyHolder.getKey();
    item.setId(key.longValue());
    return item;
  }

  @Override
  public void update(Long itemId, ItemUpdateDto updateParam) {
    String sql = "update item set item_name = ?, price = ?, quantity = ? where id = ?";
    jdbcTemplate.update(sql, updateParam.getItemName(), updateParam.getPrice(), updateParam.getQuantity(), itemId);
  }

  @Override
  public Optional<Item> findById(Long id) {
    String sql = "select id, item_name, price, quantity from item where id = ?";
    try {
      Item result = jdbcTemplate.queryForObject(sql, itemRowMapper(), id);
      return Optional.ofNullable(result);
    } catch (EmptyResultDataAccessException e) {
      log.error("조회된 데이터가 없습니다.");
      return Optional.empty();
    } catch (IncorrectResultSizeDataAccessException e) {
      log.error("1개 이상의 결과가 조회되었습니다.");
      throw new IllegalStateException("1개 이상의 결과가 조회되었습니다.");
    }
  }

  private RowMapper<Item> itemRowMapper() {
    return (rs, rowNum) -> {
      Item item = new Item();
      item.setId(rs.getLong("id"));
      item.setItemName(rs.getString("item_name"));
      item.setPrice(rs.getInt("price"));
      item.setQuantity(rs.getInt("quantity"));
      return item;
    };
  }

  @Override
  public List<Item> findAll(ItemSearchCond cond) {
    String itemName = cond.getItemName();
    Integer maxPrice = cond.getMaxPrice();
    String sql = "select id, item_name, price, quantity from item";
    // 동적 검색 (itemName, maxPrice)
    if(StringUtils.hasText(itemName) || maxPrice != null) {
      sql += " where";
    }

    List<Object> param = new ArrayList<>();

    if(StringUtils.hasText(itemName)) {
      sql += " item_name like concat('%', ?, '%')";
      param.add(itemName);
    }

    if(maxPrice != null) {
      if(StringUtils.hasText(itemName)) {
        sql += " and";
      }
      sql += " price <= ?";
      param.add(maxPrice);
    }
    return jdbcTemplate.query(sql, itemRowMapper(), param.toArray());
  }
}
```
동적 쿼리 조건이 2개일 경우도 이렇게 복잡해 지는데 아주 다양하게 있을 경우에는 답이 없어짐
이런 문제점을 해결하기 위해서 `Mybatis`, [[2.Ref(데이터 및 정보 저장)/Spring/Repository/QueryDSL|QueryDSL]]  경우에 동적 쿼리를 좀 더 사용하기 쉽게 적용 가능

데이터 순서를 맞춰주어야 하기 때문에 소스 수정할 때 순서를 잘못 해서 버그 발생 확률이 높음
해당 문제를 해결하기 위해 `NamedParameterJdbcTemplate` 을 사용

## NamedParameterJdbcTemplate(파라메터를 순서가 아닌 이름으로 지정하는 방법)
```java title:"NamedParameterJdbcTemplate 이용한 ParameterName 사용 방법" hl:4,13,27-31,40,62,71-86
@Slf4j
public class JdbcTemplateItemRepositoryV2 implements ItemRepository {
//  private final JdbcTemplate jdbcTemplate;
  private final NamedParameterJdbcTemplate jdbcTemplate;

  public JdbcTemplateItemRepositoryV2(DataSource dataSource) {
    jdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
  }
  @Override
  public Item save(Item item) {
    String sql = "insert into item (item_name, price, quantity) values (:itemName, :price, :quantity)";
    KeyHolder keyHolder = new GeneratedKeyHolder();
    SqlParameterSource param = new BeanPropertySqlParameterSource(item);
    jdbcTemplate.update(sql, param, keyHolder);

    Number key = keyHolder.getKey();
    item.setId(key.longValue());
    return item;
  }

  @Override
  public void update(Long itemId, ItemUpdateDto updateParam) {
    String sql = "update item " +
      "set item_name = :itemName, price = :price, quantity = :quantity " +
      "where id = :id";
//    jdbcTemplate.update(sql, updateParam.getItemName(), updateParam.getPrice(), updateParam.getQuantity(), itemId);
    SqlParameterSource param = new MapSqlParameterSource()
      .addValue("itemName", updateParam.getItemName())
      .addValue("price", updateParam.getPrice())
      .addValue("quantity", updateParam.getQuantity())
      .addValue("id", itemId);

    jdbcTemplate.update(sql, param);
  }

  @Override
  public Optional<Item> findById(Long id) {
    String sql = "select id, item_name, price, quantity from item where id = :id";
    try {
      Map<String, Object> param = Map.of("id", id);
      Item result = jdbcTemplate.queryForObject(sql, param, itemRowMapper());
      return Optional.ofNullable(result);
    } catch (EmptyResultDataAccessException e) {
      log.error("조회된 데이터가 없습니다.");
      return Optional.empty();
    } catch (IncorrectResultSizeDataAccessException e) {
      log.error("1개 이상의 결과가 조회되었습니다.");
      throw new IllegalStateException("1개 이상의 결과가 조회되었습니다.");
    }
  }

  private RowMapper<Item> itemRowMapper() {
    // CamelCase 변환 (DB 필드명 -> Java 필드명)
    return BeanPropertyRowMapper.newInstance(Item.class);
  }

  @Override
  public List<Item> findAll(ItemSearchCond cond) {
    String itemName = cond.getItemName();
    Integer maxPrice = cond.getMaxPrice();
    String sql = "select id, item_name, price, quantity from item";
    // 동적 검색 (itemName, maxPrice)
    SqlParameterSource param = new BeanPropertySqlParameterSource(cond);

    if(StringUtils.hasText(itemName) || maxPrice != null) {
      sql += " where";
    }

    if(StringUtils.hasText(itemName)) {
      sql += " item_name like concat('%', :itemName, '%')";
    }

    if(maxPrice != null) {
      if(StringUtils.hasText(itemName)) {
        sql += " and";
      }
      sql += " price <= :maxPrice";
    }

    return jdbcTemplate.query(sql, param, itemRowMapper());
  }
}
```

### SqlParameterSource
- `BeanPropertySqlParameterSource` : 객체를 [[2.Ref(데이터 및 정보 저장)/개발 이론/Parameter|파라메터]] 로 넘길 때 사용
- `MapSqlParameterSource` : 객체가 [[2.Ref(데이터 및 정보 저장)/개발 이론/Parameter|파라메터]] 로써  데이터가 부족할 때 사용
- `Map.of()` 방식 : 대충 쓸때 사용
### 별칭
Java 객체는 보통 [[2.Ref(데이터 및 정보 저장)/개발 이론/camelCase|camelCase]] 표기법을 주로 사용하며 관계형 데이터베이스에서는 주로 [[2.Ref(데이터 및 정보 저장)/개발 이론/snake_case|snake_case]] 표기법을 주로 사용
`{sql}select item_name` 경우에 `setItem_name()` 이라는 메서드가 없기 때문에 조회 SQL에서 `{sql}select item_name as itemName` 이렇게 별칭으로 처리
하지만 자주 변경하는 부분이기 때문에 `BeanPropertyRowMapper` 를 사용해서 처리하면 [[2.Ref(데이터 및 정보 저장)/개발 이론/snake_case|snake_case]]  -> [[2.Ref(데이터 및 정보 저장)/개발 이론/camelCase|camelCase]] 자동 처리
## SimpleJdbcInsert (insert 할 때 GeneratedKeyHolder 쓰지 않고 key 값 가져오기)
```java title:"SimpleJdbcInsert 이용한 insert 쿼리 자동 만들어서 key 받기" hl:7-13,17
@Slf4j
public class JdbcTemplateItemRepositoryV3 implements ItemRepository {
//  private final JdbcTemplate jdbcTemplate;
  private final NamedParameterJdbcTemplate jdbcTemplate;
  private final SimpleJdbcInsert simpleJdbcInsert;

  public JdbcTemplateItemRepositoryV3(DataSource dataSource) {
    jdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
    simpleJdbcInsert = new SimpleJdbcInsert(dataSource)
      .withTableName("item") // 데이터를 저장할 테이블 명
      .usingGeneratedKeyColumns("id"); // key를 생성하는 PK 컬럼 명
//      .usingColumns("item_name", "price", "quantity"); // INSERT SQL 사용할 컬럼 지정(특정 값만 사용하고 싶을 때 사용)
  }
  @Override
  public Item save(Item item) {
    SqlParameterSource param = new BeanPropertySqlParameterSource(item);
    Number key = simpleJdbcInsert.executeAndReturnKey(param);

    item.setId(key.longValue());
    return item;
  }
}
```
