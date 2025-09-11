---
aliases:
  - AOP
  - 관점 지향 프로그래밍
  - 관점 지향 프로그래밍(AOP, Aspect-Oriented Programming)
tags:
  - Spring
  - Spring/Request
  - Spring/공통관심사
특징: 
---
# 횡단 관심사(흩어진 관심사 cross-cutting concerns)
핵심적인 기능이 아닌 중간중간 삽입되어야하는 기능들인 관심들을 횡단관심사라고 함
__주요 기능이 아니지만 중복된 동일한 기능들을 말함__

```java
public void helloA() {
	System.out.println("Start...");
	AAA();
	System.out.println("End...);
}
public void helloB() {
	System.out.println("Start...");
	BBB();
	System.out.println("End...);
}
```
# AOP
관점 지향 프로그래밍
AOP는 프로그램의 주요 기능에서 분리된 [[#횡단 관심사(흩어진 관심사 cross-cutting concerns)]]를 모듈화하는 프로그래밍 패러다임
예를 들어, 로깅, 트랜잭션 관리, 보안 등이 횡단 관심사에 해당
[[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/Proxy|Proxy]] 를 사용하여 만든 방법으로 [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/Proxy|CGLIB]]를 사용

---

[[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/Proxy|Dynamic Proxy]]와 [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/Proxy|CGLIB]] 이용한 기술
AspectJ 프레임워크가 아닌 스프링 자체에서 AOP를 지원하기위해 AspectJ 문법을 차용하고 AspectJ 제공하는 기능의 일부만 제공
간단하게 AspectJ 프레임워크를 빼꼇음

[[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AspectJ|AspectJ]]의 주요 설명
- 자바 프로그래밍에 대한 완벽한 관점 지향 확장
- 횡단 관심자의 깔끔한 모듈화
	- 오류 검사 및 처리
	- 동기화
	- 성능 최적화(캐싱)
	- 모니터링 및 로깅
AOP를 사용할 때 부가 기능 로직을 실제 로직에 추가할 수 있는 방법 3가지
- 위빙(Weaving) : 컴파일 시점 ([[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AspectJ|AspectJ]] 프레임 워크 사용 시 사용 가능)
	- `.java`파일을 AspectJ 컴파일러를 이용해서 `.class` 만드는 시점에 부가 기능 추가 가능
	- 단점 : 특별한 컴파일러 필요와 복잡성
- 로드타임 위빙 : 클래스 로딩 시점([[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AspectJ|AspectJ]] 프레임 워크 사용 시 사용 가능)
	- `.class` 파일을 JVM 에 올리기 직전에 추가하여 저장
	- `java instrumentation` 기술 사용
	- 단점 : 특별한 옵션을 통해서 클래스 로더 조작기를 지정 필요, 번거롭고 복잡
- 런타임 시점(프록시)
	- 단점 : @Override 되는 것만 적용 가능

Join Point(조인 포인트) : AOP를 어디다가 적용을 시킬지 설정(생성자, 필드 값 접근, static 메서드 접근, 메서드 실행 등)
	하지만 Spring AOP인 ==프록시 방식==의 경우 메서드 실행 지점에만 적용 가능

[[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AspectJ|AspectJ]] : 공부할게 너무 많음, 실무에선 이것까지 필요하진 않은 경우가 대부분

## 용어
AOP 중요 용어 : [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Aspect|@Aspect]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Pointcut|@Pointcut]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Around|@Around]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Before|@Before]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@AfterReturning|@AfterReturning]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@AfterThrowing|@AfterThrowing]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@After|@After]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Order|@Order]]

- Join Point(조인 포인트)
	- AOP를 어디다가 적용을 시킬지 설정(생성자, 필드 값 접근, static 메서드 접근, 메서드 실행 등)
	- [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AspectJ|AspectJ]]의 경우에는 모든 곳에서 할 수 있지만 Spring AOP인 ==프록시 방식==의 경우 메서드 실행 지점에만 적용 가능
