---
aliases:
  - MDC + Logback
tags:
  - Spring
  - Log
특징: 멀티스레드 환경에 스레드별 구별 기능
---
# MDC + Logback
멀티스레드 환경인 서버에서 각 요청단위 별로 대상을 확인하기 위해서 사용하는 방법
## MDC (Mapped Diagnostic Context)
내부적으로 `ThreadLocal`을 사용하며 Map 형태로 되어 있음
즉 스레드 단위로 관리되는 Map
```java
package org.slf4j;
 
public class MDC {
  public static void put(String key, String val);
 
  public static String get(String key);
 
  public static void remove(String key);
 
  //Clear all entries in the MDC.
  public static void clear();
}
```
> 대략적인 인터페이스
- put(), get(), remove(), clear() 등의 메소드를 지원합니다
- get(String key) : key 와 연관된 Value(데이터) 를 얻음
- put(String key, Object value) : key 와 연관된 Object(데이터) 를 저장
- remove(String key) : key 와 연관된 Value(데이터) 를 제거
- clear() : MDC의 항목을 지운다
### 등록방법
```gradle
// https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-logging
implementation 'org.springframework.boot:spring-boot-starter-logging'
```
> gradle

흐름의 가장 앞에서 MDC에 UUID 를 만들어서 등록하면 되는데 Spring 의 구조 상  [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/Filter|Filter]] 가 가장 최상단이기 때문에 해당 위치에서 MDC의 Thread id 값을 등록
```java
@Component  
@Order(Ordered.HIGHEST_PRECEDENCE) // 가장 높은 우선순위  
public class MDCLoggingFilter implements Filter {  
  @Override  
  public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {  
    String uuid = UUID.randomUUID().toString();  
    try {  
      MDC.put("request_id", uuid);  
      filterChain.doFilter(servletRequest, servletResponse);  
    } finally {  
//      MDC.remove("mdc_request_id");  
      MDC.clear();  
    }  
  }  
}
```
> [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/Filter|Filter]] 

> [!info] `Spring Seucirty`에서는 `addFilterBefore()` 로 filter chain의 가장 앞단에 줄 수있습니다

## Logback 설정
```xml
<configuration>
    <appender name="consoleAppender" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>[%d{yyyy.MM.dd HH:mm:ss.SSS}] - [%-5level] - [%X{request_id}] - [%logger{5}] - %msg%n</pattern>
        </encoder>
    </appender>
    <root level="info">
        <appender-ref ref="consoleAppender"/>
    </root>
</configuration>
```
> logback.xml

`logback.xml` 파일의 내부를 보면 mdc_request_id 를 log 내용에 등록하는 것을 볼 수 있음
`request_id` 이름은 다른 것으로 변경해도 상관은 없지만 [[2.Ref(데이터 및 정보 저장)/Web (Application) Server/Nginx|Nginx]]1.11.0 버전부터 고유 식별자로 사용하는 이름이기 때문에 그대로 따라가는 것이 좋음 

> https://0soo.tistory.com/246#Logback%EC%A-%--%EC%-A%A-