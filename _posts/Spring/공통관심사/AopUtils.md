---
aliases:
  - AopUtils
tags:
  - Spring
  - Spring/공통관심사
  - Spring/공통처리
특징: 
---
# AopUtils
```java
public abstract class AopUtils {
  // AOP 프록시인지 확인
  public static boolean isAopProxy(@Nullable Object object);
  // JDK 동적 프록시인지 확인
  public static boolean isJdkDynamicProxy(@Nullable Object object);
  // CGLIB 프록시인지 확인
  public static boolean isCglibProxy(@Nullable Object object);
  // 후보 객체의 타겟 클래스 식별
  public static Class<?> getTargetClass(Object candidate);
  // 메소드와 타겟 타입에 대해 호출 가능한 메소드 선택
  public static Method selectInvocableMethod(Method method, @Nullable Class<?> targetType);
  // equals 메소드인지 확인
  public static boolean isEqualsMethod(@Nullable Method method);
  // hashCode 메소드인지 확인
  public static boolean isHashCodeMethod(@Nullable Method method);
  // toString 메소드인지 확인
  public static boolean isToStringMethod(@Nullable Method method);
  // finalize 메소드인지 확인
  public static boolean isFinalizeMethod(@Nullable Method method);
  // 메소드와 타겟 클래스에 대해 가장 구체적인 메소드 가져오기
  public static Method getMostSpecificMethod(Method method, @Nullable Class<?> targetClass);
  // Pointcut이 타겟 클래스에 적용 가능한지 확인
  public static boolean canApply(Pointcut pc, Class<?> targetClass);
  // Pointcut이 타겟 클래스에 적용 가능한지 확인 (Introduction이 있는 경우)
  public static boolean canApply(Pointcut pc, Class<?> targetClass, boolean hasIntroductions);
  // Advisor가 타겟 클래스에 적용 가능한지 확인
  public static boolean canApply(Advisor advisor, Class<?> targetClass);
  // Advisor가 타겟 클래스에 적용 가능한지 확인 (Introduction이 있는 경우)
  public static boolean canApply(Advisor advisor, Class<?> targetClass, boolean hasIntroductions);
  // 후보 Advisor 중에서 주어진 클래스에 적용 가능한 Advisor 찾기
  public static List<Advisor> findAdvisorsThatCanApply(List<Advisor> candidateAdvisors, Class<?> clazz);
  // 주어진 타겟, 메소드, 인자를 사용하여 Joinpoint 호출
  @Nullable
  public static Object invokeJoinpointUsingReflection(@Nullable Object target, Method method, Object[] args) throws Throwable;
}
```