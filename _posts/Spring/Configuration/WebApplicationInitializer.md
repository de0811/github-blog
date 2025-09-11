---
aliases:
  - WebApplicationInitializer
tags:
  - Spring
  - Servlet
  - Spring/Configration
  - Spring/Controller
특징: Spring MVC 에서 지원하는 서블릿 컨테이너 초기화하는 인터페이스
---
# WebApplicationInitializer
[[2.Ref(데이터 및 정보 저장)/Spring/1.Spring MVC|Spring MVC]]  에서 지원하는 서블릿 컨테이너 초기화하는 인터페이스
Spring MVC 없던 시절 방법으로는 [[2.Ref(데이터 및 정보 저장)/Spring/Configuration/ServletContainerInitializer|ServletContainerInitializer]] 이용하여 작성
정확하게는 `spring-web-x.x.x.jar` 파일에서 `jakarta.servlet.servletContainerInitializer` 정의를 확인할 수 있으며 [[2.Ref(데이터 및 정보 저장)/Spring/Configuration/SpringServletContainerInitializer|SpringServletContainerInitializer]]  내부에서 `WebApplicationInitializer` 를 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@HandlesTypes|@HandlesTypes]] 을 불러와서 공통적인 처리를 하는 것을 확인 가능
- 1. 컨트롤러 코드 작성
```java
@RestController
public class HelloController {
  @GetMapping("/hello")
  public String hello() {
    System.out.println("HelloController.hello");
    return "hello Spring";
  }
}
```
- 2. Bean 등록을 위한 Config 작성
```java
@Configuration
public class HelloConfig {
  @Bean
  public HelloController helloController() {
    return new HelloController();
  }
}
```
- 3. [[2.Ref(데이터 및 정보 저장)/Spring/DispatcherServlet|DispatcherServlet]] 이용하여 서블릿 초기화 코드 작성 (하지만 [[2.Ref(데이터 및 정보 저장)/Spring/1.Spring MVC|Spring MVC]] 제공하는 방법으로 `ServletContainerInitializer` 정의까지 한번에 끝)
```java
public class AppInitV3SpringMvc implements WebApplicationInitializer {
  @Override
  public void onStartup(ServletContext servletContext) throws ServletException {
    System.out.println("AppInitV3SpringMvc.onStartup");

    //Spring 컨테이너 직접 생성
    AnnotationConfigWebApplicationContext appContext = new AnnotationConfigWebApplicationContext();
    appContext.register(HelloConfig.class);

    // 스프링 MVC 디스패처 서블릿 생성, 스프링 컨테이너 연결
    DispatcherServlet dispatcher = new DispatcherServlet(appContext);

    // 모든 요청이 디스패처 서블릿을 통하도록 설정
    servletContext.addServlet("dispatcherV3", dispatcher).addMapping("/");
  }
}
```