---
aliases:
  - Bean Validation
tags:
  - BeanValidation
  - Spring
  - Spring/Validation
특징:
---
# Bean Validation
- Bean Validation 2.0(JSR-380) 이라는 기술 표준
- 검증 애노테이션과 여러 인터페이스의 모음
- Spring 에서 동작하기 위해서 [[0.New Note/LocalValidatorFactoryBean|LocalValidatorFactoryBean]] 을 통해서 Spring의 [[2.Ref(데이터 및 정보 저장)/Spring/Validator/Validator|Validator]] 인척 동작
- 구현체로는 하이버네이트 자주 사용
> [!info] 하이버네이트 reference
- 공식 사이트: http://hibernate.org/validator/  
- 공식 메뉴얼: https://docs.jboss.org/hibernate/validator/6.2/reference/en-US/html_single/ 
- 검증 애노테이션 모음: https://docs.jboss.org/hibernate/validator/6.2/reference/en-US/html_single/#validator-defineconstraints-spec

## 사용 방법
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Validated-@Valid|@Validated]] 에서 사용 방법 참조를 추천

```java
@Data
public class Item {
    @NotBlank
    private String itemName;
    @NotNull @Range(min = 1000, max = 1000000)
    private Integer price;
}
```

```java
@PostMapping("/add")
public String addItem(@Validated @ModelAttribute Item item, BindingResult bindingResult) {
    // @Validated: Item 객체를 검증하라는 지시
    // BindingResult: 검증 결과를 담을 객체 (반드시 검증 대상 바로 뒤에 위치)

    // 검증 실패 시
    if (bindingResult.hasErrors()) {
        log.info("errors={}", bindingResult);
        return "add-form"; // 에러 메시지와 함께 폼으로 다시 이동
    }

    // 검증 성공 시 로직
    // ...
}
```

## 검증 실패 처리 방식
- [[Content-Type]] 에 따른 데이터가 넘어오는 형태가 달라서 검증 실패시 처리되는 결과가 다름
- [[WebDataBinder]]가 각 필드를 개별적으로 바인딩 처리
	- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ModelAttribute|@ModelAttribute]] , [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RequestParam|@RequestParam]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PathVariable|@PathVariable]] 처럼 필드 단위로 분석하는 것들 
	- `Body`에 담겨진 내용이 `key-value` 쌍으로 넘어옴
	1. `itemName=사과` -> `item.itemName` 필드에 바인딩 (성공)
	2. `price=abc` -> `item.price` (Integer) 필드에 바인딩 시도 (실패)
	3. 실패 사실을 [[2.Ref(데이터 및 정보 저장)/Spring/Validator/BindingResult|BindingResult]] 에 `typeMismatch` 에러로 기록하고, `item.price`는 `null`로 둠
	4. **일단 컨트롤러는 정상 호출**
```Body title:"form 데이터의 전달되는 body 형태"
itemName:qwe
price:1
quantity:1
```
> ex) [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ModelAttribute|@ModelAttribute]] form 데이터의 body 형태

- [[2.Ref(데이터 및 정보 저장)/Spring/변환기/HttpMessageConverter|HttpMessageConverter]]가 전체 텍스트를 객체로 변환 시도
	- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RequestBody|@RequestBody]] , [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ResponseBody|@ResponseBody]] , [[2.Ref(데이터 및 정보 저장)/Spring/HttpEntity|HttpEntity]]
	- `Body`에 담겨진 내용이 텍스트 덩어리로 넘어옴
	1. JSON 텍스트 전체를 `Item`객체로 변환 시작
	2. `"price": "abc"`를 `Integer` 타입으로 변환하려다 **예외(Exception) 발생**
	3. 객체 변환 자체가 실패했으므로, **컨트롤러를 호출하기 전에** 프로세스가 중단되고 400 (Bad Request) 에러를 응답
```Body title:"데이터의 전달되는 body 형태"
itemName:qwe,price:1,quantity:1
```
> ex) [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RequestBody|@RequestBody]] 데이터의 body 형태

## 에러 메시지 관리
### 어노테이션 직접 작성(비추천)
- Bean Validation 등록 시 message [[2.Ref(데이터 및 정보 저장)/개발 이론/Parameter|파라메터]]를 넣을 경우 defaultMessage 로 동작
```java title:"직접 작성 방법"
@Data  
public class Item {  
    private Long id;  
    @NotBlank(message = "1.상품 이름은 필수입니다.")  
    private String itemName;  
    @NotNull(message = "2.가격은 필수입니다.")  
    @Range(min = 1000, max = 1000000)  
    private Integer price;  
    @NotNull(message = "4.수량은 필수입니다.")  
    @Range(min = 1, max = 9999, message = "5.수량은 최대 9,999 까지 허용합니다.")  
    private Integer quantity;
}
```
### `errors.properties` 사용 방법
- `resources/errors.properties` 파일을 생성하면 스프링부트가 자동으로 인식
- 메시지를 한 곳에서 관리 가능하여 유지보수와 [[2.Ref(데이터 및 정보 저장)/Spring/MessageSource|i18n]] 에 유리
```java
# Bean Validation Codes (Level 1)
NotBlank=공백일 수 없습니다
Range=범위를 벗어났습니다. ({2}~{1})

# Custom Codes by Field (Level 2)
NotBlank.item.itemName=상품 이름은 필수입니다
Range.item.price=가격은 {2}원에서 {1}원 사이여야 합니다
```

