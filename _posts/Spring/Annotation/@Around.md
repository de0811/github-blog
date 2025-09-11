---
aliases:
  - "@Around"
tags:
  - Spring
  - Spring/공통관심사
  - Spring/공통처리
  - Annotation
특징: AOP 조건 설정
---
# @Around
[[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AspectJ|AspectJ]] 표현식 사용하여 Pointcut 생성을 위해 작성
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Pointcut|@Pointcut]] 으로 만든 것을 사용할 수도 있음
조건 설정은 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Pointcut|@Pointcut]]에 설명

```java
@Aspect  
@Slf4j  
public class LogTraceAspect {  
  private final LogTrace logTrace;  
  
  public LogTraceAspect(LogTrace logTrace) {  
    this.logTrace = logTrace;  
  }  
  
  @Around("execution(* hello.proxy.app..*(..))")  
  public Object execute(ProceedingJoinPoint joinPoint) throws Throwable {  
    log.info("LogTraceAspect.execute() Start");  
    TraceStatus status = null;  
  
    try {  
      status = logTrace.begin(joinPoint.getSignature().toShortString());  
      Object result = joinPoint.proceed();  
      logTrace.end(status);  
      return result;  
    } catch (Exception e) {  
      logTrace.exception(status, e);  
      throw e;  
    }finally {  
      log.info("LogTraceAspect.execute() End");  
    }  
  }  
}
```

```java title:"Parameter 전달 방법"
@Slf4j @SpringBootTest  
@Import(ParameterTest.ParameterAspect.class)  
public class ParameterTest {  
  @Autowired  
  MemberService memberService;  
  
  @Test  
  void success() {  
    log.info("memberService Proxy: {}", memberService.getClass());  
    memberService.hello("helloA");  
  }  
  
  @Aspect  
  static class ParameterAspect {  
    @Pointcut("execution(* hello.aop.order..*.*(..))")  
    public void alloMember() {}  
  
    @Around("alloMember() && args(arg, ..)")  
    public Object logArgs1(ProceedingJoinPoint joinPoint, Object arg) throws Throwable {  
      Object arg1 = joinPoint.getArgs()[0];  
      log.info("[logArgs1]{} arg={}", joinPoint.getSignature().toShortString(), arg1);  
      return joinPoint.proceed();  
    }  
  }  
}
```