- Pointcut(포인트컷)
	- 조인 포인트 중에서 어드바이스가 적용될 위치를 선별하는 기능
	- 주로 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Around|@Around]] [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AspectJ|AspectJ]] 표현식을 사용해서 지정
	- 포인트컷 분리 방법은 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Pointcut|@Pointcut]] 사용
	- 프록시를 사용하는 Spring AOP는 메서드 실행 지점만 포인트컷으로 선별 가능
- Target(타겟)
	- 어드바이스를 받는 객체, 포인트컷으로 결정
- Advice(어드바이스)
	- 부가 기능
	- Advice(어드바이스) 종류 ([[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Around|@Around]] 이외엔 작업 흐름을 변경할 수 없음)
		- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Around|@Around]] : 메서드 호출 전후 수행, 가장 강력한 어드바이스, 조인 포인트 실행 여부 선택, 반환 값 변환, 예외 변환 등 사용
		- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Before|@Before]] : 조인 포인트가 정상 완료 후 실행
		- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@AfterReturning|@AfterReturning]] : 조인 포인트가 정상 완료 후 실행
		- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@AfterThrowing|@AfterThrowing]] : 메서드가 예외를 던지는 경우 실행
		- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@After|@After]] : 조인 포인트가 정상 또는 예외에 관계없이 실행(finally)
- Aspect(애스팩트)
	- 어드바이스 + 포인트컷을 모듈화 한 것
	- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Aspect|@Aspect]]
	- 여러 디바이스와 포인트컷이 함께 존재
- Advisor(어드바이저)
	- Advisor = Pointcut + Advice
	- Spring AOP 에서만 사용되는 것
- Weaving(위빙)
	- 포인트컷으로 결정한 타겟의 조인 포인트에 어드바이스를 적용하는 것
	- 위빙을 통해 핵심 기능 코드에 영향을 주지 않고 부가 기능을 추가
	- AOP 적용을 위해 애스팩트를 객체에 연결한 상태
		- 컴파일 타임(AspectJ Compiler)
		- 로드 타임
		- 런타임, (프록시 방식) 스프링 AOP는 런타임
- AOP 프록시
	- AOP 기능을 구현하기 위해 만든 프록시 객체
	- 스프링에서 AOP 프록시는 JDK 동적 프록시 또는 CGLIB 프록시를 의미

## 사용
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Aspect|@Aspect]] 컴포넌트 스캔이 안되기 때문에 직접 [[@Bean]]을 호출해야함
### 어드바이스 순서 바꾸는 방법
- 내부 클래스를 사용하는 방법
- 외부 클래스로 따로 빼는 방법
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Order]]의 경우 클래스의 순서를 정하는 것이기 때문에 method로 만든 어드바이스의 순서에 개입할 수 없음
방법은 클래스로 따로 빼면 가능
```java title:"Advisor 순서 변경"
@Slf4j  
@Aspect  
public class AspectV5Order {  
  
  @Aspect  
  @Order(2)  
  public static class LogAspect {  
    @Around("hello.aop.order.aop.Pointcuts.allOrder()")  
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
  
  @Aspect  
  @Order(1)  
  public static class TransactionAspect {  
    // hello.aop.order 패키지와 하위 패키지 이면서 클래스 이름 패턴이 *Service 인 클래스의 모든 메서드에 적용  
    @Around("hello.aop.order.aop.Pointcuts.allOrderAndService()")  
    public Object doTransaction(ProceedingJoinPoint joinPoint) throws Throwable {  
      log.info("AspectV1.doLogService() Start");  
      log.info("joinPoint.getSignature().toShortString(): {}", joinPoint.getSignature().toShortString());  
      try {  
        log.info("[트랜잭션 시작] {}", joinPoint.getSignature().toShortString());  
        Object result = joinPoint.proceed();  
        log.info("[트랜잭션 커밋] {}", joinPoint.getSignature().toShortString());  
        return result;  
      } catch (Exception e) {  
        log.info("[트랜잭션 롤백] {}", joinPoint.getSignature().toShortString());  
        throw e;  
      }finally {  
        log.info("[트랜잭션 종료] {}", joinPoint.getSignature().toShortString());  
      }  
    }  
  }  
  
}
```
> 내부 클래스로 만들어도 되지만 외부에 클래스로 만들어도 문제 없음

