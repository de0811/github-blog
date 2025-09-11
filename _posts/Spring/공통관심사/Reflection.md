---
aliases:
  - Reflection
tags:
  - Java
특징: 
---
# Reflection
런타임 중에 클래스의 동작을 검사하거나 조작하는 프로세스
애플리케이션 실행 중에(런타임) 일부 class, 인터페이스, 필드, 메서드 등 변경할 수 있는 기능

객체를 동적으로 생성할수도 있기 때문에 #Spring, `Hibernate`, #Lombok 등 많은 프레임워크에서 `Reflection` 기능을 사용

조작을 위해 우선 클래스 정보를 가져올 수 있어야한다

## 단점
- 지나치게 사용하면 성능 이슈 발생
- 코드를 작성할 때 접근지시자를 정의하였지만 **무시되는 경우도 발생(`default는 public 필드만 접근이 가능하지만 setAccessible(true)로 public 이외 필드도 접근이 가능`)**

# Java.lang.class
[java8 Java.lang.Class](https://docs.oracle.com/javase/8/docs/api/java/lang/Class.html) 해당 라이브러리가 지원하는 API를 볼수 있다
## class 객체 가져오기
- [[#.class]]
- [[#Object.getClass()]]
- [[#Class.forName()]]
### .class
클래스에 `.class` 를 붙여 Class 객체 얻어오기
```java
public class Member{
	private String name;
    private int age;
}

// ...

public static void main(String[] args){
	Class<Member> memberClass = Member.class;
    // ...
}
```
### Object.getClass()
인스턴스를 통해 객체 얻어오기
```java
public class Member{
	private String name;
    private int age;
}

// ...

public static void main(String[] args){
	Member member = new Member();
    member.getClass();
    Class<? extends Member> memberClass = member.getClass();
    // ...
}
```

### Class.forName()
패키지명을 통해서 객체 가져오기
```java
// package: com.example.Member
public class Member{
	private String name;
    private int age;
}

// ...

public static void main(String[] args){
	Class<?> memberClass =Class.forName("com.example.Member");
    // ...
}
```

해당 패키지명이 없을 경우 `ClassNotFoundException` 에러 발생

## 인스턴스 생성 방법
1. `Class` 객체 얻어오기
2. 해당 `Class` 생성자 얻어오기
3. 생성자를 통해 인스턴스 생성

```java
public class Member {

    private String name;
    private int age;

    public Member() {
    }

    public Member(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```
> 테스트할 클래스

### newInstance 사용방법 (java9 까지만 사용 가능)
생성자를 찾지 못한다면 `NoSuchMethodException` 에러 반환
```java
//...
public static void main(String[] args){
	Class<Member> memberClass = Member.class;
    Constructor<Member> noArgConstructor = memberClass.getConstructor();
    Member member = noArgConstructor.newInstance();
}
```
> 파라메타 없는 생성자 호출 방법

```java
public static void main(String[] args){
	Class<Member> memberClass = Member.class;
    Constructor<Member> argConstructor = memberClass.getConstructor(String.Class, int.Class);
    Member member = argConstructor.newInstance("leewoooo", 27);
}
```
> 파라메타가 있는 생성자 호출 방법

## 메소드 실행하기
1. `Class` 객체 얻어오기
2. 해당 `Class에서 method` 얻어오기
3. 얻어온 method를 `invoke()` API를 이용하여 실행하기

함수를 찾지 못한다면 `NoSuchMethodException` 반환

```java
public class Member {
    //...
    public int sum(int left, int right){
        return left + right;
    }
    
    public static int staticSum(int left, int right){
        return left + right;
    }
}
```
> 테스트할 클래스

```java
//...
public static void main(String[] args){
	Class<Member> memberClass = Member.class;
    Method sum = memberClass.getMethod("sum", int.class, int.class)
}
```
> 메소드 불러오기 (이름과 파라메타 정보 필요)

```java
Method sum = memberClass.getMethod("sum", int.class, int.class);
// 실행하기 (실행할 때 static method가 아닌 이상 인스턴스를 지정해야 한다.)
// 만약 인스턴스를 지정하지 않을 경우 NullPointerException가 발생한다.
int result = (int) sum.invoke(memberWithAge, 1, 2);
System.out.println("result = " + result); // 3

Method staticSum = memberClass.getMethod("staticSum", int.class, int.class);
int staticResult = (int) staticSum.invoke(null, 1, 2);
System.out.println("staticResult = " + staticResult); // 3
```
> 사용하기

