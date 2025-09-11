---
aliases:
  - MeterRegistry
tags:
  - Spring
  - Spring/모니터링
특징: 마이크로미터 기능을 제공하는 핵심 컴포넌트
---
# MeterRegistry
- [[2.Ref(데이터 및 정보 저장)/Spring/모니터링/마이크로미터|마이크로미터]] 기능을 제공하는 핵심 컴포넌트
- 스프링을 통해서 주입 받아서 사용하고 `MeterRegistry` 통해 카운터, 게이지 등을 등록
- 단점으로 해당 방법은 직접적으로 비즈니스 로직에 참여되어야하기 때문에 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Counted|@Counted]] 또는 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Timed]] 어노테이션 등을 사용하여 로직에 관여 없이 사용하는 것을 추천
## 사용 방법
```java
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceV1 implements OrderService {
  private final MeterRegistry meterRegistry;
  private AtomicInteger stock = new AtomicInteger(100);

  @Override
  public void order() {
    log.info("OrderServiceV1.order");
    log.info("주문");
    stock.decrementAndGet();

    Counter.builder("my.order")
      .tags("class", this.getClass().getName())
      .tags("method", "order")
      .description("order")
      .register(meterRegistry)
      .increment();
  }

  @Override
  public void cancel() {
    log.info("OrderServiceV1.cancel");
    log.info("주문 취소");
    stock.incrementAndGet();

    Counter.builder("my.order")
      .tags("class", this.getClass().getName())
      .tags("method", "cancel")
      .description("order")
      .register(meterRegistry)
      .increment();
  }

  @Override
  public AtomicInteger getStock() {
    return stock;
  }
}
```
> `my.order` 이라는 이름으로 등록
> `order` 함수와 cancel` `함수에서는 `method` `tag` 넣어서 구분용으로 사용
- http://localhost:8080/actuator/metrics 통해서 등록 현황 확인 가능
- 등록 했을때 최초 한번은 사용 했어야만 조회 가능