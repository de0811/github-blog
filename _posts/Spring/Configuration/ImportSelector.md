---
aliases:
  - ImportSelector
  - AutoConfigurationImportSelector
tags:
  - Spring
  - Spring/Configration
특징: "@Import 조건 설정"
---
# ImportSelector
- 반환되는 패키지의 이름이 동일하다면 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Import|@Import]] 적용 가능
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Import|@Import]] [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|애노테이션]]과 함께 사용
## 사용방법
- `ImportSelector`코드를 정의
```java title:"특정 패키지의 파일 선택 방법"
public class HelloImportSelector implements ImportSelector {  
  @Override  
  public String[] selectImports(AnnotationMetadata importingClassMetadata) {  
    return new String[] {"hello.selector.HelloConfig"};  
  }}
```
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Import|@Import]] 사용하여 조건 값으로 지정
 ```java
   @Configuration
  @Import(HelloImportSelector.class)
  public static class SelectorConfig {}

  @Test
  void dynamicConfig() {
    AnnotationConfigApplicationContext appContext = new AnnotationConfigApplicationContext(SelectorConfig.class);
    HelloBean helloBean = appContext.getBean(HelloBean.class);

    Assertions.assertNotNull(helloBean);
  }
```

## 구현체
### AutoConfigurationImportSelector
- `src/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` 파일 안에 선언된 패키지 모두 @Bean 으로 등록