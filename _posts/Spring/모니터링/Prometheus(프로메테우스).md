---
aliases:
  - 프로메테우스
  - Prometheus
  - 프로메테우스(Prometheus)
  - Prometheus(프로메테우스)
tags:
  - Spring
  - Spring/모니터링
특징: Metric(지표)을 수집하고 DB 저장
---
# 프로메테우스
- [[2.Ref(데이터 및 정보 저장)/개발 이론/Metric|Metric(지표)]] 수집하고 DB 저장

## 사용 방법
- [프로메테우스 다운로드](https://prometheus.io/download/)
- [[2.Ref(데이터 및 정보 저장)/Intellij/Gradle|Gradle]] 등록
```gradle
runtimeOnly 'io.micrometer:micrometer-registry-prometheus'
```
- prometheus 설정
```yml title:"prometheus.yml 설정 추가" hl:20-25
global:
  scrape_interval: 15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.

alerting:
  alertmanagers:
    - static_configs:
        - targets:

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: "prometheus"

    static_configs:
      - targets: ["localhost:9090"]

# 추가
  - job_name: "spring-actuator"
    metrics_path: '/actuator/prometheus'
    scrape_interval: 1s
    static_configs:
      - targets: ['localhost:8080']
```
> `job_name` : 임의의 이름 사용
> `metrics_path` : 수집할 경로 지정
> `scrape_interval` : 수집할 주기 설정 (보통 10s~1m을 많이 설정)
> `targets` : 수집할 서버의 IP, PORT 지정
- 프로메테우스 실행
- `./prometheus`

## 필터 설정 방법
- 검색 창에서 `http_server_requests_seconds_count{uri="/actuator/prometheus"}` 이렇게 보고 싶은 값들만 적용 할 수 있음
- `{}` 사용하여 필터 적용
- **레이블 일치 연산자**
	- = : 제공된 문자열과 정확히 동일한 레이블 선택
	- != : 제공된 문자열과 같지 않은 레이블 선택
	- =~ : 제공된 문자열과 정규식 일치하는 레이블 선택
	- !~ : 제공된 문자열과 정규식 일치하지 않는 레이블 선택
> [!seealso] 예제
`uri=/log` , `method=GET` 조건으로 필터
`http_server_requests_seconds_count{uri="/log", method="GET"}`
`/actuator/prometheus` 는 제외한 조건으로 필터
`http_server_requests_seconds_count{uri!="/actuator/prometheus"}`
`method` 가 `GET` , `POST` 인 경우를 포함해서 필터
`http_server_requests_seconds_count{method=~"GET|POST"}`
`/actuator`
로 시작하는 `uri` 는 제외한 조건으로 필터
`http_server_requests_seconds_count{uri!~"/actuator.*"}`

- 연산자 쿼리
	- `+ (덧셈)`
	- `-(빼기)`
	* `*(곱셈)`
	- `/ (분할)`
	- `% (모듈로)`
	- `^ (승수/지수)`
- 함수
	- `sum` : 값의 합계
		- `sum(http_server_requests_seconds_count)`
	- `sum by` : SQL의 group by 기능과 유사
		- `sum by(method, status)(http_server_requests_seconds_count)`
			- `결과 {method="GET", status="404"} 3`
			- `결과 {method="GET", status="200"} 120`
	- `count` : [[2.Ref(데이터 및 정보 저장)/개발 이론/Metric|Metric(지표)]] 자체의 수 카운트
		- `count(http_server_requests_seconds_count)`
	- `topk` : 상위 3개 [[2.Ref(데이터 및 정보 저장)/개발 이론/Metric|Metric(지표)]] 조회
## Gauge(게이지)
- 임의로 오르내릴 수 있는 값
- ex) CPU 사용량, 메모리 사용량, 사용중인 커넥션
## Counter(카운터)
- 단순하게 증가하는 단일 누적 값
- ex) HTTP 요청 수, 로그 발생 수
- `increase` 함수를 써서 특정 시간씩 제한을 줘서 확인 가능
	- ex) `increase(http_server_requests_seconds_count{uri="/log"}[1m])`
- 기타 등등 여러 기능이 있기에 공식 문서 참조