---
aliases:
  - AccessDeniedHandler
tags:
  - Spring
  - Spring/Security
  - Spring/Exception
특징: Security Filter 에서 403 Forbidden 에러 처리
---
# AccessDeniedHandler
[[2.Ref(데이터 및 정보 저장)/Spring/Security/ExceptionTranslationFilter|ExceptionTranslationFilter]] 에서 권한 관련 에러가 발생 시 해당 클래스에서 처리

이 처리를 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RestControllerAdvice|@RestControllerAdvice]] 또는 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ControllerAdvice|@ControllerAdvice]] 통해서 처리하고 싶다면 하단의 방법을 작성

```java title:"ControllerAdvice 를 통한 처리 방법"
/*
인가되지 않은(권한 부족 403) 요청에 대한 처리를 담당하는 클래스
 */
@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {
  private final HandlerExceptionResolver resolver;

  public CustomAccessDeniedHandler(@Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver) {
    this.resolver = resolver;
  }

  @Override
  public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
    resolver.resolveException(request, response, null, accessDeniedException);
  }
}
```

```java title:"Security 설정"
@Slf4j  
@RequiredArgsConstructor  
@EnableWebSecurity(debug = true)  
@Configuration // IoC 빈(bean)을 등록  
public class SecurityConfig {
	// 에러를 Advisor 처리를 위해 사용
	final private AuthenticationEntryPoint entryPoint;
	final private CustomAccessDeniedHandler accessDeniedHandler;
 @Bean
	public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception {
		//... 각종 설정

		// 에러 처리
		http.exceptionHandling(exceptionHandling -> {
			exceptionHandling.authenticationEntryPoint(entryPoint);
			exceptionHandling.accessDeniedHandler(accessDeniedHandler);
		});

		return http.build();
	}
}
```