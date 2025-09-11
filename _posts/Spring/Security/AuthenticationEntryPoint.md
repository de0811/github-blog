---
aliases:
  - AuthenticationEntryPoint
tags:
  - Spring
  - Spring/Security
  - Spring/Exception
특징: Security Filter 에서 401 Unauthorized 에러 처리
---
# AuthenticationEntryPoint
[[2.Ref(데이터 및 정보 저장)/Spring/Security/ExceptionTranslationFilter|ExceptionTranslationFilter]] 에서 인증 관련 에러가 발생 시 해당 클래스에서 처리

이 처리를 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RestControllerAdvice|@RestControllerAdvice]] 또는 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ControllerAdvice|@ControllerAdvice]] 통해서 처리하고 싶다면 하단의 방법을 작성

```java title:"ControllerAdvice 를 통한 처리 방법"
/*
인증되지 않은 요청(401)에 대한 처리를 담당하는 클래스
 */
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
  private final HandlerExceptionResolver resolver;

  public CustomAuthenticationEntryPoint(@Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver) {
    this.resolver = resolver;
  }

  @Override
  public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
//    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);  
//    response.setContentType("application/json");  
//    response.getWriter().write(CommonResponse.createResponseEntity(SERVER_STATE_TYPE.UNAUTHORIZED).getBody().toString());
    resolver.resolveException(request, response, null, authException);
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