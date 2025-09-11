---
aliases:
  - "@ConfigurationProperties"
tags:
  - Spring
  - Annotation
  - Spring/Configration
특징: 
---
# @ConfigurationProperties
- 타입 안전한 설정 속성
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@EnableConfigurationProperties]] 또는 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ConfigurationPropertiesScan]] 통해서 [[@Bean]]으로 등록
- 기본 값이 필요할 경우 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@DefaultValue]] 어노테이션을 사용
- spring 3.x 이전 버전의 경우 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ConstructorBinding|@ConstructorBinding]] [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|어노테이션]] 을 기본 사용해야함
- spring 3.x 이후 버전의 경우 생성자가 여러개일 경우만 사용할 생성자에 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ConstructorBinding|@ConstructorBinding]] 사용
- [[2.Ref(데이터 및 정보 저장)/Spring/Validator/Validator|Validator]] 사용한 검증 방법 사용 가능
## 사용방법
### 생성자 사용하여 기본값 설정
```java title:"@DefaultValue 사용하여 기본값 까지 설정"
@Getter
@ConfigurationProperties("my.datasource")
public class MyDataSourcePropertiesV2 {
  private final String url;
  private final String username;
  private final String password;
  private final Etc etc;

  @Getter
  public static class Etc {
    private final Integer maxConnection;
    private final Duration timeout;
    private final List<String> options;

    public Etc(Integer maxConnection, Duration timeout, @DefaultValue("111.111, 222.222, 333.333") List<String> options) {
      this.maxConnection = maxConnection;
      this.timeout = timeout;
      this.options = options;
    }
  }

  // Etc 의 @DefaultValue 를 사용하면 초기값을 알아서 설정하고 지정된 Default 값이 없으면 null 로 설정한다.
  public MyDataSourcePropertiesV2(String url, String username, String password, @DefaultValue Etc etc) {
    this.url = url;
    this.username = username;
    this.password = password;
    this.etc = etc;
  }
}
```
### [[2.Ref(데이터 및 정보 저장)/Spring/Validator/Validator|검증기]] 사용 방법
```java
@Getter
@ConfigurationProperties("my.datasource")
@Validated
public class MyDataSourcePropertiesV3 {
  @NotEmpty
  private final String url;
  @NotEmpty
  private final String username;
  @NotEmpty
  private final String password;
  private final Etc etc;

  @Getter
  public static class Etc {
    @Min(1)
    @Max(9999)
    private final Integer maxConnection;
    @DurationMin(seconds = 1)
    @DurationMax(minutes = 1)
    private final Duration timeout;
    private final List<String> options;

    public Etc(Integer maxConnection, Duration timeout, @DefaultValue("111.111, 222.222, 333.333") List<String> options) {
      this.maxConnection = maxConnection;
      this.timeout = timeout;
      this.options = options;
    }
  }

  // Etc 의 @DefaultValue 를 사용하면 초기값을 알아서 설정하고 지정된 Default 값이 없으면 null 로 설정한다.
  public MyDataSourcePropertiesV3(String url, String username, String password, Etc etc) {
    this.url = url;
    this.username = username;
    this.password = password;
    this.etc = etc;
  }
}
```
### [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@EnableConfigurationProperties]] 사용 방법
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
### [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ConfigurationPropertiesScan]] 사용 방법
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

```java title:"설정 클래스를 Bean으로 자동 등록" hl:2
@Import(MyDataSourceConfigV1.class)
@ConfigurationPropertiesScan({"hello.datasource"})
@SpringBootApplication(scanBasePackages = "hello.datasource")
public class ExternalReadApplication {
    public static void main(String[] args) {
        SpringApplication.run(ExternalReadApplication.class, args);
    }
}
```

```java title:"설정 클래스를 이용해 사용"
@Slf4j
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