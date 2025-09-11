---
aliases:
  - Spring boot
tags:
  - Spring
---
# Spring boot
## 왜? 만들어졌나
- 너무 확장 많이 확장
	- 설정할게 너무 많음
	- 너무 무거움
	- 조합식이 너무 많아짐
	- 버전 꼬임
## 5가지 핵심 기능
- 내장 서버 (빌드 결과인 jar 에 [[Web Application Server(WAS)|WAS]] 서버 포함하여 배포(빌드 배포 단순화))
- 자동 라이브러리 관리
	- 스타터 종속성 제공
	- 외부 라이브러리 버전 자동 관리
- 자동 구성(Auto Configuration)
	- 외부라이브러리 빈(Bean) 자동 등록
- 외부 설정
	- 환경에 따른 외부 설정 공통화
- 모니터링과 관리 기능 (프로덕션 준비)
	- 스프링 부트 액츄에이터
	- 마이크로미터, 프로메테우스, 그라파나를 활용한 모니터링
	- 모니터링 활용
### 내장서버
```java
@SpringBootApplication
public class BootApplication {
	public static void main(String[] args) {
		SpringApplication.run(BootApplication.class, args);
	}
}
```
> `SpringApplication.run(BootApplication.class, args);` 한줄에는 2가지 핵심 기능 동작

- 스프링 컨테이너 생성
- [[2.Ref(데이터 및 정보 저장)/Web (Application) Server/Web Application Server(WAS)|WAS]](내장 톰캣) 생성
### 자동 라이브러리 관리
- `dependency-management` 플러그인을 통해 버전 자동 관리 가능
	- `spring-boot-dependencies` 파일에 있는 `bom` 정보 참고 (해당 Spring boot 에 맞는 모든 라이브러리의 정보를 포함한 정보)
> [!seealso] Spring boot 에서 추천하는 버전의 라이브러리를 사용하고 싶지 않을 때
> `ext['tomcat.version'] = '10.1.4'` 이런 형식으로 `build.gradle` 에 포함
> [해당 이름 찾는 방법](https://docs.spring.io/spring-boot/appendix/dependency-versions/properties.html#appendix.dependency-versions.properties)
### auto configuration(자동 구성)
- 직접 Bean 등록하지 않아도 자동 등록 및 설정되어 있는 구성
- `spring-boot` 에 `spring-boot-autoconfigure` 라는 이름으로 라이브러리를 사용
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ConditionalOnMissingBean]] 를 사용하여 인자로 들어가는 class 가 없을 경우 해당 configuration 등록 (사용자가 등록할 경우 사용자 것을 사용하도록 하기 위해)
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@AutoConfiguration]] 통해서 순서 설정

