---
aliases:
  - "@Aspect"
tags:
  - Spring
  - Spring/공통처리
  - Spring/공통관심사
  - Annotation
특징: "@Aspect 설정하면 `AnnotationAwareAspectJAutoProxyCreator` 클래스가 자동으로 Advisor 로 변경"
---
# @Aspect
Aspect로 선언하기 위한 방법
@Aspect 선언한다고 해서 Bean으로 등록되는건 아님

```java title:"@Aspect 예제0"
@Slf4j  
@Aspect  
public class AspectV1 {  
  @Around("execution(* hello.aop.order..*(..))")  
  public Object doLog(ProceedingJoinPoint joinPoint) throws Throwable {  
    log.info("AspectV1.doLog() Start");  
    log.info("joinPoint.getSignature().toShortString(): {}", joinPoint.getSignature().toShortString());  
    try {  
      return joinPoint.proceed();  
    } finally {  
      log.info("AspectV1.doLog() End");  
    }  
  }  
}
```

```java title:"@Aspect 예제1"
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
`{java icon title:"실제 호출 대상"}log.info("target={}, joinPoint.getTarget()`
`{java icon title:"전달인자"}log.info("target={}, joinPoint.getArgs()`
`{java icon title:"join point 시그니처"}log.info("target={}, joinPoint.getSignature()`
- `@Aspect` : 애노테이션 기반 프록시를 적용할 때 필요
- `@Around("execution(* hello.proxy.app..*(..))")`
	- `@Around` 값에 포인트컷 표현식을 넣음 ([[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AspectJ|AspectJ]] 표현식 사용)
	- `@Around` 메서드는 어드바이스(`Advice`)가 됨
- `ProceedingJoinPoint joinPoint` : 어드바이스에서 살펴본 `MethodInvocation invocation` 과 유사한 기능
  내부에 실제 호출 대상, 전달 인자, 어떤 객체와 어떤 메서드가 호출되었는지 정보 포함
- `joinPoint.prcessd()` : 실제 호출 대상을 호출
