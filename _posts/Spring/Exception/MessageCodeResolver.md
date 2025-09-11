---
aliases: 
tags:
  - Spring
  - 국제화
특징: 이름들을 받으면 code 로 변환 작업 진행
---
# Code 사용의 우선순위
1. errorCode.objectName(target).field
2. errorCode.objectName(target)
3. errorCode.fieldType ex)required.java.lang.String
4. errorCode
5. [[#Bean Validation]] 등록된 message 사용
# MessageCodeResolver 의 error code 처리
구현체로는 DefaultMessageCodeResolver 를 사용
target instance 의 이름이 item 이고 field 의 이름이 itemName 일 경우
```properties
required: 필수 값입니다.
required.item.itemName: 이 아이템의 이름은 필수입니다.
```
```java
bindingResult.rejectValue("itemName", "required");
```

해당 모습처럼 에러를 등록 했을 때 MessageCodeResolver 에서는 최 우선 순위로 target.field.required 를 검색
해당 조건이 없을 경우 required 라는 메시지를 검색

```java
public interface MessageCodesResolver {
// @return 우선 순위로 errorCode로 쓸 이름 리스트 반환
/*
1. errorCode.objectName(target).field
2. errorCode.objectName(target)
3. errorCode.fieldType ex)required.java.lang.String
4. errorCode
*/
	public String[] resolveMessageCodes(
		String errorCode, // 만들 에러 코드
		String objectName, 
		String field, 
		@Nullable Class<?> fieldType
	)
}
```



즉, resolver란 하나의 선택기를 말하는 듯