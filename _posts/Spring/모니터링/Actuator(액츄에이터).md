---
aliases:
  - Actuator(액츄에이터)
  - Actuator
  - 액츄에이터
tags:
  - Spring
  - Spring/모니터링
특징: 
---
# Actuator(액츄에이터)
- [[2.Ref(데이터 및 정보 저장)/Spring/모니터링/프로덕션(운영환경) 준비 기능|프로덕션(운영환경) 준비 기능]] 을 위한 모니터링 기능
- 액츄에이터는 활성화 + 노출 상태여야 사용 가능
- 액츄에이터는 기본적으로 모두 활성화 상태(shutdown 명령만 제외)
- 어떤 엔드포인트를 어떻게 노출할지는 선택 사항
	- HTTP, JMX 방식이 있지만 보통 HTTP 방식만 사용
- 보안상 위험할 수 있는 정보가 많기 때문에 포트를 분리하여 내부로만 사용하거나 `/actuator` 경로에 [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/Filter|서블릿 필터]] , [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/Interceptor|스프링 인터셉터]] 또는 [[2.Ref(데이터 및 정보 저장)/Spring/Security/1.Spring Security.canvas|Spring Security]]를 통해 인증된 사용자만 접근 가능하도록 추가 개발 필요
## 엔드포인트 목록
- `beans` : 스프링 컨테이너에 등록된 스프링 빈을 보여준다.
- `conditions` : `condition` 을 통해서 빈을 등록할 때 평가 조건과 일치하거나 일치하지 않는 이유를 표
- `configprops` : `@ConfigurationProperties` 를 보여준다.
- `env` : `Environment` 정보를 보여준다.
- `health` : 애플리케이션 헬스 정보를 보여준다.
- `httpexchanges` : HTTP 호출 응답 정보를 보여준다. [[2.Ref(데이터 및 정보 저장)/Spring/모니터링/HttpExchangeRepository]] 를 구현한 빈을 별도로 등록해야 한다.
- `info` : 애플리케이션 정보를 보여준다.
	- `java` : 자바 런타임 정보
	- `os` : OS 정보
	- `env` : [[2.Ref(데이터 및 정보 저장)/Spring/Configuration/Environment|Environment]]에서 `info.` 으로 시작하는 정보
	- `build` : 빌드 정보,`META-INF/build-info.properties` 파일 필요
	- `git` : `git`정보 `git.properties` 파일 필요
- `loggers` : 애플리케이션 로거 설정을 보여주고 변경도 할 수 있다.
- `metrics` : 애플리케이션의 메트릭 정보를 보여준다.
- `mappings` : `@RequestMapping` 정보를 보여준다.
- `threaddump` : 쓰레드 덤프를 실행해서 보여준다.
- `shutdown` : 애플리케이션을 종료한다. 이 기능은 ****기본으로** **비활성화**** 되어 있다.
> [전체 엔드 포인트 설명이 있는 공식 사이트](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints)
## 사용 방법
- [[2.Ref(데이터 및 정보 저장)/Intellij/Gradle|Gradle]] 추가
```gradle
dependencies {  
    implementation 'org.springframework.boot:spring-boot-starter-actuator' //actuator 추가
    ...
}
```
- 액츄에이터의 전용 포트 설정
```properties title:"액츄에이터의 전용으로 사용할 포트 설정"
management.server.port=9292
```
- 실행 방법
```http title:"접속 방법"
http://localhost:8080/actuator
```

```json title:"액츄에이터 접속 결과"
{
  "_links": {
    "self": {
      "href": "http://localhost:8080/actuator",
      "templated": false
    },
    "health-path": {
      "href": "http://localhost:8080/actuator/health/{*path}",
      "templated": true
    },
    "health": {
      "href": "http://localhost:8080/actuator/health",
      "templated": false
    }
  }
}
```
>`http://localhost:8080/actuator/health` 의 기능은 애플리케이션의 현재 상태를 나타냄
## 액츄에이터의 기능 노출 방법
```properties title:"모든 기능 노출"
management.endpoints.web.exposure.include=*
```
## 액츄에이터의 기능 노출 차단 방법
```properties title:"해당 기능들 노출하지 않음"
management.endpoints.web.exposure.exclude=env,beans,info
```
## 액츄에이터의 기능 활성화
```properties title:"각종 기능 활성화"
# Enable the shutdown endpoint
management.endpoint.shutdown.enabled=true
# health
## 아주 상세히 보기
management.endpoint.health.show-details=always
## 대충 상세히 보기
management.endpoint.health.show-components=always
# info  
management.info.java.enabled=true  
management.info.os.enabled=true
management.info.env.enabled=true
management.info.git.mode=full`
# log
## logging.level.<package> = DEBUG | INFO ...
logging.level.hello.controller=DEBUG
# Tomcat  
server.tomcat.mbeanregistry.enabled=true
```
- `info` 의 `build` 정보를 보려면 [[2.Ref(데이터 및 정보 저장)/Intellij/Gradle|Gradle]]  설정 필요
```gradle title:"info의 build 정보를 보기 위한 META-INF/build-info.properties 파일 생성"
springBoot {
    buildInfo()
}
```
- `info`의 `git` 정보를 보려면 [[2.Ref(데이터 및 정보 저장)/Intellij/Gradle|Gradle]]  설정 필요(git을 쓰지 않는다면 에러 발생)
```gradle title:"git.properties 파일 필요해서 설정하면 자동 생성"
plugins {
    id "com.gorylenko.gradle-git-properties" version "2.4.1" //git info
    ...
}
```
- `loggers` 는 현재 로그 출력을 하는 각 레벨을 표시
- 레벨을 원격으로 수정하는 방법
```http title:"원격으로 logger level 변경"
POST http://localhost:8080/actuator/loggers/<PackageName>

{
	"configuredLevel" : "TRACE"
}
```
## HTTP 요청 응답 기록(`httpexchanges`)
- [[2.Ref(데이터 및 정보 저장)/Spring/모니터링/HttpExchangeRepository]] 인터페이스 구현체를 빈으로 등록하면 `httpexchanges` 사용 가능
- 실제 운영 서비스에서는 모니터링 툴이나 핀포인트, Zipkin 같은 다른 기술을 사용하는 것을 추천
