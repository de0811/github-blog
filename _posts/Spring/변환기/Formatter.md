---
aliases:
  - Formatter
tags:
  - Spring
  - Spring/Converter
  - Spring/Request
특징: 문자 To Object | Object To 문자
---
# Formatter
문자를 특정 객체로 또는 객체를 문자로 변환하는 방법
`String To Object` or `Object To String`
`Locale` 데이터가 있는 이유는 각 지역별로 어떻게 표현하겠다 하는게 다를 수 있기 때문에 필요
[Formatter 공식 사이트](https://docs.spring.io/spring-framework/reference/core/validation/format.html)

```java
public interface Formatter<T> extends Printer<T>, Parser<T> {  
	@Overwrite //Printer
	String print(T object, Locale locale);
	@Overwrite //Parser
	T parse(String text, Locale locale) throws ParseException;
}
```

## 선언 예제
```java
 @Slf4j
 public class MyNumberFormatter implements Formatter<Number> {
     @Override
     public Number parse(String text, Locale locale) throws ParseException {
         log.info("text={}, locale={}", text, locale);
         NumberFormat format = NumberFormat.getInstance(locale);
         return format.parse(text);
}
     @Override
     public String print(Number object, Locale locale) {
         log.info("object={}, locale={}", object, locale);
         return NumberFormat.getInstance(locale).format(object);
     }
}
```
> 각 지역별로 숫자를 표현하는 방법을 format 형식으로 나타냄

### 사용
- `Formatter` interface
	- 일반적으로 사용할 수 있는 기본적인 포메터
- `AnnotationFormatterFactory` interface
	- 필드의 타입이나 어노테이션의 정보를 사용할 수 있는 포메터
#### 직접 사용방법
```java
class MyNumberFormatterTest {
     MyNumberFormatter formatter = new MyNumberFormatter();
     @Test
     void parse() throws ParseException {
         Number result = formatter.parse("1,000", Locale.KOREA);
assertThat(result).isEqualTo(1000L); //Long 타입 주의 }
     @Test
     void print() {
         String result = formatter.print(1000, Locale.KOREA);
         assertThat(result).isEqualTo("1,000");
     }
}
```
Formatter 는 직접 사용하는 방법과 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|애노테이션(annotation)]] 기반으로 사용하는 방법도 있다.
#### 애노테이션 사용방법
[애노테이션 사용방법 공식 페이지](https://docs.spring.io/spring-framework/reference/core/validation/format.html#format-CustomFormatAnnotations)
```java
public interface AnnotationFormatterFactory<A extends Annotation> {
  // 사용하려는 데이터 타입
  Set<Class<?>> getFieldTypes();
  Printer<?> getPrinter(A annotation, Class<?> fieldType);
  Parser<?> getParser(A annotation, Class<?> fieldType);
}
```

# DefaultFormattingConversionService
포메터를 등록하고 컨버전처럼 사용하는 클래스
```java
public class FormattingConversionServiceTest {
     @Test
     void formattingConversionService() {
         DefaultFormattingConversionService conversionService = new
 DefaultFormattingConversionService();
//컨버터 등록
conversionService.addConverter(new StringToIpPortConverter()); conversionService.addConverter(new IpPortToStringConverter()); //포맷터 등록
conversionService.addFormatter(new MyNumberFormatter());
//컨버터 사용
         IpPort ipPort = conversionService.convert("127.0.0.1:8080",
 IpPort.class);
assertThat(ipPort).isEqualTo(new IpPort("127.0.0.1", 8080)); //포맷터 사용
assertThat(conversionService.convert(1000,
 String.class)).isEqualTo("1,000");
         assertThat(conversionService.convert("1,000",
 Long.class)).isEqualTo(1000L);
     }
}
```

## `FormattingConversionService`
포메터를 등록하면 컨버터처럼 사용할 수 있도록 하는 인터페이스

## 등록 방법
![[2.Ref(데이터 및 정보 저장)/Spring/WebMvcConfigurer#0.New Note/Formatter Formatter 등록 방법]] 

