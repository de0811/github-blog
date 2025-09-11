---
aliases:
  - HttpMessageConverter
  - ByteArrayHttpMessageConverter
  - StringHttpMessageConverter
  - MappingJackson2HttpMessageConverter
tags:
  - Spring
  - Spring/Converter
---
# HttpMessageConverter 
- **요청, 응답 모두 사용** 되며 즉, [[HttpEntity]] 또는 [[@RequestBody]] 또는 [[@ResponseBody]] 에서 사용
	- Response 경우 `Accept: application/json` 이 부분을 보고 판단
- byte 처리 등등 기타 여러 컨버터가 기본적으로 등록 되어 있음
- [[2.Ref(데이터 및 정보 저장)/Spring/변환기/Converter#`ConversionService`|ConversionService]] 사용불가
- HttpMessageConverter 역활은 HTTP 메시지 바디의 내용을 객체로 변환하거나 객체를 HTTP 메시지 바디에 입력하는 것
	- 한번에 변환되는 특징

```java
public interface HttpMessageConverter<T> {

	/**
	 * 컨버터가 읽을 수 있는지 확인(요청)
	 * @param clazz 가독성 테스트를 위한 클래스
	 * @param mediaType 일반적으로 {@code Content-Type} 헤더의 값입니다.
	 * @return 읽을 수 있으면 @return {@code true}; 그렇지 않으면 {@code false}
	 */
	boolean canRead(Class<?> clazz, @Nullable MediaType mediaType);

	/**
	 * 컨버터가 쓸 수 있는지 확인(응답)
	 * @param clazz 쓰기 가능성 테스트를 위한 클래스
	 * @param mediaType 일반적으로 {@code Accept} 헤더의 값입니다.
	 * 쓰기 가능한 경우 @return {@code true}; 그렇지 않으면 {@code false}
	 */
	boolean canWrite(Class<?> clazz, @Nullable MediaType mediaType);

	/**
	 * 이 컨버터가 지원하는 미디어 타입 목록을 반환
	 * {@link #canWrite(Class, MediaType) 먼저 써서 확인 필수
   * @return 지원되는 미디어 유형 목록
	 */
	List<MediaType> getSupportedMediaTypes();

	/**
	 * 클래스가 지원하는 유형이라면 타입 목록을 주고 아니라면 빈 값을 전달
	 * @param clazz 확인할 클래스
	 * @return 해당 클래스에 지원되는 미디어 영역
	 */
	default List<MediaType> getSupportedMediaTypes(Class<?> clazz) {
		return (canRead(clazz, null) || canWrite(clazz, null) ?
				getSupportedMediaTypes() : Collections.emptyList());
	}

	/**
	 * 메세지를 특정 객체로 반환
	 * @param clazz 반환할 객체 유형
	 * canRead 함수가 true 일때 사용
	 * @param inputMessage HTTP 입력 메세지
	 * @return 변환될 객체
	 * @throws IOException I/O 에러
	 * @throws HttpMessageNotReadableException 컨버터 에러
	 */
	T read(Class<? extends T> clazz, HttpInputMessage inputMessage)
			throws IOException, HttpMessageNotReadableException;

	/**
	 * 객체를 메세지로 작성
	 * @param t 작성할 객체
	 * canWrite 함수가 true 일때 사용
	 * @param contentType 어떤 ContentType으로 쓸지 정하는 것(default:null)
	 * @param outputMessage 쓸 메세지
	 * @throws IOException I/O 에러
	 * @throws HttpMessageNotWritableException 컨버터 에러
	 */
	void write(T t, @Nullable MediaType contentType, HttpOutputMessage outputMessage)
			throws IOException, HttpMessageNotWritableException;

}

```

## 주요 HttpMessageConverter 종류 및 우선순위
스프링 부트는 다양한 `HttpMessageConverter`를 자동으로 등록하며, 아래 순서대로 우선권을 가짐
`{java}boolean canRead(Class<?> clazz, @Nullable MediaType mediaType);` 통해서 처리할 수 있는지 확인

| 우선순위        | 컨버터 클래스                                  | 주요 처리 타입 (Java)         | 지원하는 미디어 타입 (`Content-Type`)      |
| :---------- | :--------------------------------------- | :---------------------- | :-------------------------------- |
| **1 (최상위)** | `ByteArrayHttpMessageConverter`          | `byte[]`, `InputStream` | `application/octet-stream`, `*/*` |
| **2**       | `StringHttpMessageConverter`             | `String`                | `text/plain`, `*/*`               |
| **3**       | `MappingJackson2HttpMessageConverter`    | Java 객체 (DTO, Map)      | `application/json`                |
| **4**       | `MappingJackson2XmlHttpMessageConverter` | Java 객체                 | `application/xml`                 |

> [!tip] 왜 이 순서일까
> `ByteArrayHttpMessageConverter`는 원시 데이터를 다루므로 가장 빠르고 명확해서 최우선 순위
> `StringHttpMessageConverter`는 거의 모든 타입을 문자열로 변환할 수 있어 범위가 너무 넓기 때문에, JSON 컨버터보다 후순위가 되면 JSON 객체까지 문자열로 뺏어갈 수 있음
> 따라서 **더 구체적이고 한정적인 컨버터가 높은 우선순위**를 가짐
## 커스텀 HttpMessageConverter 등록
- [[2.Ref(데이터 및 정보 저장)/Spring/WebMvcConfigurer|WebMvcConfigurer]] 를 사용하여 기본 컨버터를 바꾸거나 새로운 컨버터를 추가할 수 있음

```java title:"WebConfig.java"
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        // 기본 컨버터는 유지하면서, 새로운 커스텀 컨버터를 추가
        // 우선순위를 높이고 싶다면 리스트의 앞쪽(index 0)에 추가
        converters.add(0, new MyCustomConverter());
    }
}

```
- `extendMessageConverters`: 기존 컨버터 목록에 새 컨버터를 추가 (권장)
- `configureMessageConverters`: 기존 컨버터를 모두 무시하고 완전히 새로운 컨버터 목록을 설정
## 구현체
### ByteArrayHttpMessageConverter
clazz : byte[]
MediaType : \*/\*
```java
@RequestBody byte[] data
@ResponseBody return byte[] // MediaType : application/octet-stream
```
응답할때는 자동으로 `MediaType : application/octet-stream` 적용
### StringHttpMessageConverter
기본 문자 처리 컨버터
clazz : String
MediaType : \*/\*
```java
@RequestBody String data
@ResponseBody return String // MediaType : text/plain
```
응답할때는 자동으로 `MediaType : text/plain` 적용
### MappingJackson2HttpMessageConverter
기본 객체 처리 컨버터
JSON 분석에 사용
clazz : HashMap
MediaType : application/json
```java
@RequestBody HelloData data
@ResponseBody return helloData // MediaType : application/json
```
응답할때는 자동으로 `MediaType : application/json` 적용

