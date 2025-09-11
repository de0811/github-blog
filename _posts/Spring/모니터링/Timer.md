---
aliases:
  - Timer
tags:
  - Spring
  - Spring/모니터링
특징: 
---
# Timer
- 시간을 측정하는데 사용
- 기능 (프로메테우스로 해당 접두사가 붙음)
	- `seconds_count` : 누적 실행 수 - 카운터
	- `seconds_sum` : 실행 시간의 합 - sum
	- `seconds_max` : 최대 실행 시간(가장 오래걸린 실행 시간) - 게이지
		- 내부에 타임 윈도우라는 개념이 있어서 1~3분마다 최대 실행 시간이 다시 계산
- 비즈니스 로직에 피해가지 않는 방법으로 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Timed|@Timed]] 사용
## 사용 방법
- Timer 기능을 등록
```java
@Slf4j
@RequiredArgsConstructor
public class OrderServiceV3 implements OrderService {
  private final MeterRegistry meterRegistry;
  private AtomicInteger stock = new AtomicInteger(100);

  @Override
  public void order() {
    Timer.builder("my.order")
      .tags("class", this.getClass().getName())
      .tags("method", "order")
      .description("order")
      .register(meterRegistry)
      .record(() -> {
        log.info("order.Timer.record");
        log.info("주문");
        stock.decrementAndGet();
        sleep(1000);
      });
  }

  @Override
  public void cancel() {
    Timer.builder("my.order")
      .tags("class", this.getClass().getName())
      .tags("method", "cancel")
      .description("order")
      .register(meterRegistry)
      .record(() -> {
        log.info("cancel.Timer.record");
        log.info("주문 취소");
        stock.incrementAndGet();
        sleep(200);
      });
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
> record 안에 실제 비즈니스 로직을 등록