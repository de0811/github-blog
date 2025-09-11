---
aliases:
  - 필터
  - Filter
tags:
  - Spring
  - Spring/Request
  - Servlet
  - Spring/공통관심사
특징: 
---
서블릿이 제공
> [!info] 전달 순서
> HTTP 요청 -> WAS -> 필터 -> 서블릿 -> 컨트롤러

로그인 여부 확인하기 좋음
체인 형태 (다양한 필터를 체인형식으로 연결)
## Method
`init()` : 필터 초기화 메서드, 서블릿 컨테이너가 생성될 때 호출
`doFilter()` : 요청이 올때 마다 해당 메서드 호출 (필터 로직 구현)
`destroy()` : 필터 종료 메서드, 서블릿 컨테이너가 종료될 때 호출 
## 등록방법
### FilterRegistrationBean 등록 방법
```java
@Configuration  
public class WebConfig {  
  @Bean  
  public FilterRegistrationBean logFilter() {  
    FilterRegistrationBean registrationBean = new FilterRegistrationBean();  
    registrationBean.setFilter(new LogFilter());  // 필터 등록
    registrationBean.setOrder(1);  // 순서 지정
    registrationBean.addUrlPatterns("/*");  // 서블릿 URL 패턴
    registrationBean.setDispatcherTypes(DispatcherType.REQUEST, DispatcherType.ERROR); // DispatcherType 지정
    return registrationBean;  
  }  
}
```
[[2.Ref(데이터 및 정보 저장)/Spring/DispatchType|DispatchType]] 상태에 따라 처리 가능 Exception으로 2번 필터를 지나는 것을 방지할 수 있음
`registrationBean.setDispatcherTypes(DispatcherType.REQUEST);` 해당 모습처럼 아무런 설정을 하지 않는다면 [[2.Ref(데이터 및 정보 저장)/Spring/DispatchType#REQUEST|DispatchType.REQUEST]] 일 경우만 등록되어 있기 때문에 에러일 경우 다시 필터를 반복하는 문제는 없음
### @WebFilter 등록 방법
단점으로는 WebFilter 의 경우 내부 톰켓 라이브러리를 사용하기 때문에 Weblogic 14.1.1 을 사용할때 에러 발생
```java
@Component  
@NoArgsConstructor  
@WebFilter(urlPatterns = "/**")
//@Order(Ordered.HIGHEST_PRECEDENCE) // 가장 높은 우선순위
@Order(0)  
public class AllowIPFilter extends OncePerRequestFilter {  
    @Autowired  
    XsConfig xsConfig;  
  
    @Override  
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {  
        String ip = request.getRemoteAddr();  
  
        log.info("!!!!!!!!!! ALLOW IP CHECK FILTER !!!!!!!!!!");  
        // 허용하는 IP 인지 확인  
        if( ObjectUtil.isNotEmpty(ip) && xsConfig.hasAllowIp(ip) ){ // 허용된 IP            log.info("[" + ip + "] 허용된 IP");  
            filterChain.doFilter(request, response);  
        }else{ // 차단된 IP            log.error("[" + ip + "] 차단된 IP");  
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "IP DENY.");  
        }  
    }  
}
```

## 정의 방법
```java
@Slf4j  
public class LogFilter implements Filter {  
  @Override  
  public void init(FilterConfig filterConfig) throws ServletException {  
    log.info("log filter init");  
  }  
  
  @Override  
  public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {  
    log.info("log filter doFilter");  
    HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;  
    String requestURI = httpServletRequest.getRequestURI();  
    String requestURL = httpServletRequest.getRequestURL().toString();  
  
    log.info("requestURI = {}, requestURL = {}", requestURI, requestURL);  
  
    String uuid = UUID.randomUUID().toString();  
    try {  
      log.info("REQUEST [{}][{}]", uuid, requestURI);  
      filterChain.doFilter(servletRequest, servletResponse);  
    } catch (Exception e) {  
      throw e;  
    } finally {  
      log.info("RESPONSE [{}][{}]", uuid, requestURI);  
    }  
  }  
  
  @Override  
  public void destroy() {  
    log.info("log filter destroy");  
  }  
}
```

`filterChain.doFilter()`를 통해 전달되어야 필터들의 체인 되어 동작하며 컨트롤러까지 동작