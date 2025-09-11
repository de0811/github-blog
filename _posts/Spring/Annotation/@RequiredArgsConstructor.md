---
aliases:
  - "@RequiredArgsConstructor"
tags:
  - Annotation
  - Lombok
  - Annotation/생성자
특징: 생성자
---
# @RequiredArgsConstructor
- final 이 붙은 내부 변수를 바로 받아올 수 있는 생성자를 만듦
```java
@Controller  
@RequiredArgsConstructor  
public class BasicItemController {  
  private final ItemRepository itemRepository;  
}
```