---
aliases:
tags:
  - HTTP
  - Spring
---
# Redirect


# Post, Redirect GET
![[Pasted image 20231201142949.png|300]]

## 상황
1. 클라이언트에서는 서버의 상품 등록 API 호출
2. 서버에서는 상품 처리 후 페이지나 상태 값을 다시 전달
3. 클라이언트가 [[새로고침]] 실행 <span style="background:#ff4d4f">(문제 발생)</span>

[[새로고침]]을 하게 되면 이전의 요청인 등록을 게속 실행하게 됨으로 문제가 발생
이 문제를 해결하기 위한 방법으로 Redirect 사용

## 해결 방법
1. 클라이언트에서는 서버의 상품 등록 API 호출
2. 서버에서는 상품 처리 후 `redirect:/...list` 형식으로 목록 또는 아이템을 보라고 전달
3. 클라이언트에서는 서버에서 보낸 redirect 메시지를 보고 해당 API 로 다시 요청
4. 클라이언트의 직전 요청은 서버에서 보낸 redirect 내용에 맞춰 변경 되었기 때문에 다시 [[새로고침]] 하더라도 문제 발생하지 않음

> [!question] 그런데 이 상황은 서버에서 프론트까지 작업할때 일어나는 상황 아닌가?

# Redirect  [[Query String or URL Params or Query Parameters, Path Variable|Query String]]  쓰는 방법
#Spring 
```java
@PostMapping("/add")  
public String saveItemV2(Item item, RedirectAttributes redirectAttributes) {  
  Item savedItem = itemRepository.save(item);  
  redirectAttributes.addAttribute("itemId", savedItem.getId());  
  redirectAttributes.addAttribute("status", true);  
  return "redirect:/basic/items/{itemId}";  
}
```
해당 방법으로 보내게 되면 UrlEncoding 신경쓸 필요가 없음
전달되는 주소는 `/basic/items/3?status=true`이렇게 바뀌어서 전달