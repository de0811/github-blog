---
aliases:
  - "@Timed"
tags:
  - Spring
  - Spring/모니터링
  - Spring/공통관심사
특징: 시간을 측정하여 메트릭에 등록
---
# @Timed
- 시간을 측정하여 [[2.Ref(데이터 및 정보 저장)/개발 이론/Metric|Metric(지표)]] 에 등록
- - [[2.Ref(데이터 및 정보 저장)/Spring/모니터링/Timer|Timer]] 기능을 편리하게 사용
```java
@Target({ElementType.ANNOTATION_TYPE, ElementType.TYPE, ElementType.METHOD})
@Repeatable(TimedSet.class)
@Retention(RetentionPolicy.RUNTIME)
@Inherited
public @interface Timed {
  String value() default "";

  String[] extraTags() default {};

  boolean longTask() default false;

  double[] percentiles() default {};

  boolean histogram() default false;

  String description() default "";
}
```
## 사용 방법
- 사용할 곳에 `@Timed` [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|애노테이션]]을 사용하여 [[2.Ref(데이터 및 정보 저장)/개발 이론/Metric|Metric(지표)]] 으로 등록
```java title:"타이머 기능 등록" hl:2
@Slf4j
@Timed(value = "my.order", description = "order")
public class OrderServiceV4 implements OrderService {
  private AtomicInteger stock = new AtomicInteger(100);

  @Override
  public void order() {
    log.info("order.Timer.record");
    log.info("주문");
    stock.decrementAndGet();
    sleep(1000);
  }

  @Override
  public void cancel() {
    log.info("cancel.Timer.record");
    log.info("주문 취소");
    stock.incrementAndGet();
    sleep(200);
  }

  @Override
  public AtomicInteger getStock() {
    return stock;
  }

  private static void sleep(int millis) {
    try {
      Thread.sleep(millis + new Random().nextInt(200));
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    }
  }
}
```
- Timed  [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AOP|AOP]] 로 등록
```java hl:"Aspect 등록" hl:8-11
@Configuration
public class OrderConfigV4 {
  @Bean
  OrderService orderServiceV4() {
    return new OrderServiceV4();
  }

  @Bean
  public TimedAspect timedAspect(MeterRegistry meterRegistry) {
    return new TimedAspect(meterRegistry);
  }
}

```