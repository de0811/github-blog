---
aliases:
  - i18n
  - MessageSource
tags:
  - Spring
  - 국제화
  - i18n
특징:
---
# MessageSource Interface
```java
public interface MessageSource {  
  @Nullable  
  String getMessage(String var1, @Nullable Object[] var2, @Nullable String var3, Locale var4);  
  
  String getMessage(String var1, @Nullable Object[] var2, Locale var3) throws NoSuchMessageException;  
  
  String getMessage(MessageSourceResolvable var1, Locale var2) throws NoSuchMessageException;  
}
```
# Bean 등록 방법
메시지를 관리하는 빈
기본적인 경로는 `/resources/messages.properties` 위치에 등록
```java
@Bean  
public MessageSource messageSource() {  
  ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();  
  // 국제화로 사용하려는 properties 이름 등록
  // messages.properties, errors.properties  
  messageSource.setBasenames("messages", "errors"); 
  messageSource.setDefaultEncoding("utf-8");  
  return messageSource;  
}
```

[[2.Ref(데이터 및 정보 저장)/Spring/Spring boot]] 의 경우 MessageSource 를 자동으로 등록
[다른 설정 방법 확인](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html)
`spring.messages` 검색

> [!example]  basename 설정 방법
```properties
spring.messages.basename=messages,errors, config.i18n.messages
```

# 사용 방법
```java
messageSource.getMessage("hello", null, null); // default 로 선택된 언어 사용
messageSource.getMessage("hello", null, Locale.KOREA); // 한국어 사용
messageSource.getMessage("hello", null, Locale.ENGLISH); // 영어 사용
messageSource.getMessage("no_code", null, "기본 메시지", null); // default 사용
messageSource.getMessage("hello.name", new Object[]{"Spring"}, null); // 안녕 {0}
```

# 동작 방법
`LocaleResolver`인터페이스를 이용하여 `Accept-Language` 사용
`AcceptHeaderLocaleResolver` 구현체에서 보통 처리
