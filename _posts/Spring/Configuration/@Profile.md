---
aliases:
  - "@Profile"
tags:
  - Annotation
  - Spring
  - Spring/Configration
특징: profile 별 설정
---
# @Profile
특정 프로필의 경우에만 해당 스프링 [[@Bean]]을 등록
그렇기에 [[@Bean]]과 함께 사용
[[2.Ref(데이터 및 정보 저장)/Spring/Configuration/Condition|Condition]]를 내부적으로 사용하여 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Conditional|@Conditional]] 계열

```java title:"초기 데이터 설정"
@Slf4j  
@RequiredArgsConstructor  
public class TestDataInit {  
  
    private final ItemRepository itemRepository;  
  
    /**  
     * 확인용 초기 데이터 추가  
     */  
    @EventListener(ApplicationReadyEvent.class)  
    public void initData() {  
        log.info("test data init");  
        itemRepository.save(new Item("itemA", 10000, 10));  
        itemRepository.save(new Item("itemB", 20000, 20));  
    }  
  
}
```

```java title:"local 이라는 프로필 사용되는 경우에만 스프링 빈 등록"
@Bean  
@Profile("local")  
public TestDataInit testDataInit(ItemRepository itemRepository) {  
  return new TestDataInit(itemRepository);  
}
```

```properties title:"profile 등록 방법"
spring.profiles.active=local
```

`profile` 을 지정하지 않는다면 기본적으로 `default` 지정


