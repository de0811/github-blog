---
aliases:
  - 서블릿
  - Servlet
tags:
  - Servlet
  - Java
---

# Servlet 
Java 서버 통신의 기본 단위
## 왜 만들었나?
- 비즈니스 로직 이외에 공통적으로 해야하는 작업들이 너무 많았음
- 그 공통적인 로직을 한번에 해결하기 위해 만들어 진 것이 [[2.Ref(데이터 및 정보 저장)/Spring/Servlet]] 

## 기능
![[Pasted image 20231114154118.png|300]]
- 서버 TCP/IP 연결 대기, 소켓 연결
- HTTP 요청 메시지를 파싱해서 읽기
- Method 방식, URL 인지
- Content-Type 확인
- HTTP 메시지 바디 내용 파싱
- 저장 프로세스 실행
- 비즈니스 로직 실행(사용자가 정의해서 서블릿에 전달)
- HTTP 응답 메시지 생성 시작
	- HTTP 시작 라인 생성
	- Header 생성
	- 메시지 바디에 HTML 생성에서 입력
- TCP/IP 응답 전달, 소켓 종료

```java
@WebServlet(name="helloServlet", urlPatterns="/hello")
public class HelloServlet extends HttpServlet {
	@Override
	protected void service(
		HttpServletRequest request, HttpServletResponse response
	) {
	// 애플리케이션 로직
	}
}
```

## Servlet 등록 방법
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@WebServlet]] [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|애노테이션(annotation)]] 
	- 간단함
	- 내부는 어차피 아래 방식을 쓰고 있음
- [[2.Ref(데이터 및 정보 저장)/Spring/Configuration/ServletContainerInitializer#2.Ref(데이터 및 정보 저장)/Spring/Servlet 서블릿 등록방법|ServletContainerInitializer를 통한 프로그래밍 방식]]
	- 유연한 변경 가능



## 서블릿을 편하게 사용하기 위한 인터페이스
- [[HttpServletRequest]]
- [[HttpServletResponse]]
