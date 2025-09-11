---
aliases:
  - "@EventListener"
tags:
  - Spring
  - Annotation
  - Annotation/생성자
특징: 
---
# @EventListener 
초기화 또는 실행시 한번 동작하도록 하기 위한 방법
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PostConstruct|@PostConstruct]] 사용해도 되지만 [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AOP|AOP]] 부분이 아직 다 처리되지 않은 상태에서 동작하여 문제가 발생할 수 있기 때문에 사용하지 않음
예를들어 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Transactional|@Transactional]] 관련 [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AOP|AOP]] 가 적용되지 않은 시점에 동작할 수 있음
그렇기에 `@EventListener(ApplicationReadyEvent.class)` 는 [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AOP|AOP]] 를 포함한 컨테이너가 완전히 초기화 된 이후에 호출되기 때문에 이런 문제가 발생하지 않음

```java title:"@EventListener 사용 방법" hl:10
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