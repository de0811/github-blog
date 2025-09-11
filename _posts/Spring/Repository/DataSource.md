---
aliases:
  - DataSource
tags:
  - Spring
  - spring/Repository
특징: 
---
# DataSource
`DriverManager` 등 커넥션을 받는 방법이 너무 다양해져서 만들어진 커넥션을 받는 공통 인터페이스
그런데 문제는 DriverManager 는 DataSource 개념이 나오기 전에 개발되어서 동일하게 사용되게 하기 위해서 Spring 에서는 DriverManagerDataSource 를 개발
공통적으로 DataSource 이용하여 커넥션을 받아올 수 있게 됨
```java title:"DriverManager"
void driverManager() throws SQLException {  
  Connection con1 = DriverManager.getConnection(ConnectionConst.URL, ConnectionConst.USERNAME, ConnectionConst.PASSWORD);  
  Connection con2 = DriverManager.getConnection(ConnectionConst.URL, ConnectionConst.USERNAME, ConnectionConst.PASSWORD);  
  
  log.info("con1={}, class={}", con1, con1.getClass());  
  log.info("con2={}, class={}", con2, con2.getClass());  
}
```


```java title:"DataSource 공통 사용의 변화"
@Slf4j  
public class ConnectionTest {  
  // 최초의 사용방법
  @Test  
  void driverManager() throws SQLException {  
    Connection con1 = DriverManager.getConnection(ConnectionConst.URL, ConnectionConst.USERNAME, ConnectionConst.PASSWORD);  
    Connection con2 = DriverManager.getConnection(ConnectionConst.URL, ConnectionConst.USERNAME, ConnectionConst.PASSWORD);  
  
    log.info("con1={}, class={}", con1, con1.getClass());  
    log.info("con2={}, class={}", con2, con2.getClass());  
  }  
  
  @Test  
  void driverManagerDataSource() throws SQLException {  
    DriverManagerDataSource dataSource = new DriverManagerDataSource(ConnectionConst.URL, ConnectionConst.USERNAME, ConnectionConst.PASSWORD);  
  
    useDataSource(dataSource);  
  }  
  
  @Test  
  void dataSourceConnectionPool() throws SQLException, InterruptedException {  
    HikariDataSource dataSource = new HikariDataSource();  
    dataSource.setJdbcUrl(ConnectionConst.URL);  
    dataSource.setUsername(ConnectionConst.USERNAME);  
    dataSource.setPassword(ConnectionConst.PASSWORD);  
    dataSource.setMaximumPoolSize(10);  
    dataSource.setPoolName("HiHiPool");  
  
    useDataSource(dataSource);  
  
    Thread.sleep(1000); // pool 모두 등록 될때까지 대기  
  }  
  
  void useDataSource(DataSource dataSource) throws SQLException {  
    Connection con1 = dataSource.getConnection();  
    Connection con2 = dataSource.getConnection();  
  
    log.info("con1={}, class={}", con1, con1.getClass());  
    log.info("con2={}, class={}", con2, con2.getClass());  
  }  
}
```
## properties 이용한 DataSource 설정 방법
```properties title:"DataSource 설정 방법"
spring.datasource.url=jdbc:h2:file:./test-db;AUTO_SERVER=TRUE  
spring.datasource.username=sa  
spring.datasource.password=
```

```java title:"테스트에 필요한 Bean 이제 DataSource 를 직접 만들어줄 필요 없음 properties를 통해서 만들기 때문에"
@RequiredArgsConstructor  
@TestConfiguration  
static class MemberServiceV3_3TestConfig {  
  @Bean  
  PlatformTransactionManager transactionManager(DataSource dataSource) {  
    return new DataSourceTransactionManager(dataSource);  
  }  
  @Bean  
  MemberRepositoryV3 memberRepositoryV3(DataSource dataSource) {  
    return new MemberRepositoryV3(dataSource);  
  }  
  @Bean  
  MemberServiceV3_3 memberServiceV3_3(MemberRepositoryV3 memberRepositoryV3) {  
    return new MemberServiceV3_3(memberRepositoryV3);  
  }  
}
```
