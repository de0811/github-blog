---
aliases:
  - Web Application Server
  - Servlet Container
  - WAS
  - 서블릿 컨테이너
tags:
  - WebApplicationServer
---


# 특징
- HTTP 기반으로 동작
- 웹 서버 기능 포함 + (정적 리소스 제공 가능)
- <span style="background:rgba(240, 200, 0, 0.2)">프로그램 코드를 실행해서 애플리케이션 로직 수행</span>
	- 동적 HTML, HTTP API(JSON)
	- 서블릿, JSP, 스프링 MVC
- 예) 톰켓([[2.Ref(데이터 및 정보 저장)/Web (Application) Server/Tomcat|Tomcat]]), [[Jetty]], [[Undertow]]
- Spring 에서는 서블릿 컨테이너라고도 부름
- `webapp/WEB-INF` 경로는 외부에서 호출해도 호출되지 않음
-  [[2.Ref(데이터 및 정보 저장)/Spring/Configuration/ServletContainerInitializer|ServletContainerInitializer]] 통해 최초 설정
 
## 프로그램 코드를 실행해서 애플리케이션 로직 수행
- 서블릿을 관리
- 서블릿 객체를 생성, 초기화, 호출, 종료하는 생명주기 관리
- 서블릿 객체는 싱글톤으로 관리
	- 매번 생성하는 것은 비효율
	- 공유 변수 사용 주의
- JSP 또한 서블릿으로 변환되어서 사용
- 동시 요청을 위한 멀티 쓰레드 처리 지원

# [[Web Server]] 기능을 다 쓸 수 있지만 WS 를 써야하는 이유
- WAS 너무 많은 역할을 담당, 서버 과부하 우려
- 가장 비싼 애플리케이션 로직이 정적 리소스 때문에 수행이 어려울 수 있음
- WAS 장애시 오류 화면도 노출 불가능
