---
aliases:
  - "@InitBinder"
tags:
  - Spring
  - Annotation
  - Spring/Validation
특징: Validator를 컨트롤러에 등록
---
# @InitBinder
- [[2.Ref(데이터 및 정보 저장)/Spring/Validator/Validator|Validator]]를 특정한 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Controller|컨트롤러]] 에 등록하는 방법
- **`addValidators()`**: 특정 컨트롤러에서만 사용할 `Validator` 추가
- **`setAllowedFields()`**: 특정 필드만 바인딩을 허용하여 보안 강화 (Mass Assignment 취약점 방지)
- **`registerCustomEditor()`**: 특정 타입에 대한 커스텀 변환 규칙 추가

 ```java
@Controller
public class ItemController {

    // 이 컨트롤러 내에서 @ModelAttribute 객체를 바인딩할 때마다
    // 아래 initBinder 메소드가 먼저 호출되어 WebDataBinder를 설정함
    @InitBinder
    public void init(WebDataBinder dataBinder) {
        // itemValidator를 이 컨트롤러의 기본 검증기로 추가
        dataBinder.addValidators(new ItemValidator());
    }

    @PostMapping("/add")
    public String addItem(@Validated @ModelAttribute Item item, BindingResult bindingResult) {
        // @Validated가 붙으면, initBinder에 등록된 ItemValidator가 자동으로 실행됨
        // ...
    }
}
```
> 등록 방법