## 어드바이스 종류별 사용
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
# 어노테이션과 엮어서 사용한 예제
```java title:"로그 남기기"
@Target(ElementType.METHOD)  
@Retention(RetentionPolicy.RUNTIME)  
public @interface Trace {  
}

@Slf4j  
@Aspect  
public class TraceAspect {  
  @Before("@annotation(hello.aop.exam.annotation.Trace)")  
  public void beforeTrace(JoinPoint joinPoint) {  
    Object[] args = joinPoint.getArgs();  
    log.info("[trace] {} args: {}", joinPoint.getSignature().toShortString(), args);  
  }  
}
```

```java title:"재실행하기"
@Target(ElementType.METHOD)  
@Retention(RetentionPolicy.RUNTIME)  
public @interface Retry {  
  public int maxRetryCount() default 3;  
}

@Slf4j  
@Aspect  
public class RetryAspect {  
  @Around("@annotation(retry)")  
  public Object retry(ProceedingJoinPoint joinPoint, Retry retry) throws Throwable {  
    int retryCount = retry.maxRetryCount();  
    log.info("[retry]{} retryCount={} Start",  joinPoint.getSignature().toShortString(), retryCount);  
    Exception e = null;  
  
    for (int count = 0; count < retryCount; count++) {  
      try {  
        return joinPoint.proceed();  
      } catch (Exception e1) {  
        e = e1;  
      }  
    }  
    throw e;  
  }  
}
```
# AOP 사용시 주의 사항
## 내부에서 내부 함수 호출 시 프록시 거치지 않아 발생 문제
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Transactional|@Transactional]] 때와 동일한 문제로 대상 객체의 내부에서 메서드 호출시 프록시를 거치지 않아 문제 발생

```java title:"내부 메서드 호출 시 프록시 적용되지 않는 사항" error:7
@Slf4j  
@Component  
public class CallServiceV0 {  
  
  public void external() {  
    log.info("external");  
    internal();  
  }  
  
  public void internal() {  
    log.info("internal");  
  }  
}
```

### 해결 방안 : 자기 자신 주입
`{properties title:"자기 자신 주입 시 필수 설정" icon}spring.main.allow-circular-references=true`
```java title:"자기 자신을 주입 받아서 호출하는 방법" hl:5-9
@Slf4j  
@Component  
public class CallServiceV1 {  
  private CallServiceV1 self;  
  @Autowired  
  public void setSelf(CallServiceV1 self) {  
    log.info("setSelf {}", self.getClass());  
    this.self = self;  
  }  
  
  
  public void external() {  
    log.info("external");  
    self.internal();  
  }  
  
  public void internal() {  
    log.info("internal");  
  }  
}
```

### 해결 방안 : 지연(LAZY) 조회
```java title:"ApplicationContext 사용 방법" hl:5,7-9
@Slf4j  
@Component  
@RequiredArgsConstructor  
public class CallServiceV2 {  
  private final ApplicationContext applicationContext;  
  
  public CallServiceV2 self() {  
    return applicationContext.getBean(CallServiceV2.class);  
  }  
  
  public void external() {  
    log.info("external");  
    self().internal();  
  }  
  
  public void internal() {  
    log.info("internal");  
  }  
}
```
> `ApplicationContext`은 너무 많은 기능을 제공하기 때문에 딱 Bean 을 꺼내오는 기능을 다시 구현

