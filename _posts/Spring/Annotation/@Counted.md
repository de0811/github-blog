---
aliases:
  - "@Counted"
tags:
  - Spring
  - Spring/모니터링
  - Spring/공통관심사
특징: 메트릭에 카운터 정보 등록
---
# @Counted
- [[2.Ref(데이터 및 정보 저장)/개발 이론/Metric|Metric(지표)]] 에 카운터 정보 등록
- [[2.Ref(데이터 및 정보 저장)/Spring/모니터링/MeterRegistry|MeterRegistry]]에 비해서 비즈니스 로직에 관여하지 않고 사용
- [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AOP|AOP]] 사용하여 [[2.Ref(데이터 및 정보 저장)/Spring/모니터링/MeterRegistry|MeterRegistry]]  를 공통관심사로 처리하는 방법
```java
@Inherited
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface Counted {
  String value() default "method.counted";

  boolean recordFailuresOnly() default false;

  String[] extraTags() default {};

  String description() default "";
}
```
> value : [[2.Ref(데이터 및 정보 저장)/개발 이론/Metric|Metric(지표)]] 에 사용할 이름 
> 자동으로 선언하는 함수의 이름을 `method` `tag` 로 등록
## 사용 방법
- 사용할 곳에 @Counted [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|애노테이션]]을 사용하여 [[2.Ref(데이터 및 정보 저장)/개발 이론/Metric|Metric(지표)]] 으로 등록
```java title:"필요한 곳에서 사용" hl:7,15
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceV2 implements OrderService {
  private AtomicInteger stock = new AtomicInteger(100);

  @Counted(value = "my.order", description = "order")
  @Override
  public void order() {
    log.info("OrderServiceV2.order");
    log.info("주문");
    stock.decrementAndGet();
  }

  @Counted(value = "my.order", description = "order")
  @Override
  public void cancel() {
    log.info("OrderServiceV2.cancel");
    log.info("주문 취소");
    stock.incrementAndGet();
  }

  @Override
  public AtomicInteger getStock() {
    return stock;
  }
}
```
> [[2.Ref(데이터 및 정보 저장)/개발 이론/Metric|Metric(지표)]] 이름으로 `my.order` 등록
> `method` 라는 이름의 `tag` 로 `order` 와 `cancel` 등록
- Counted  [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AOP|AOP]] 로 등록
```java title:"사용하기 위한 필수 등록" hl:3-6
@Configuration
public class OrderConfigV2 {
  @Bean
  public CountedAspect countedAspect(MeterRegistry meterRegistry) {
    return new CountedAspect(meterRegistry);
  }

  @Bean
  OrderService orderServiceV2() {
    return new OrderServiceV2();
  }
}
```