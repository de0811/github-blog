---
aliases:
  - "@ConditionalOnProperty"
tags:
  - Spring
  - Spring/Configration
특징: 
---
# @ConditionalOnProperty
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Conditional|@Conditional]] 기능과 동일하며 [[2.Ref(데이터 및 정보 저장)/Spring/1.Spring MVC|Spring MVC]] 자체에서 정의된 [[2.Ref(데이터 및 정보 저장)/Spring/Configuration/Condition|Condition]] 사용
- [[2.Ref(데이터 및 정보 저장)/Spring/Properties|Properties]]  가 정의되어 있는지를 조건으로 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Component|@Component]] / [[@Bean]] 등록
- [[2.Ref(데이터 및 정보 저장)/Spring/Configuration/Condition|Condition]] 을 상속 받은 [[OnPropertyCondition]] 클래스를 사용하는 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|어노테이션]] 
- `name`: 외부의 정의된 이름
- `havingValue` : 만족하는 값
```java
@Configuration  
@ConditionalOnProperty(name = "memory", havingValue = "true")  
public class MemoryConfig {  
  @Bean  
  public MemoryFinder memoryFinder() {  
    return new MemoryFinder();  
  }  @Bean  
  public MemoryController memoryController() {  
    return new MemoryController(memoryFinder());  
  }}
```