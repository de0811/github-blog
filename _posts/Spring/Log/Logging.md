---
aliases:
  - Logging
tags:
  - Java
---

## 왜 필요로 하는가
기존에 사용하던 `System.out.println()` 함수를 사용할 수 없음
## 장점
- 로그 레벨별
- 시간
- 스레드 표기
- 레벨별 표시
- 파일로 남길 수 있음
- 성능이 좋음

## 인터페이스 종류
### [SLF4J](http://www.slf4j.org)

## 구현체
### [logback](https://www.slf4j.org/)


## 사용법
![[@Slf4j]]

### 터미널 창에 표시할 로그 레벨 설정 방법
> logging.level.[package path]
```properties
# 모든 패키지의 로그 표시 레벨은 error 이다
loggin.level.root = error
# kim.springmvc 패키지 의 로그 표시 레벨은 trace 이다
logging.level.kim.springmvc = trace
# nshc.build 패키지의 로그 표시 레벨은 debug 이다
logging.level.nshc.build = debug
```


> [!warning] 주의사항 
> `log.info(" info log={}" + name);` 이런 식으로 쓰기 보다는
> `log.info(" info log={}", name);` 이렇게 쓰는 것이 좋음
> [[Argument|인자]]로 넘겨줘야 연산을 미리 하지 않아서 레벨이 아닌것을 확인하고 동작시키지 않을 수 있음
