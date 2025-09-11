---
aliases:
  - Gauge
  - 게이지
tags:
  - Spring
  - Spring/모니터링
특징: 임의로 오르내릴 수 있는 단일 숫자 값을 나타내는 메트릭
---
# Gauge
- 임의로 오르내릴 수 있는 단일 숫자 값을 나타내는 [[2.Ref(데이터 및 정보 저장)/개발 이론/Metric|Metric(지표)]]
- 값의 현재 상태를 보는데 사용
- 값이 증가 또는 감소
- ex) 차량의 속도, CPU 사용량, 메모리 사용량
## 사용 방법
```java title:"클래스를 생성하여 사용하는 방법"
@Slf4j
@Configuration
public class StockConfigV1 {

  @Bean
  MyStockMetric myStockMetric(OrderService orderService, MeterRegistry meterRegistry) {
    log.info("StockConfigV1.MyStockMetric.myStockMetric");
    return new MyStockMetric(orderService, meterRegistry);
  }

  @Slf4j
  @RequiredArgsConstructor
  static class MyStockMetric {
    private final OrderService orderService;
    private final MeterRegistry meterRegistry;


    @PostConstruct
    public void init() {
      Gauge.builder("my.stock", orderService, service -> {
        log.info("StockConfigV1.MyStockMetric.init");
        int stock = service.getStock().get();
        return stock;
      })
        .description("Stock level")
        .register(meterRegistry);
    }
  }
}
```
- [[MeterBinder]] 쓰는 방법이 가장 깔끔
```java title:"MeterBinder 타입으로 바로 반환 방법"
@Slf4j
@Configuration
public class StockConfigV2 {
  @Bean
  public MeterBinder stockSize(OrderService orderService) {
    return meterRegistry -> Gauge.builder("my.stock", orderService, service -> {
        log.info("StockConfigV2.stockSize");
        int stock = service.getStock().get();
        return stock;
      })
      .description("Stock level")
      .register(meterRegistry);
  }
}

```