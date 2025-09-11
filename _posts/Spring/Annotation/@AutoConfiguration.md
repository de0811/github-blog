---
aliases:
  - "@AutoConfiguration"
tags:
  - Spring
  - Annotation
  - Spring/Configration
특징: 라이브러리를 만들어서 제공할때 사용
---
# @AutoConfiguration
- 라이브러리로 등록될 때 해당 jar 파일이 알아서 동작할 환경 구성 설정
- 특정 클래스보다 먼저 적용되거나 이후에 적용되도록 설정
- before/beforeName : 인자로 들어오는 클래스/이름보다 먼저 적용
- after/afterName : 인자로 들어오는 클래스/이름 보다 뒤에 적용
```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Configuration(
  proxyBeanMethods = false
)
@AutoConfigureBefore
@AutoConfigureAfter
public @interface AutoConfiguration {
  @AliasFor(
    annotation = Configuration.class
  )
  String value() default "";

  @AliasFor(
    annotation = AutoConfigureBefore.class,
    attribute = "value"
  )
  Class<?>[] before() default {};

  @AliasFor(
    annotation = AutoConfigureBefore.class,
    attribute = "name"
  )
  String[] beforeName() default {};

  @AliasFor(
    annotation = AutoConfigureAfter.class,
    attribute = "value"
  )
  Class<?>[] after() default {};

  @AliasFor(
    annotation = AutoConfigureAfter.class,
    attribute = "name"
  )
  String[] afterName() default {};
}
```

## 사용 방법
- 어디서든 적용될 코드 작성
```java
@AutoConfiguration
@ConditionalOnProperty(name = "memory", havingValue = "true")
public class MemoryAutoConfig {
  @Bean
  public MemoryFinder memoryFinder() {
    return new MemoryFinder();
  }
  @Bean
  public MemoryController memoryController() {
    return new MemoryController(memoryFinder());
  }
}
```
- Spring 에 등록
- `src/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` 파일을 생성 후 등록하려는 Config의 패키지 작성
```imports title:"src/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports"
memory.MemoryAutoConfig
```
- 사용하려는 프로젝트에서 [[2.Ref(데이터 및 정보 저장)/Spring/외부 라이브러리 포함하기|외부 라이브러리 포함하기]]
- jar를 lib로 사용하는 곳에서는 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Conditional|@Conditional]] 조건에 맞게 사용하면 완료
## 기능 설명
- `@AutoConfiguration` 기능을 이용해 등록
- jar를 lib로 사용하는 다른 프로젝트에서 [[@SpringBootApplication]] 내부에서 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@EnableAutoConfiguration]] [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|애노테이션]] 통해서 [[2.Ref(데이터 및 정보 저장)/Spring/Configuration/ImportSelector|AutoConfigurationImportSelector]] 클래스를 호출하여 자동 등록