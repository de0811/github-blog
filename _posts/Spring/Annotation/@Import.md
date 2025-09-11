---
aliases:
  - "@Import"
tags:
  - Spring
  - Annotation
  - Spring/Configration
특징: 클래스를 `Bean`으로 등록
---
# @Import
- 특정 클래스를 `Bean`으로 등록하는 기능
- 설정 정보를 추가하는 방법 2가지
	- 정적 방법 : `@Import(클래스)` 
		- 코드에 대상이 박혀있는 방법
		- 설정으로 사용할 대상을 동적으로 변경할 수 없음
	- 동적 방법 : `@Import(ImportSelector)`
		- [[2.Ref(데이터 및 정보 저장)/Spring/Configuration/ImportSelector|ImportSelector]] 사용하여 코드로 사용할 대상을 동적으로 선택 가능
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Configuration|@Configuration]] 하더라도 스캔 범위를 제한 했을 경우 @import 를 이용해서 config를 등록 할 수 있음
## 사용 방법
`{java icon title:"여러개 하는 방법"}@Import({JdbcTemplateV1Config.class, LogAspect.class})`

```java title:"Config"
@Configuration  
@RequiredArgsConstructor  
public class JdbcTemplateV1Config {  
  private final DataSource dataSource;  
  
  @Bean  
  public ItemRepository itemRepository() {  
    return new JdbcTemplateItemRepositoryV1(dataSource);  
  }  
  
  @Bean  
  public ItemService itemService() {  
    return new ItemServiceV1(itemRepository());  
  }  
}
```

```java title:"스캔 범위가 아닌 config 파일을 등록하는 방법" hl:1
@Import(JdbcTemplateV1Config.class)  
@SpringBootApplication(scanBasePackages = "hello.itemservice.web")  
public class ItemServiceApplication {  
  
  public static void main(String[] args) {  
   SpringApplication.run(ItemServiceApplication.class, args);  
  }  
  
  @Bean  
  @Profile("local")  
  public TestDataInit testDataInit(ItemRepository itemRepository) {  
   return new TestDataInit(itemRepository);  
  }  
  
}
```