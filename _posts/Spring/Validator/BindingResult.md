---
aliases:
  - BindingResult
tags:
  - Spring/Validation
  - Spring
특징:
---
# BindingResult
검증 결과를 저장하는 인터페이스
구현체로 `BeanPropertyBindingResult` 존재
[[@ModelAttribute]] 또는 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RequestParam|@RequestParam]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PathVariable|@PathVariable]] 들을 사용하는 [[0.New Note/WebDataBinder|WebDataBinder]]이 분석하는 뒤에 작성 되어야 객체의 검증 후 검증 상태를 담을 수 있음
문제가 발생 시 일단 컨트롤러의 `BindingResult` 에 담고 컨트롤러를 진행
아래 사용 중인 `codes` 모두 [[2.Ref(데이터 및 정보 저장)/Spring/Exception/MessageCodeResolver|MessageCodeResolver]] 사용
## 에러 등록 방법
- [[#BindingResult.addError()]] 방법
- [[#BindingResult.rejectValue(), BindingResult.reject()]] 방법
- 검증기를 사용하는 방법
### BindingResult.addError()
FieldError 와 ObjectError 를 이용하여 에러 등록 방법
#### FieldError
```java
public FieldError(
	String objectName, // Object 이름 (사용하는 인스턴스의 이름)
	String field, // Object field 의 이름
	@Nullable Object rejectedValue, // 반환
	boolean bindingFailure, // 데이터 형 문제라면 true, 아니라면 false
	@Nullable String[] codes, // 국제화 메세지 코드(MessageCodeResolver)
	@Nullable Object[] arguments, // 메세지에서 사용하는 인자
	@Nullable String defaultMessage // 기본으로 나올 오류 메세지
	)
```
- `String[] codes` 부분이 배열인 이유는 첫번째 배열의 코드가 없다면 두번째를 사용하기 위해 존재
#### ObjectError
```java
public ObjectError(
	String objectName, // Object 이름 (사용하는 인스턴스의 이름)
	@Nullable String[] codes, // 국제화 메세지 코드(MessageCodeResolver)
	@Nullable Object[] arguments, // 메세지에서 사용하는 인자
	@Nullable String defaultMessage // 기본으로 나올 오류 메세지
)
```


### BindingResult.rejectValue(), BindingResult.reject()
FieldError, ObjectError 다루기가 번거로워 만든 방법
```java
public void rejectValue(
	@Nullable String var1, // field
	String var2, // MessageCodeResolver 를 위한 errorCode
	@Nullable Object[] var3, // arguments: errorCode 에서 사용할 argument
	@Nullable String var4 // defaultMessage 
);
```
### 검증기 사용
[[2.Ref(데이터 및 정보 저장)/Spring/Validator/Validator|Validator]]