---
aliases:
  - "@Value"
tags:
  - Annotation
  - Spring
  - Spring/Configration
특징: properties 의 정보를 java 로 가져오는 역활
---
# @Value
- YML 에 넣은 정보 읽기
- [[SpEL (Spring Expression Language)]] 사용

```java
@Slf4j
@Configuration
public class MyDataSourceValueConfig {
  @Value("${my.datasource.url}")
  private String url;
  @Value("${my.datasource.username}")
  private String username;
  @Value("${my.datasource.password}")
  private String password;
  @Value("${my.datasource.etc.max-connection}")
  private Integer maxConnection;
  @Value("${my.datasource.etc.timeout}")
  private Duration timeout;
  @Value("${my.datasource.etc.options}")
  private List<String> options;

  @Bean
  public MyDataSource myDataSource1() {
    return new MyDataSource(url, username, password, maxConnection, timeout, options);
  }

  @Bean
  public MyDataSource myDataSource2(
      @Value("${my.datasource.url}") String url,
      @Value("${my.datasource.username}") String username,
      @Value("${my.datasource.password}") String password,
      @Value("${my.datasource.etc.max-connection:2}") Integer maxConnection,
      @Value("${my.datasource.etc.timeout}") Duration timeout,
      @Value("${my.datasource.etc.options:a,b,c}") List<String> options) {
    return new MyDataSource(url, username, password, maxConnection, timeout, options);
  }
}
```