```java title:"너무 큰 ApplicationContext 사용을 하지 않는 방법" hl:5,7-9
@Slf4j  
@Component  
@RequiredArgsConstructor  
public class CallServiceV2 {  
  private final ObjectProvider<CallServiceV2> callServiceProvider;  
  
  public CallServiceV2 self() {  
    return callServiceProvider.getObject();  
  }  
  
  public void external() {  
    log.info("external");  
    self().internal();  
  }  
  
  public void internal() {  
    log.info("internal");  
  }  
}
```

### 해결 방안 : 구조 변경 (강추)
```java title:"정말 이게 맞다고...?"
@Slf4j  
@Component  
public class InternalService {  
  public void internal() {  
    log.info("internal");  
  }  
}

@Slf4j  
@Component  
@RequiredArgsConstructor  
public class CallServiceV3 {  
  private final InternalService internalService;  
  
  public void external() {  
    log.info("external");  
    internalService.internal();  
  }  
}
```

## 타입 캐스팅 (Dynamic Proxy 의 주의점)
인터페이스 기반으로 프록시 생성하는 JDK [[#Dynamic Proxy]]의 경우 구체 클래스로 타입 캐스팅이 불가능한 한계 존재
타입 캐스팅 문제는 의존관계 주입 시 발생
```java title:"" error:11-16 hl:25-28
@Slf4j
@SpringBootTest
public class ProxyCastingTest {

  @Test
  void jdkProxy() {
    MemberServiceImpl target = new MemberServiceImpl();
    ProxyFactory factory = new ProxyFactory(target);
    factory.setProxyTargetClass(false); // JDK Dynamic Proxy

    // Proxy 를 interface 로 캐스팅 (성공)
    MemberService memberServiceProxy = (MemberService) factory.getProxy();
    // Proxy 를 interface 자식인 MemberServiceImpl 로 캐스팅 (실패) ClassCastException
    Assertions.assertThrows(ClassCastException.class, () -> {
      MemberServiceImpl memberServiceImpl = (MemberServiceImpl) memberServiceProxy;
    });
  }

  @Test
  void cglibProxy() {
    MemberServiceImpl target = new MemberServiceImpl();
    ProxyFactory factory = new ProxyFactory(target);
    factory.setProxyTargetClass(true); // CGLIB Proxy

    // Proxy 를 interface 로 캐스팅 (성공)
    MemberService memberServiceProxy = (MemberService) factory.getProxy();
    // Proxy 를 interface 자식인 MemberServiceImpl 로 캐스팅 (성공)
    MemberServiceImpl memberServiceImpl = (MemberServiceImpl) memberServiceProxy;
  }
}
```
> [[#Dynamic Proxy]]의 경우 구현체를 알지 못하는 문제로 전환 불가

보통 이 문제는 직접 캐스팅 할때는 어라? 하면서 알아차릴 수 있지만 동적 DI를 받는 상황에서는 왜 이런지 알 수 없는 경우가 많음
```java title:"DI 문제" error:2 hl:3
@Slf4j  
@SpringBootTest(properties = {"spring.aop.proxy-target-class=false"}) // JDK Dynamic Proxy (이 경우 interface만 알기 때문에 구체 클래스를 몰라서 ClassCastException 발생)  
//@SpringBootTest(properties = {"spring.aop.proxy-target-class=true"}) // CGLIB Proxy (구체 클래스로 만들기에 정상 동작)  
@Import(ProxyIDAspect.class)  
public class ProxyDITest {  
  @Autowired  
  MemberService memberService;  
  
  @Autowired  
  MemberServiceImpl memberServiceImpl;  
  
  @Test  
  void go() {  
    log.info("memberService: {}", memberService.getClass());  
    log.info("memberServiceImpl: {}", memberServiceImpl.getClass());  
    memberServiceImpl.hello("hello");  
  }  
}
```
