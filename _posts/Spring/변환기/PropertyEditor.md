---
aliases:
  - PropertyEditor
tags:
  - Spring
  - Spring/Request
  - Spring/Converter
특징: 
---
# PropertyEditor

`Converter` 가 나오기 전에 사용되던 방법으로 동시성 문제가 있어서 타입을 변환할 때 마다 객체를 계속 생성해야하는 단점이 있어서 사장된 방법
```java title:"@ModelAttribute 의 특정 클래스로 감쌓여있을 경우 해당 이름으로 받는게 아닐때는 사용 필요" hl:4
@PostMapping("/api/shows/{showId}/locations")  
public ResponseEntity<CommonResponse> insertShowLocation(  
  @PathVariable Long showId,  
  @ModelAttribute ShowLocationDto showLocationDto,  
  @RequestPart(name="files", required = false) List<MultipartFile> files  
) throws IOException {  
  ShowLocation showLocation = showService.insertShowLocation(showId, showLocationDto, files);  
  return CommonResponse.createResponseEntity(SERVER_STATE_TYPE.CREATED, showLocation);  
}
```
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RequestPart|@RequestPart]] 로 쓰기에는 `ShowLocationDto` 라는 이름으로 묶어서 보내지 않을 경우 자료를 표현하기에  [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ModelAttribute|@ModelAttribute]] 를 사용했는데 내부적으로 `List<Long>`형태로 전달이 필요할때 사용할 수 밖에 없음

## 해결 방법
```java title:"List<Long> 형태로 변환하는 PropertyEditor"
public class ListLongPropertyEditor extends PropertyEditorSupport {  
  @Override  
  public void setAsText(String text) throws IllegalArgumentException {  
    if (ObjectUtil.isEmpty(text)) {  
      setValue(null);  
    } else {  
      if( text.startsWith("[") && text.endsWith("]") ) {  
        text = text.substring(1, text.length() - 1);  
      }  
      List<Long> longList = Arrays.stream(text.split(","))  
        .map(String::trim)  
        .map(Long::valueOf)  
        .collect(Collectors.toList());  
      setValue(longList);  
    }  }}
```

```java title:"사용 방법"
@InitBinder  
public void initBinder(WebDataBinder binder) {  
  binder.registerCustomEditor(List.class, "managerIds", new ListLongPropertyEditor());  
}
```