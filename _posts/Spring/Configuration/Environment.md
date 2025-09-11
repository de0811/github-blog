---
aliases:
  - 외부 설정
  - Environment
tags:
  - Spring
  - Spring/Configration
특징: 모든 외부 설정을 한번에 처리
---
# Environment
- Spring 외부 설정을 모두 추상화한 클래스
- 모든 [[2.Ref(데이터 및 정보 저장)/Spring/Configuration/PropertySource|PropertySource]] 를 사용하여 통합 관리 시스템
- 모든 외부 설정을 한번에 처리
## 우선순위
- 유연한 것이 우선권을 가짐(변경하기 어려운 파일보다는 실행시 원하는 값을 줄 수 있는 자바 시스템 속성이 더 우선권)
- 범위가 넓은 것 보다 좁은 것이 우선권
- 읽는 순서는 낮은 우선순위부터 먼저 읽어서 덮어쓰기 진행
1. [[@TestPropertySource]](테스트에 사용)
2. args(커맨드 라인)
3. 자바 시스템 속성
4. OS 환경 변수
5. 외부 파일([[2.Ref(데이터 및 정보 저장)/Spring/Configuration/application.properties]])
## 통합 전 외부 설정의 4가지
### OS 환경 변수
- 해당 OS 사용하는 모든 프로세스에서 사용
- OS에서 지원하는 외부 설정
- `printenv` 명령으로 확인
```java title:"OS 환경 변수 조회"
@Slf4j
public class OsEnv {
  public static void main(String[] args) {
    Map<String, String> envs = System.getenv();
    for (String key : envs.keySet()) {
      log.info("{} = {}", key, envs.get(key));
    }
  }
}
```
### 자바 시스템 속성
- 자바에서 지원하는 외부 설정
- 해당 JVM 안에서 사용
```sh title:"url 값 입력 예제"
java -Durl=dev -jar app.jar
```
```java title:"Java 시스템 속성 추가 및 조회 방법"
@Slf4j
public class JavaSystemProperties {
    public static void main(String[] args) {
      System.setProperty("myProperty", "myValue");
      Properties properties = System.getProperties();
      for (String key : properties.stringPropertyNames()) {
        log.info(key + " : " + properties.getProperty(key));
      }
    }
}
```
> 코드 안에서 사용하기 때문에 외부로 설정을 분리하는 효과는 없음
### 자바 커맨드 라인 인수
- 커맨드 라인에서 전달하는 외부 설정
- 실행시 `main(args)` 메서드에서 사용
- key value 형식으로 자체적으로 잘라서 사용해야하는 불편함
`{java icon title:"커맨드 인수 설정"} java -jar project.jar dataA dataB`
```java title:"커맨드 인수 조회"
@Slf4j
public class CommandLineV1 {
    public static void main(String[] args) {
      for( String arg : args ) {
        log.info(arg);
      }
    }
}
```
- key value 형식으로 나누기 위해 커맨드 라인 옵션 인수 라는 것을 스프링에서 제공
#### ApplicationArguments(커맨드 라인 옵션 인수)
- `--` 2개의 dash를 연결하면 `key=value` 형식이라고 정함
- `--username=userA --url=http://aaaa.com`
```java title:"이런식으로 사용"
@Slf4j
@Slf4j
public class CommandLineV2 {
    public static void main(String[] args) {
      // java -jar target/hello-spring-boot-0.0.1-SNAPSHOT.jar --url=dev-db --url=dev-go --username=dev_user --password=dev_pw mode=on
      ApplicationArguments AppArgs = new DefaultApplicationArguments(args);
      log.info("SourceArgs: " + List.of(AppArgs.getSourceArgs())); // 원래 args
      log.info("NonOptionArgs: " + List.of(AppArgs.getNonOptionArgs())); // 옵션 아닌 것들(옵션은 --로 시작)
      log.info("OptionNames: " + AppArgs.getOptionNames()); // 옵션 이름들

      Set<String> optionNames = AppArgs.getOptionNames();
      for (String optionName : optionNames) { // 이름에 맞는 값들
        log.info("OptionValues(" + optionName + "): " + AppArgs.getOptionValues(optionName));
      }
    }
}
```
- 내부에서 커맨드 라인 인수를 받는 방법
```java title:"어디서든 받을 수 있음"
@Slf4j
@Component
@RequiredArgsConstructor
public class CommandLineBean {
  private final ApplicationArguments appArgs;

  @PostConstruct
  public void init() {
    log.info("Source {}", List.of(appArgs.getSourceArgs()));
    log.info("NonOptionArgs: {}", appArgs.getNonOptionArgs());
    log.info("OptionNames: {}", appArgs.getOptionNames());
    appArgs.getOptionNames().forEach(optionName -> log.info("OptionValues({}): {}", optionName, appArgs.getOptionValues(optionName)));
  }
}

```
### 외부 파일(설정 데이터)
- 프로그램 외부 파일을 직접 읽어 사용
[[2.Ref(데이터 및 정보 저장)/Spring/Configuration/application.properties|application.properties]]