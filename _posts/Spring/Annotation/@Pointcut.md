---
aliases:
  - "@Pointcut"
tags:
  - Spring
  - Spring/공통처리
  - Spring/공통관심사
  - Annotation
특징: 
---
# @Pointcut
다른 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Around]] 에서도 사용해야할 경우 사용
외부에 pointcut 을 빼서 사용 하는 방법도 존재
- 반환 타입은 void 로 설정 필요
- 코드 내용은 비워두기
```java title:"@Pointcut 사용방법"
@Slf4j  
@Aspect  
public class AspectV2 {  
  @Pointcut("execution(* hello.aop.order..*(..))")  
  public void allOrder(){} // pointcut signature  
  
  @Around("allOrder()")  
  public Object doLog(ProceedingJoinPoint joinPoint) throws Throwable {  
    log.info("AspectV1.doLog() Start");  
    log.info("joinPoint.getSignature().toShortString(): {}", joinPoint.getSignature().toShortString());  
    try {  
      return joinPoint.proceed();  
    } finally {  
      log.info("AspectV1.doLog() End");  
    }  
  }  
  
  @Around("allOrder()")  
  public Object doLog2(ProceedingJoinPoint joinPoint) throws Throwable {  
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


## pointcut 따로 모아서 사용하기
```java title:"pointcut 따로 모으기"
public class Pointcuts {  
  // hello.aop.order 패키지와 하위  
  @Pointcut("execution(* hello.aop.order..*(..))")  
  public void allOrder(){} // pointcut signature  
  // 클래스 이름이 *Service 클래스  
  @Pointcut("execution(* *..*Service.*(..))")  
  public void allService(){} // pointcut signature  
  // hello.aop.order 패키지와 하위 패키지 이면서 클래스 이름 패턴이 *Service 인 클래스의 모든 메서드에 적용  
  @Pointcut("allOrder() && allService()")  
  public void allOrderAndService(){} // pointcut signature  
}
```

```java title:"따로 모은 Pointcut 사용 방법"
@Slf4j  
@Aspect  
public class AspectV4Pointcut {  
   
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
```



# 포인트컷 지시자
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Pointcut|@Pointcut]] 
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Around|@Around]]
`AspectJExpressionPointcut`
- `execution` : 메소드 실행 조인 포인트를 매칭 스프링 AOP에서 가장 많이 사용하고, 기능도 복잡
	- [[2.Ref(데이터 및 정보 저장)/개발 이론/Parameter|파라메터]]는 부모타입으로 작성 시 선택되지 않는다는데 잘 됨
	- `execution(modifiers-pattern? ret-type-pattern declaring-type-pattern?name-pattern(param-pattern) throws-pattern?)`
	- `execution(접근제어자? 반환타입 선언타입?메서드이름(파라미터) 예외?)`
- `within` : 특정 타입 내의 조인 포인트를 매칭(표현식에 부모 타입 지정 불가능)
- `args` : 인자가 주어진 타입의 인스턴스인 조인 포인트
	- 런타임에 전달된 인수로 판단, 상속된 클래스의 파라메타라면 부모 타입을 적어도 검색해줌
	- 단독 사용 불가(`execution` 등 섞어서 사용 필요)
- `this` : 스프링 빈 객체(스프링 AOP 프록시)를 대상으로 하는 조인 포인트 
	- [[#Dynamic Proxy]] 적용 상태에서 부모 interface 를 대상으로 할 경우 적용되지 않음
	- 적용 타입 하나를 정확하게 지정 필요
	- ==확인해보니 this와 target의 차이를 알 수 없었음==
- `target` : Target 객체(스프링 AOP 프록시가 가리키는 실제 대상)를 대상으로 하는 조인 포인트
	- 적용 타입 하나를 정확하게 지정 필요
	- ==확인해보니 this와 target의 차이를 알 수 없었음==
- `@target` : 실행 객체의 클래스에 주어진 타입의 애노테이션이 있는 조인 포인트 
	- 자식과 부모 모두 조인 포인트로 적용
	- 단독 사용 불가(`execution` 등 섞어서 사용 필요)
- `@within` : 주어진 애노테이션이 있는 타입 내 조인 포인트  
	- 대상이 작성한 삼수만 조인 포인트로 적용 (부모가 만든 함수는 조인 포인트 대상 아님)
- `@annotation` : 메서드가 주어진 애노테이션을 가지고 있는 조인 포인트를 매칭  
```java title:"@annotation 사용법"
@Slf4j  
@Import(AtAnnotationTest.AtAnnotationAspect.class)  
@SpringBootTest  
public class AtAnnotationTest {  
  @Autowired  
  MemberService memberService;  
  @Test  
  void success() {  
    log.info("memberService Proxy: {}", memberService.getClass());  
    memberService.hello("helloA");  
  }  
  
