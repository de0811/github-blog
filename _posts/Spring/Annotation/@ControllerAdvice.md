---
aliases:
  - "@ControllerAdvice"
tags:
  - Spring
  - Annotation
  - Spring/Exception
  - Annotation/Exception
특징: 에러 처리 및 검증 묶음 등록기
---
대상으로 지정한 컨트롤러에 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ExceptionHandler|@ExceptionHandler]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@InitBinder]]를 자동으로 등록하는 기능
묶음 기능이라고 생각하면 편함

[사용 방법 공식 홈페이지](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-advice.html)

## 모든 컨트롤러에 적용 방법
```java
@ControllerAdvice
public class ExampleAdvice1 {}
```
## 특정 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|애노테이션(annotation)]] 적용 방법
```java
@ControllerAdvice(annotations = RestController.class)
public class ExampleAdvice1 {}
```

## 특정 클래스들에 적용 방법
```java
@ControllerAdvice(assignableTypes = {ControllerInterface.class, AbstractController.class})
 public class ExampleAdvice1 {}
```

## 특정 패키지에 적용 방법
```java
@ControllerAdvice("org.example.controllers")
 public class ExampleAdvice2 {}
```

## 특정 클래스 목록에 적용 방법
```java
@ControllerAdvice(assignableTypes = {ControllerInterface.class,
 AbstractController.class})
public class ExampleAdvice3 {}
```


