---
aliases:
  - "@Validated"
  - "@Valid"
tags:
  - Annotation
  - Spring/Validation
특징: 검증
---
# @Validated vs @Valid
- 둘 다 [[2.Ref(데이터 및 정보 저장)/Spring/Validator/Bean Validation|Bean Validation]] 을 사용하여 객체의 유효성을 검증하도록 지시하는 어노테이션
## ⚙️ 의존성 설정
```gradle title:"gradle 의존성 설정"
implementation 'org.springframework.boot:spring-boot-starter-validation'
```
```xml title:"pom.xml mvn 의존성 설정"
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```
## 🚨Controller Layer / Service Layer 사용의 차이
- Controller Layer
	- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RequestParam|@RequestParam]] , [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RequestBody|@RequestBody]] , [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ModelAttribute|@ModelAttribute]]  등으로 받은 요청 파라미터를 검증할 때 사용
	- 메소드 파라미터 앞에 `@Validated` 또는 `@Valid`를 붙이는 것이 일반적
- Service Layer
	- AOP를 이용해 서비스 계층의 메소드 파라미터를 검증할 때 사용
	- 이 경우, 클래스 레벨에 **@Validated**를, 메소드 파라미터에 **@Valid**를 붙여야 함
	- 하지만 대부분의 웹 애플리케이션에서는 컨트롤러에서 1차 검증을 하므로, 서비스 계층에서 이 기능을 사용하는 경우는 드뭄
```java title:"서비스 계층에서 사용하는 방법"
@Service
@Validated
public class UserService {
    public void createUser(@Valid User user) {
        // 유효성 검사가 완료된 후 비즈니스 로직 수행
    }
}
```
## 공통점 : 검증 실행 방법
- 가장 일반적인 사용 사례는 컨트롤러 메소드의 파라미터를 검증하는 것 
  이때는 `@Valid`와 `@Validated` 중 어느 것을 사용해도 동일하게 동작
```java title:"동일한 동작"
@PostMapping("/add")
public String addItem(@Validated @ModelAttribute Item item, BindingResult bindingResult) {
    // ...
}

@PostMapping("/add")
public String addItem(@Valid @ModelAttribute Item item, BindingResult bindingResult) {
    // 위와 동일하게 동작
}
```
## 차이점 : 검증 그룹(group) 기능, 중첩 검증 기능

| 기능        | @Valid            | @Validated (Spring)   |
| --------- | ----------------- | --------------------- |
| 제공 주체     | Java 표준 (JSR-303) | Spring Framework      |
| groups 기능 | ❌ 미지원             | ✅ 지원                  |
| 중첩 검증     | ✅ 지원 (DTO 필드에 사용) | ❌ 미지원 (@Valid와 조합 필요) |
- **`@Valid`**
    - Java 표준 어노테이션 (JSR-303)
    - **`groups` 기능 미지원**
    - **중첩 검증 기능 지원**
- **`@Validated`**
    - 스프링 프레임워크 전용 어노테이션
    - **`groups` 기능 지원**
    - **중첩 검증 기능 미지원**
### `@Validated`의 `groups` 기능 사용 방법
```java title:"group 구분으로 사용할 인터페이스 생성"
public interface SaveCheck {  }
public interface UpdateCheck {  }
```
```java title:"@Validated의 groups 기능 사용 예제"
// Controller
// SaveCheck 그룹에 속한 검증 규칙만 실행
public String addItem(@Validated(SaveCheck.class) @ModelAttribute Item item, ...) {
    // ...
}

// DTO
public class Item {
    @NotNull(groups = UpdateCheck.class) // 수정 시에만 id가 필수
    private Long id;
    
    @NotBlank(groups = {SaveCheck.class, UpdateCheck.class}) // 등록, 수정 모두 이름 필수
    private String itemName;
}
```
### `@Valid`중첩 검증 기능
```java
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

public class User {

    @NotNull
    private String username;

    @Valid
    @NotNull
    private Address address;

    // getters and setters
}

public class Address {

    @NotNull
    private String city;

    // getters and setters
}

import org.springframework.validation.annotation.Validated;

public void createUser(@Valid User user) {
    // User와 Address에 대한 유효성 검사 수행
}
```
### `@Validated`의 `groups` 기능 사용 과 `@Valid`중첩 검증 기능 모두 사용하는 방법
```java title:"group 기능과 중첩 기능 모두 사용하는 예제" hl:8,19
public class User {
    @NotNull(groups = UpdateCheck.class) // 수정 시에만 id 검증
    private Long id;

    @NotBlank(groups = {SaveCheck.class, UpdateCheck.class})
    private String username;

    @Valid // Address 객체 내부도 검증하라고 지시
    @NotNull(groups = {SaveCheck.class, UpdateCheck.class})
    private Address address;
}

public class Address {
    @NotBlank // groups가 없으므로 항상 검증
    private String city;
}

@PutMapping("/user")
public void updateUser(@Validated(UpdateCheck.class) @RequestBody User user) {
    // ...
}
```
## 테스트 방법
#JUnit 
스프링과 통합되면서 이렇게 작성할 필요는 없지만 Test 에서는 사용하는 방법
```java
@Test
void beanValidation() {
  ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
  Validator validator = factory.getValidator();

  Item item = new Item();
  item.setItemName(" ");
  item.setPrice(0);
  item.setQuantity(10000);

  // 검증
  Set<ConstraintViolation<Item>> violations = validator.validate(item);
  for (ConstraintViolation<Item> violation : violations) {
    System.out.println("violation = " + violation);
    System.out.println("violation.getMessage() = " + violation.getMessage());
  }
}
```
