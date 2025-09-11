---
aliases:
  - "@AfterThrowing"
tags:
  - Spring
  - Spring/공통처리
  - Spring/공통관심사
  - Annotation
특징: AOP 조건 설정
---
# @AfterThrowing
메서드가 예외를 던지는 경우 실행
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Pointcut|@Pointcut]] 으로 만든 것을 사용할 수도 있음
조건 설정은 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Pointcut|@Pointcut]]에 설명

```java title:"어드바이스 종류별 사용"
@Slf4j  
@Aspect  
public class AspectV6Advice {  
  @Around("hello.aop.order.aop.Pointcuts.allOrderAndService()")  
  public Object doTransaction(ProceedingJoinPoint joinPoint) throws Throwable {  
    try {  
      //@Before  
      log.info("[트랜잭션 시작] {}", joinPoint.getSignature().toShortString());  
      Object result = joinPoint.proceed();  
      //@AfterReturning  
      log.info("[트랜잭션 커밋] {}", joinPoint.getSignature().toShortString());  
      return result;  
    } catch (Exception e) {  
      //@AfterThrowing  
      log.info("[트랜잭션 롤백] {}", joinPoint.getSignature().toShortString());  
      throw e;  
    }finally {  
      //@After  
      log.info("[트랜잭션 종료] {}", joinPoint.getSignature().toShortString());  
    }  
  }  
  
  @Before("hello.aop.order.aop.Pointcuts.allOrderAndService()")  
  public void doBefore(JoinPoint joinPoint) {  
    log.info("[Before] {}", joinPoint.getSignature().toShortString());  
  }  
  
  @AfterReturning(pointcut = "hello.aop.order.aop.Pointcuts.allOrderAndService()", returning = "result")  
  public void doAfterReturning(JoinPoint joinPoint, Object result) {  
    log.info("[AfterReturning] {} return {}", joinPoint.getSignature().toShortString(), result);  
  }  
  
  @AfterThrowing(pointcut = "hello.aop.order.aop.Pointcuts.allOrderAndService()", throwing = "e")  
  public void doAfterThrowing(JoinPoint joinPoint, Exception e) {  
    log.info("[AfterThrowing] {} Exception {}", joinPoint.getSignature().toShortString(), e);  
  }  
  
  @After("hello.aop.order.aop.Pointcuts.allOrderAndService()")  
  public void doAfter(JoinPoint joinPoint) {  
    log.info("[After] {}", joinPoint.getSignature().toShortString());  
  }  
}
```