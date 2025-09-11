---
aliases:
  - "@EnableConfigurationProperties"
tags:
  - Spring
  - Spring/Configration
특징: 특정 properties 클래스를 @Bean으로 자동 등록
---
# @EnableConfigurationProperties
- 설정 클래스([[2.Ref(데이터 및 정보 저장)/Spring/Configuration/@ConfigurationProperties|@ConfigurationProperties]])를 [[@Bean]] 으로 자동 등록
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ConfigurationPropertiesScan]]과 다른 점은 `class`의 이름들로 등록
- 위치는 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Configuration|@Configuration]] 또는 [[@SpringBootApplication]] 어디든 상관 없음
## 사용 방법
```properties title:"properties 정의"
my.datasource.url=local.db.com  
my.datasource.username=local_user  
my.datasource.password=local_password  
my.datasource.etc.max-connection=1  
my.datasource.etc.timeout=3500ms  
my.datasource.etc.options=CACHE,ADMIN
```

```java title:"ConfigurationProperties 통해서 어떤 형식을 받아올지 미리 선언"
@Data
@ConfigurationProperties("my.datasource")
public class MyDataSourcePropertiesV1 {
  private String url;
  private String username;
  private String password;
  private Etc etc = new Etc();

  @Data
  public static class Etc {
    private Integer maxConnection;
    private Duration timeout;
    private List<String> options = new ArrayList<>();
  }
}
```

```java title:"@EnableConfigurationProperties 어노테이션을 통해 사용하기" hl:2
@Slf4j
@EnableConfigurationProperties(MyDataSourcePropertiesV1.class)
@Configuration
@RequiredArgsConstructor
public class MyDataSourceConfigV1 {
  private final MyDataSourcePropertiesV1 myDataSourcePropertiesV1;

  @Bean
  public MyDataSource myDataSource() {
    MyDataSourcePropertiesV1.Etc etc = myDataSourcePropertiesV1.getEtc();
    return new MyDataSource(
        myDataSourcePropertiesV1.getUrl(),
        myDataSourcePropertiesV1.getUsername(),
        myDataSourcePropertiesV1.getPassword(),
        etc.getMaxConnection(),
        etc.getTimeout(),
        etc.getOptions());
  }
}
```