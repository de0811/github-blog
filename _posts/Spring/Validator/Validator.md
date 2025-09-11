---
aliases:
  - Validator
  - 검증기
tags:
  - Spring
  - Spring/Validation
특징: 검증을 위한 검증기 인터페이스
---
# Validator
- 검증을 위한 검증기 인터페이스
- 고전적인(내부에서도 사용) 검증기를 사용하는 방식
## Bean Validation vs Spring Validator
- [[2.Ref(데이터 및 정보 저장)/Spring/Validator/Bean Validation|Bean Validation]] vs `Validator`
- 스프링에서는 두 가지 검증 방식을 모두 사용할 수 있으며, 각각의 용도가 다름

| 구분         | Spring Validator       | Bean Validation (`@NotBlank` 등) |
| :--------- | :--------------------- | :------------------------------ |
| **검증 방식**  | **코드 기반** (메소드 직접 구현)  | **어노테이션 기반**                    |
| **에러 메시지** | `rejectValue()`로 직접 코딩 | `messages.properties`와 연동       |
| **주요 용도**  | **복합 룰 검증** (비즈니스 로직)  | **단일 필드 검증** (데이터 형식)           |
| **결론**     | 복잡한 비즈니스 검증에 적합        | 보편적인 데이터 형식/포맷 검증에 적합           |

> [!tip] 두 방식은 함께 사용 가능
> [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Validated-@Valid|@Validated]] 를 통해 [[2.Ref(데이터 및 정보 저장)/Spring/Validator/Bean Validation|Bean Validation]] 을 먼저 적용하고, [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@InitBinder|@InitBinder]] 로 등록한 `Spring Validator`를 추가로 동작시킬 수 있음

## 직접 작성 방법
- 검증기를 만드는 방법
- 해당 기능을 사용하여 [[2.Ref(데이터 및 정보 저장)/Spring/Validator/Bean Validation|Bean Validation]] 사용
```java title:"인터페이스 원형"
public interface Validator {
  boolean supports(Class<?> var1); // 해당 클래스가 해당 검증기가 처리할 수 있는지 확인
  void validate(Object var1, Errors var2); // 검증기 기능 동작
}
```

```java title:"ItemValidator.java 작성 예제"
@Component
public class ItemValidator implements Validator {

    // 이 Validator가 지원하는 클래스인지 확인
    @Override
    public boolean supports(Class<?> clazz) {
        return Item.class.isAssignableFrom(clazz);
    }

    // 실제 검증 로직
    @Override
    public void validate(Object target, Errors errors) {
        Item item = (Item) target;

        // 필드 에러 (특정 필드에 대한 검증)
        if (!StringUtils.hasText(item.getItemName())) {
            // "itemName" 필드에 대해 "required" 에러 코드를 추가
            errors.rejectValue("itemName", "required");
        }
        if (item.getPrice() == null || item.getPrice() < 1000 || item.getPrice() > 1000000) {
            errors.rejectValue("price", "range", new Object[]{1000, 1000000}, null);
        }

        // 글로벌 에러 (여러 필드를 조합한 복합 룰 검증)
        if (item.getPrice() != null && item.getQuantity() != null) {
            int resultPrice = item.getPrice() * item.getQuantity();
            if (resultPrice < 10000) {
                // 특정 필드가 아닌 객체 전체에 대한 에러
                errors.reject("totalPriceMin", new Object[]{10000, resultPrice}, null);
            }
        }
    }
}
```
>[[2.Ref(데이터 및 정보 저장)/Spring/Validator/BindingResult|BindingResult]] 는 `Errors`의 자식 클래스이므로, `Errors`를 파라미터로 사용 가능
## Validator 적용 방법
- [[#특정 컨트롤러에서 사용하는 방법]]
- [[# Global Validator Interface 등록 방법]]
- [[#Bean Validation 사용]]
### 특정 컨트롤러에서 사용하는 방법
```java title:"특정 컨트롤러에서 사용할 수 있도록 등록" hl:8,14
@Controller
@RequiredArgsConstructor
public class ItemController {

    private final ItemValidator itemValidator;

    // 이 컨트롤러가 호출될 때마다 dataBinder에 검증기를 추가
    @InitBinder
    public void init(WebDataBinder dataBinder) {
        dataBinder.addValidators(itemValidator);
    }

    @PostMapping("/add")
    public String addItem(@Validated @ModelAttribute Item item, BindingResult bindingResult) {
        // @Validated가 붙으면, @InitBinder에 등록된 ItemValidator가 자동으로 실행됨
        if (bindingResult.hasErrors()) {
            return "form";
        }
        // ... 성공 로직
    }
}
```

### Global Validator 등록 방법
- 모든 컨트롤러에 동일한 검증기를 적용하고 싶을 때 사용
- [[2.Ref(데이터 및 정보 저장)/Spring/WebMvcConfigurer#Global Validator 등록 방법|WebMvcConfigurer]] 를 구현하여 등록
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Validated-@Valid|@Validated]] 어노테이션들을 이용해 사용 가능
- 단점으로 `getValidator`함수를 통해서 하나만 등록할 수 있음
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public Validator getValidator() {
        return new ItemValidator();
    }
}
```
```java title:""
@SpringBootApplication
 public class ItemServiceApplication implements WebMvcConfigurer {

     public static void main(String[] args) {
         SpringApplication.run(ItemServiceApplication.class, args);

}

@Override public Validator getValidator() { 
  return new ItemValidator();
  }
}
```
- 다중으로 할 방법으로는 여러 `Validator`를 하나로 묶는 방법 뿐
```java
@Component
public class MainValidator implements Validator {

    private final ItemValidator itemValidator = new ItemValidator();
    private final MemberValidator memberValidator = new MemberValidator();

    @Override
    public boolean supports(Class<?> clazz) {
        // Item 또는 Member 클래스를 지원한다고 명시
        return Item.class.isAssignableFrom(clazz) || Member.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        // 넘어온 객체의 타입에 따라 적절한 Validator에게 검증을 위임
        if (target instanceof Item) {
            itemValidator.validate(target, errors);
        } else if (target instanceof Member) {
            memberValidator.validate(target, errors);
        }
    }
}

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public Validator getValidator() {
        return new MainValidator();
    }
}
```