---
aliases:
  - Condition
tags:
  - Spring
  - Spring/Configration
특징: 
---
# Condition
- `matches()` 메서드가 `true` 반환하면 동작, `false` 반환하면 동작하지 않음
- `ConditionContext` 스프링 컨테이너, 환경정보 등을 보관
- `AnnotatedTypeMetadata` [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|애노테이션(annotation)]] 메타 정보 보관
```java
@FunctionalInterface  
public interface Condition {  
  boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata);  
}
```

## 사용 방법
- 동작을 할지 말지에 대한 조건을 설정 ([[2.Ref(데이터 및 정보 저장)/Spring/Configuration/Environment|외부 설정]] 통해서 확인)
```java title:"조건 설정"
@Slf4j
public class MemoryCondition implements Condition {
  @Override
  public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
    // java -jar target/xsp-console-0.0.1-SNAPSHOT.jar --memory=true
    // java -jar target/xsp-console-0.0.1-SNAPSHOT.jar -Dmemory=true
    Boolean bMemory = context.getEnvironment().getProperty("memory", Boolean.class, false);
    log.info("MemoryCondition: {}", bMemory);
    return bMemory;
  }
}
```
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Conditional]] 통해서 해당 클래스를 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Configuration|@Configuration]] 사용할지 설정
```java title:"조건 발동"
@Configuration
@Conditional(MemoryCondition.class)
public class MemoryConfig {
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