  @Aspect  
  static class AtAnnotationAspect {  
    @Around("@annotation(hello.aop.order.aop.member.annotation.MethodAop)")  
    public Object execute(ProceedingJoinPoint joinPoint) throws Throwable {  
      log.info("[AtAnnotationAspect] execute");  
      return joinPoint.proceed();  
    }  
  }  
}
```
- `@args` : 전달된 실제 인수의 런타임 타입이 주어진 타입의 애노테이션을 갖는 조인 포인트 
	- 단독 사용 불가(`execution` 등 섞어서 사용 필요)
- `bean` : 스프링 전용 포인트컷 지시자, 빈의 이름으로 포인트컷을 지정
	- `{java icon} @Around("bean(orderService) || bean(*Repository)")`


`execution(modifiers-pattern? ret-type-pattern declaring-type-pattern?name-pattern(param-pattern) throws-pattern?)`
`execution(접근제어자? 반환타입 선언타입?메서드이름(파라미터) 예외?)`
- `?` 생략할 수 있는 것
- `*` : 패턴 지정

- `.` : 정확하게 해당 위치의 패키지
- `..` : 해당 위치의 패키지와 그 하위 패키지도 포함

```java title:"포인트컷 지시자 예제"
@Slf4j  
public class ExecutionTest {  
  AspectJExpressionPointcut pointcut = new AspectJExpressionPointcut();  
  Method method;  
  interface MemberService {  
    void hello(String name);  
  }  
  static class MemberServiceImpl implements MemberService {  
    @Override  
    public void hello(String name) {  
      log.info("hello() {}", name);  
    }  
    public void internal(String name) {  
      log.info("internal() {}", name);  
    }  
  }  
  @BeforeEach  
  void setUp() throws NoSuchMethodException {  
    method = MemberServiceImpl.class.getMethod("hello", String.class);  
  }  
  
  @Test  
  void printMethod() {  
    //public java.lang.String hello.aop.order.aop.member.MemberServiceImpl.hello(java.lang.String)  
    log.info("method: {}", method);  
  }  
  
  @Test  
  @DisplayName("hello 메서드 완전 일치")  
  void exactMatch() {  
    //public java.lang.String hello.aop.order.aop.member.MemberServiceImpl.hello(java.lang.String)  
    pointcut.setExpression("execution(String hello.aop.order.aop.member.MemberServiceImpl.hello(java.lang.String))");  
    Assertions.assertTrue(pointcut.getClassFilter().matches(MemberServiceImpl.class));  
  }  
  
  @Test  
  @DisplayName("모든 메서드")  
  void allMatch() {  
    pointcut.setExpression("execution(* *(..))");  
    Assertions.assertTrue(pointcut.getClassFilter().matches(MemberServiceImpl.class));  
  }  
  
  @Test  
  @DisplayName("he로 시작하는 메서드")  
  void nameMatch() {  
    pointcut.setExpression("execution(* he*(..))");  
    Assertions.assertTrue(pointcut.getClassFilter().matches(MemberServiceImpl.class));  
  }  
  
  @Test  
  @DisplayName("hello 패키지와 하위 패키지에 속한 모든 클래스의 모든 메서드")  
  void nameMatch1() {  
    pointcut.setExpression("execution(* hello..*.*(..))");  
    Assertions.assertTrue(pointcut.getClassFilter().matches(MemberServiceImpl.class));  
  }  
  
  @Test  
  @DisplayName("MemberServiceImpl 클래스의 모든 메서드")  
  void typeExacMatch() {  
    pointcut.setExpression("execution(* hello.aop.order.aop.member.MemberServiceImpl.*(..))");  
    Assertions.assertTrue(pointcut.getClassFilter().matches(MemberServiceImpl.class));  
  }  
  
  @Test  
  @DisplayName("MemberService와 상속 받는 클래스의 모든 메서드")  
  void typeExacMatch1() {  
    pointcut.setExpression("execution(* hello.aop.order.aop.member.MemberService.*(..))");  
    Assertions.assertTrue(pointcut.getClassFilter().matches(MemberServiceImpl.class));  
  }  
  
  @Test  
  @DisplayName("MemberService 상속 받은 클래스에서 상속받지 않은 함수는 매치되지 않음")  
  void typeMatchInternal() throws NoSuchMethodException {  
    pointcut.setExpression("execution(* hello.aop.order.aop.member.MemberService.*(..))");  
    Method internal = MemberServiceImpl.class.getMethod("internal", String.class);  
    Assertions.assertFalse(pointcut.getMethodMatcher().matches(internal, MemberServiceImpl.class));  
  }  
  
  /*  
  (String) : String 타입의 파라메터를 받는 메서드  
  () : 파라메터를 받지 않는 메서드  
  (*) : 하나의 파라메터를 받는 메서드  
  (*, *) : 두 개의 파라메터를 받는 메서드  
  (..) : 모든 파라메터를 받는 메서드  
  (String, ..) : 첫 번째 파라메터는 String 타입이고 나머지 파라메터는 어떤 타입이든 상관 없는 메서드  
   */  
  @Test  
  @DisplayName("하나의 파라메터만 받는 메서드")  
  void argsMatch() {  
    pointcut.setExpression("execution(* *(*))");  
    Assertions.assertTrue(pointcut.getClassFilter().matches(MemberServiceImpl.class));  
  }  
  
