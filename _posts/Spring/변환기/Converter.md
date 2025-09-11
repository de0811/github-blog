---
aliases:
  - Converter
tags:
  - Spring
  - Spring/Request
  - Spring/Converter
특징:
---
# `Converter`
입력과 출력 타입에 제한이 없는 범용 타입 변환 기능
데이터 타입을 변환해야하는 상황이 많기 때문에 그 방법에 대한 기능
쉽게 말해 `Object To Object` 기능을 제공
Spring에선 `RequestParamMethodArgumentResolver` 클래스가 `ConversionService` 를 호출해서 타입 변환 처리

[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RequestParam|@RequestParam]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ModelAttribute|@ModelAttribute]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PathVariable|@PathVariable]] 요청 파라메터 처리에 사용
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Value|@Value]] 등으로 YML 정보 읽기
DB에서 서버로 또는 서버에서 DB로 데이터의 처리에 관여

> [!hint] 비슷한게 무엇이 있을까
> [[2.Ref(데이터 및 정보 저장)/Spring/ArgumentResolver(HandlerMethodArgumentResolver)|ArgumentResolver]]  : `RequestParamMethodArgumentResolver` 에서 등록된 Converter, Formatter 를 사용
> [[2.Ref(데이터 및 정보 저장)/Spring/변환기/HttpMessageConverter|HttpMessageConverter]] : [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RequestBody|@RequestBody]] 만을 위한 것이기에 Converter 와 사용되는 위치가 다름
> [[2.Ref(데이터 및 정보 저장)/Spring/변환기/Formatter]] : 등록도 동일하게 되기 때문에 사용에는 비슷하지만 Formatter 가 좀 더 지역적으로 사용 가능


`org.springframework.core.converter.converter` 에 포함된 패키지이며 Converter 라는 이름의 다른 인터페이스가 많기 때문에 실수 할 위험이 많음
```java
 @Slf4j
 public class StringToIntegerConverter implements Converter<String, Integer> {
     @Override
     public Integer convert(String source) {
         log.info("convert source={}", source);
         return Integer.valueOf(source);
     }
}
```
> String To Integer 예제

## Converter 의 종류
`Converter` : 기본 타입 컨버터
`ConverterFactory`: 전체 클래스 계층 구조가 필요할 때
`GenericConverter` : 정교한 구현, 대상 필드의 애노테이션 정보 사용 가능
`ConditionalGenericConverter` : 특정 조건이 참인 경우에만 실행
[컨버터 공식 페이지](https://docs.spring.io/spring-framework/reference/core/validation/convert.html)

# `DefaultConversionService`
컨버터를 등록하고 사용하는 클래스
`ConfigurableConversionService` 인터페이스를 상속
## `ConversionService`
컨버터를 사용하는 것에 초점을 맞춘 인터페이스
타입 컨버터를 일일이 찾아 타입 변환에 사용하는 것은 매우 불편하기 때문에 스프링은 개별 컨버터를 모아두고 그것을 묶어서 편리하게 사용할수 있는 기능을 제공
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RequestParam|@RequestParam]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ModelAttribute|@ModelAttribute]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PathVariable|@PathVariable]], 뷰 템플릿 등에서 사용 가능
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RequestBody|@RequestBody]] 에서는 사용 불가능 ([[2.Ref(데이터 및 정보 저장)/Spring/변환기/HttpMessageConverter|HttpMessageConverter]] 를 통해 한번에 jackson을 쓰기 때문에 사용 불가능)
```java
 public interface ConversionService {
     boolean canConvert(@Nullable Class<?> sourceType, Class<?> targetType);
     boolean canConvert(@Nullable TypeDescriptor sourceType, TypeDescriptor
 targetType);
     <T> T convert(@Nullable Object source, Class<T> targetType);
     Object convert(@Nullable Object source, @Nullable TypeDescriptor sourceType,
 TypeDescriptor targetType);
}
```
- `canConvert(source, target)` : 컨버터 기능을 사용할 수 있는지 확인
	- `source` : 변환시킬 데이터 타입
	- `target` : 변환될 데이터 타입
- `convert(source, target)` : 컨버터 기능 사용
	- `source` : 변환할 데이터
	- `target` : 변환될 데이터 타입
## `ConverterRegistry`
컨버터를 등록하는 것에 초점을 맞춘 인터페이스
```java
public interface ConverterRegistry {
  void addConverter(Converter<?, ?> converter);
  <S, T> void addConverter(Class<S> sourceType, Class<T> targetType, Converter<? super S, ? extends T> converter);
  void addConverter(GenericConverter converter);
  void addConverterFactory(ConverterFactory<?, ?> factory);
  void removeConvertible(Class<?> sourceType, Class<?> targetType);
}
```

## 등록 방법
![[2.Ref(데이터 및 정보 저장)/Spring/WebMvcConfigurer#0.New Note/Converter Converter 등록 방법]] 

# 테스트
```java
public class ConversionServiceTest {
     @Test
     void conversionService() {
//등록
         DefaultConversionService conversionService = new DefaultConversionService();
         conversionService.addConverter(new StringToIntegerConverter());
         conversionService.addConverter(new IntegerToStringConverter());
         conversionService.addConverter(new StringToIpPortConverter());
         conversionService.addConverter(new IpPortToStringConverter());
//사용 
assertThat(conversionService.convert("10",Integer.class)).isEqualTo(10);
assertThat(conversionService.convert(10, String.class)).isEqualTo("10");
IpPort ipPort = conversionService.convert("127.0.0.1:8080", IpPort.class);
assertThat(ipPort).isEqualTo(new IpPort("127.0.0.1", 8080));
String ipPortString = conversionService.convert(new IpPort("127.0.0.1", 8080), String.class);
assertThat(ipPortString).isEqualTo("127.0.0.1:8080");
     }
}

```