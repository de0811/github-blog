---
aliases:
  - "@ModelAttribute"
tags:
  - Annotation
  - Spring
  - Spring/Request
특징: Request
---
# [[Parameter]] 로 사용할 경우
모델에 맞추어 데이터를 적재해주는 기능
GET 방식이나 `application/x-www-form-urlencoded` HTML Form 방식으로 전달되는 경우만 가능
[[@RequestParam]] 으로 사용하지 못하는 모든 것들을 사용
[[@RequestParam]] 과 동일하게 생략이 가능
자동으로 `model.addAttribute` 등록 적용
[[2.Ref(데이터 및 정보 저장)/Spring/ArgumentResolver(HandlerMethodArgumentResolver)]] 지정해둔 타입은 사용하지 않음(기본 제공이기 때문에)
## [[Parameter]] 
### name
`@ModelAttribute("item")` 이런 식으로 이름을 지정하게 되면 model.addAttribute("item", item);
이런 형식으로 저장되게 됨
```java
@PostMapping("/add")
public String addItem(@RequestParam String itemName, 
											@RequestParam long price, 
											Model model) {
	itemRepository.save(item);
	model.addAttribute("item2", item);
	return "basic/item";
}
```
위 소스와 아래 소스는 같은 동작 진행
model.addAttribute 부분이 있고 없음을 중요히 확인
```java
@PostMapping("/add")
public String addItem(@ModelAttribute("item2") Item item) {
	itemRepository.save(item);
	return "basic/item";
}
```
name을 직접적으로 등록하지 않는다면 클래스 이름의 맨 앞글자만 소문자로 바꾸어 model.addAttribute 에 등록
```java
@PostMapping("/add")
public String addItem(@ModelAttribute Item item) {
	itemRepository.save(item);
	return "basic/item";
}
```
즉 이런 소스의 경우 `model.addAttribute("item", item);` 이렇게 처리가 됨

> [!danger] 모델에 맞추어 데이터를 적재할 때 `property` 데이터 형이 다를 경우
> 서버 내부에서는 `BindException` 발생
> 클라이언트에게는 `Bad Request, status=400`에러 발생
## 동작 과정
1. 만들려는 Class 객체를 생성
2. 객체의 property  검색
3. property setter 호출하여 파라미터 값을 입력
- ex) `username` 이면 `setUsername()`함수를 찾아서 호출하여 값 입력

# 함수로 사용할 경우
함수의 반환 타입을 `model.addAttribute()` 동작 진행

```java
@Controller  
@RequestMapping("/form/items")  
@RequiredArgsConstructor  
public class FormItemController {  
  
    private final ItemRepository itemRepository;  
  
    @ModelAttribute("regions")  
    public Map<String, String> regions() {  
        return itemRepository.findAllRegions();  
    }
}
```
함수로 등록을 할 경우 `class` 내부의 모든 컨트롤러에서 자동으로 `model.addAttribute(...)` 등록
```java
@Controller  
@RequestMapping("/form/items")  
@RequiredArgsConstructor  
public class FormItemController {  
  ...
  @GetMapping("/{itemId}")  
public String item(@PathVariable long itemId, Model model) {  
    Item item = itemRepository.findById(itemId);  
    model.addAttribute("item", item);  
    // 이 부분이 자동으로 들어가짐
    model.addAttribute("regions", itemRepository.findAllRegions());
  
    return "form/item";  
}
}
```
소스에서 처럼 `model.addAttribute("regions", itemRepository.findAllRegions());`을 하지 않아도 자동으로 `model`로 등록