  @Test  
  @DisplayName("(), (Xxx), (Xxx, Xxx) 모든 형태의 파라메터를 받는 메서드")  
  void argsMatchAll() {  
    pointcut.setExpression("execution(* *(..))");  
    Assertions.assertTrue(pointcut.getClassFilter().matches(MemberServiceImpl.class));  
  }  
  
  @Test  
  @DisplayName("String 타입의 파라메터를 받는 메서드 (String), (String, Xxx), (String, ..) 모두 매치됨")  
  void argsMatchString() {  
    pointcut.setExpression("execution(* *(String, ..))");  
    Assertions.assertTrue(pointcut.getClassFilter().matches(MemberServiceImpl.class));  
  }  
  
  @Test  
  @DisplayName("파라메터 부모 타입으로 매치")  
  void argsMatchDynamic() {  
    // args  
    pointcut.setExpression("args(String)");  
    Assertions.assertTrue(pointcut.getClassFilter().matches(MemberServiceImpl.class));  
    pointcut.setExpression("args(Object)");  
    Assertions.assertTrue(pointcut.getClassFilter().matches(MemberServiceImpl.class));  
    pointcut.setExpression("args(java.io.Serializable)");  
    Assertions.assertTrue(pointcut.getClassFilter().matches(MemberServiceImpl.class));  
  
    // execution  
    pointcut.setExpression("execution(* *(String))");  
    Assertions.assertTrue(pointcut.getClassFilter().matches(MemberServiceImpl.class));  
    pointcut.setExpression("execution(* *(Object))");  
    Assertions.assertTrue(pointcut.getClassFilter().matches(MemberServiceImpl.class));  
    pointcut.setExpression("execution(* *(java.io.Serializable))");  
    Assertions.assertTrue(pointcut.getClassFilter().matches(MemberServiceImpl.class));  
  }  
  
}
```


## 각종 매개변수 전달 방법

```java title:"기본 환경 구성 상태"
@Target(ElementType.TYPE)  
@Retention(RetentionPolicy.RUNTIME)  
public @interface ClassAop {  
}

@Target(ElementType.METHOD)  
@Retention(RetentionPolicy.RUNTIME)  
public @interface MethodAop {  
  String value();  
}

public interface MemberService {  
  public String hello(String param);  
}

@ClassAop  
@Component  
public class MemberServiceImpl implements MemberService {  
  @Override  
  @MethodAop("test value")  
  public String hello(String param) {  
    return "ok";  
  }  
  public String internal(String param) {  
    return "internal";  
  }  
}
```

```java title:"매개변수 전달 방법"
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

    // 인자 받기
    @Around("alloMember() && args(arg, ..)")
    public Object argsType0(ProceedingJoinPoint joinPoint, Object arg) throws Throwable {
      Object arg1 = joinPoint.getArgs()[0];
      log.info("[argsType0]{} arg={}", joinPoint.getSignature().toShortString(), arg1);
      return joinPoint.proceed();
    }

    // 인자 타입 지정
    @Before("alloMember() && args(arg, ..)")
    public void argsType1(JoinPoint joinPoint, String arg) {
      log.info("[argsType1]{} arg={}", joinPoint.getSignature().toShortString(), arg);
    }

    // 프록시 객체를 전달
    @Before("alloMember() && this(obj)")
    public void logThis(JoinPoint joinPoint, Object obj) {
      log.info("[logThis]{} obj={}", joinPoint.getSignature().toShortString(), obj);
    }

    // 실제 대상 객체 전달
    @Before("alloMember() && target(obj)")
    public void logTarget(JoinPoint joinPoint, Object obj) {
      log.info("[logTarget]{} obj={}", joinPoint.getSignature().toShortString(), obj);
    }

    // 타겟 객체의 클래스에 선언된 어노테이션 전달
    @Before("alloMember() && @target(annotation)")
    public void atTargetAnnotation(JoinPoint joinPoint, ClassAop annotation) {
      log.info("[atTargetAnnotation]{} annotation={}", joinPoint.getSignature().toShortString(), annotation);
    }

    // 타겟 객체의 클래스에 선언된 어노테이션 전달
    @Before("alloMember() && @within(annotation)")
    public void atWithinAnnotation(JoinPoint joinPoint, ClassAop annotation) {
      log.info("[atWithinAnnotation]{} annotation={}", joinPoint.getSignature().toShortString(), annotation);
    }

    // 메서드에 선언된 어노테이션
    @Before("alloMember() && @annotation(annotation)")
    public void atAnnotation(JoinPoint joinPoint, MethodAop annotation) {
      log.info("[atAnnotation]{} annotation.value={}", joinPoint.getSignature().toShortString(), annotation.value());
    }
  }
}
```
