---
aliases:
  - JAR
tags:
  - Spring
  - Java
  - WebApplicationServer
  - WebServer
  - WAS
특징:
---
# JAR

## 폴더 구조
- `META-INF`
	- 메타데이터를 포함
	- `MANIFEST.MF`
		- 파일의 메타데이터를 포함하는 메니페스트 파일
		- JAR 파일의 버전, 클래스 경로, 메인 클래스 등의 정보 포함
		- `Main-Class` : 최초에 실행될 메인 클래스
- `BOOT-INF`
	- [[2.Ref(데이터 및 정보 저장)/Spring/Spring boot|Spring boot]] 전용 디렉토리
	- `BOOT-INF/classes/` : 애플리케이션의 컴파일된 클래스 파일의 위치
	- `BOOT-INF/lib/` : 애플리케이션이 의존하는 라이브러리 JAR 파일의 위치
	- `BOOT-INF/layers/`
		- Spring boot 2.3 부터 도입
		- Jar 파일 구조를 지원하기 위한 디렉토리
		- 계층화된 JAR 파일은 Docker 이미지 빌드 시 유용
	- `BOOT-INF/classpath.idx` : 외부 라이브러리 경로
	- `BOOT-INF/layers.idx` : 스프링 부트 구조 경로
- `org/springframework/boot/loader`
	- `JarLauncher.class` : 스프링 부트 main 실행 클래스


