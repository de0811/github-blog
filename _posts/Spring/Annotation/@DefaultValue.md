---
aliases:
  - "@DefaultValue"
tags:
  - Spring
  - Spring/Configration
  - Annotation
특징: "@ConfigurationProperties 사용시 properties 기본 값 설정"
---
# @DefaultValue
[[2.Ref(데이터 및 정보 저장)/Spring/Configuration/@ConfigurationProperties|@ConfigurationProperties]] 에서 사용하는 기본 값을 설정

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