---
aliases:
  - HttpExchangeRepository
  - InMemoryHttpExchangeRepository
tags:
  - Spring
  - Spring/모니터링
특징: 
---
# HttpExchangeRepository
- [[2.Ref(데이터 및 정보 저장)/Spring/모니터링/Actuator(액츄에이터)|Actuator(액츄에이터)]] 의 `httpexchanges`를 사용하기 위한 기능
- 실제 운영 서비스에서는 모니터링 툴이나 핀포인트, Zipkin 같은 다른 기술을 사용하는 것을 추천
## 구현체
### InMemoryHttpExchangeRepository
- 총 100개씩만 정보를 기록
## 사용방법
- 기능 사용을 위해 일단 `HttpExchangeRepository` 등록하여 `httpexchanges` 기능 활성화
```java title:"bean 등록하면 기능 활성화"
    @Bean
    public InMemoryHttpExchangeRepository inMemoryHttpExchangeRepository() {
        return new InMemoryHttpExchangeRepository();
    }
```
- http://localhost:8080/actuator/httpexchanges 접속으로  통신에 대한 기록 확인 가능
