---
aliases:
  - ServletContainerInitializer
tags:
  - Spring
  - Java
  - Servlet
  - Spring/Configration
  - Spring/Controller
특징: 서블릿 컨테이너 초기화하는 인터페이스
---
# ServletContainerInitializer
[[2.Ref(데이터 및 정보 저장)/Web (Application) Server/Web Application Server(WAS)|서블릿 컨테이너]] 를 초기화하는 인터페이스
[[2.Ref(데이터 및 정보 저장)/Spring/Spring boot|Spring boot]] 에서 `spring-boot-starter-web` 사용할 경우 `AnnotationConfigServletWebServerApplicationContext`로 컨테이너 생성

```java
public interface ServletContainerInitializer {  
  void onStartup(Set<Class<?>> c, ServletContext ctx) throws ServletException;  
}
```
- `Set<Class<?>> c`
	- 조금 더 유연한 초기화 기능 제공
	- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@HandlesTypes|@HandlesTypes]] [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|애노테이션]] 과 함께 사용
- `ServletContext ctx`
	- 서블릿 컨테이너 자체의 기능 제공
	- 이 객체를 통해 필터나 서블릿을 등록 가능

## `ServletContainerInitializer` 정의
- 1. 등록하려는 코드 작성
```java title:"등록하려는 초기화 소스 작성"
package hello.container;  
  
import jakarta.servlet.ServletContainerInitializer;  
import jakarta.servlet.ServletContext;  
import jakarta.servlet.ServletException;  
import java.util.Set;

public class MyContainerInitV1 implements ServletContainerInitializer {  
  @Override  
  public void onStartup(Set<Class<?>> set, ServletContext servletContext) throws ServletException {  
    System.out.println("MyContainerInitV1.onStartup");  
    System.out.println("set = " + set);  
    System.out.println("servletContext = " + servletContext);  
  }}
```
- 2.`src/main/resources/META-INF/services/jakarta.servlet.servletContainerInitializer` 파일 생성
- 3.등록하려는 초기화의 패키지 작성
```
hello.container.MyContainerInitV1
```
## [[2.Ref(데이터 및 정보 저장)/Spring/Servlet|서블릿]] 등록방법
- 1. 등록할 서블릿 작성
```java
public class HelloServlet extends HttpServlet {
  @Override
  protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    System.out.println("HelloServlet.service");
    resp.getWriter().write("Hello, Servlet");
  }
}
```
- 2. 초기화를 위해서는 인터페이스가 필요. 이름은 상관 없음 (추후 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@HandlesTypes|@HandlesTypes]] 통해서 정의 클래스 전달 예정)
```java
public interface AppInit {  
  void onStartup(ServletContext servletContext);  
}
```
- 3. [[2.Ref(데이터 및 정보 저장)/Spring/Servlet|서블릿]]  초기화 코드 작성
```java
public class AppInitV1Servlet implements AppInit {
  @Override
  public void onStartup(ServletContext servletContext) {
    System.out.println("AppInitV1.onStartup");
    
    // 서블릿 등록
//    servletContext.addServlet("hello", "hello.servlet.HelloServlet").addMapping("/hello");
    ServletRegistration.Dynamic helloServlet = servletContext.addServlet("helloServlet", new HelloServlet());
    helloServlet.addMapping("/hello");
  }
}
```
- 4. `ServletContainerInitializer` 정의 파일 작성
  [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@HandlesTypes|@HandlesTypes]] 를 통하여 `AppInit`의 모든 구현체를 `set` [[2.Ref(데이터 및 정보 저장)/개발 이론/Argument|인자]]로 등록
```java
@HandlesTypes({AppInit.class})
public class MyContainerInitV2 implements ServletContainerInitializer {
  @Override
  public void onStartup(Set<Class<?>> set, ServletContext servletContext) throws ServletException {
    System.out.println("MyContainerInitV2.onStartup");
    System.out.println("set = " + set);
    System.out.println("servletContext = " + servletContext);

    // set = [class hello.container.AppInitV1Servlet]
    for (Class<?> aClass : set) {
      try {
        // new AppInitV1Servlet().onStartup(servletContext); // 이 동작과 동일
        AppInit appInit = (AppInit) aClass.getDeclaredConstructor().newInstance();
        appInit.onStartup(servletContext);
      } catch (Exception e) {
        throw new RuntimeException(e);
      }
    }
  }
}
```
- 4.`src/main/resources/META-INF/services/jakarta.servlet.servletContainerInitializer` 파일 생성
- 5.등록하려는 초기화의 패키지 작성
```
hello.container.MyContainerInitV2
```
## Controller 등록방법
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
- 3. [[2.Ref(데이터 및 정보 저장)/Spring/DispatcherServlet|DispatcherServlet]] 이용하여 서블릿 초기화 코드 작성
```java
public class AppInitV2Servlet implements AppInit {
    @Override
    public void onStartup(ServletContext servletContext) {
        System.out.println("AppInitV2Servlet.onStartup");

        //Spring 컨테이너 직접 생성
      AnnotationConfigWebApplicationContext appContext = new AnnotationConfigWebApplicationContext();
      appContext.register(HelloConfig.class);

      // 스프링 MVC 디스패처 서블릿 생성, 스프링 컨테이너 연결
      DispatcherServlet dispatcher = new DispatcherServlet(appContext);

      // 디스패처 서블릿을 서블릿 컨테이너에 등록 (이름 중복 주의! dispatcherV2)
      servletContext.addServlet("dispatcherV2", dispatcher).addMapping("/spring/*");
    }
}
```
- 4. `ServletContainerInitializer` 정의 파일 작성
  [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@HandlesTypes|@HandlesTypes]] 를 통하여 `AppInit`의 모든 구현체를 `set` [[2.Ref(데이터 및 정보 저장)/개발 이론/Argument|인자]]로 등록
```java
@HandlesTypes({AppInit.class})
public class MyContainerInitV2 implements ServletContainerInitializer {
  @Override
  public void onStartup(Set<Class<?>> set, ServletContext servletContext) throws ServletException {
    System.out.println("MyContainerInitV2.onStartup");
    System.out.println("set = " + set);
    System.out.println("servletContext = " + servletContext);

    // set = [class hello.container.AppInitV1Servlet, class hello.container.AppInitV2Servlet]
    for (Class<?> aClass : set) {
      try {
        // new AppInitV1Servlet().onStartup(servletContext); // 이 동작과 동일
        AppInit appInit = (AppInit) aClass.getDeclaredConstructor().newInstance();
        appInit.onStartup(servletContext);
      } catch (Exception e) {
        throw new RuntimeException(e);
      }
    }
  }
}
```
- 4.`src/main/resources/META-INF/services/jakarta.servlet.servletContainerInitializer` 파일 생성
- 5.등록하려는 초기화의 패키지 작성
```
hello.container.MyContainerInitV2
```
## [[2.Ref(데이터 및 정보 저장)/Spring/1.Spring MVC|Spring MVC]] 서블릿 컨테이너 초기화 지원 ([[2.Ref(데이터 및 정보 저장)/Spring/Configuration/WebApplicationInitializer|WebApplicationInitializer]] 사용방법)
- 이전 방법의 3,4,5번을 통합한 방법
![[2.Ref(데이터 및 정보 저장)/Spring/Configuration/WebApplicationInitializer]] 

