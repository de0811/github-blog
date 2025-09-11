---
aliases:
  - Cache-Control
tags:
  - Cache
  - Spring
  - HTTP
  - Spring/Response
특징:
---
# Cache-Control
캐싱은 자주 사용되는 데이터를 어딘가에 임시로 저장하고 빠르게 꺼내 쓰기 위해 사용되는 방법
보통 원본 데이터를 가져오는데 시간이 걸리는 경우 효율적
```java
String headerValue = CacheControl.maxAge(Duration.ofDays(1))
        .cachePrivate()
        .mustRevalidate()
        .getHeaderValue();

System.out.println(headerValue);
// max-age=86400, must-revalidate, private
```
해당 형식을 Cache-Control 의 Header 로 보냄
```HTTP
Cache-Control: max-age=86400, must-revalidate, private
```

Cache-Control 선언 방법중 쓸만한거 가져옴
```java
CacheControl.maxAge(60, TimeUnit.SECONDS)
```
## ResponseEntity 방법
[[2.Ref(데이터 및 정보 저장)/Spring/HttpEntity|ResponseEntity]]
```java
@GetMapping("/uuid")
public ResponseEntity<String> helloCache() {
    CacheControl cacheControl = CacheControl.maxAge(Duration.ofDays(365));

    return ResponseEntity.ok()
            .cacheControl(cacheControl)
            .body(UUID.randomUUID().toString());
}
```
실제로 캐싱 되는지 서버 요청을 보내며 확인

```text
9ae058b7-a1cb-402f-a939-4dff68b1637e
```

탭을 새로 열고 동일한 URL에 접속
```text
9ae058b7-a1cb-402f-a939-4dff68b1637e
```

랜덤한 UUID로 응답하는 코드를 작성했지만, 이전 요청과 동일한 값을 응답
심지어 서버를 종료해도 리소스에 접근이 되는 것을 확인
## HttpServletResponse 방법
[[2.Ref(데이터 및 정보 저장)/Spring/HttpServletResponse|HttpServletResponse]]
```java
@GetMapping("/uuid")
public ResponseEntity<String> helloCache(final HttpServletResponse httpServletResponse) {
    httpServletResponse.addHeader("Cache-Control", "max-age=31536000");

    return ResponseEntity.ok()
            .body(UUID.randomUUID().toString());
}
```
## WebContentInterceptor 방법
[[WebContentInterceptor]]
[[2.Ref(데이터 및 정보 저장)/Spring/HttpEntity|ResponseEntity]] [[2.Ref(데이터 및 정보 저장)/Spring/HttpServletResponse|HttpServletResponse]] 와  를 사용하는 방식은 각 엔드포인트 마다 설정하기 때문에 중복코드 발생
[[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/Interceptor|Interceptor]] 사용하여 적용하고 싶은 여러 엔드포인트에 대하여 일괄적으로 캐시를 설정
```java
@Override
public void addInterceptors(final InterceptorRegistry registry) {
    CacheControl cacheControl = CacheControl.maxAge(Duration.ofDays(365));

    WebContentInterceptor webContentInterceptor = new WebContentInterceptor();
    webContentInterceptor.addCacheMapping(cacheControl, "/**");

    registry.addInterceptor(webContentInterceptor);
}
```
## ## addResourceHandlers() 정적 리소스만 캐싱하는 방법
```java
@Configuration
public class ResourceWebConfiguration implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(final ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/resources/**")
                .addResourceLocations("classpath:/static/")
                .setCacheControl(cacheControl);
    }
}
```
# 웹 브라우저에서 Cache-Control 무시되는 현상
크롬과 같은 웹 브라우저에서 같은 탭에서 새로고침을 하거나 같은 URL을 입력해서 같은 리소스를 요청할 경우 `Cache-Control` 의 `max-age` 혹은 `Expires` 가 무시된다고 한다. 캐시가 되어있는지 확인하기 위해서는 새로운 탭을 열어서 리소스를 요청하자. ([참고1](https://stackoverflow.com/questions/11245767/is-chrome-ignoring-cache-control-max-age), [참고2](https://tech.ssut.me/cache-optimization-using-cache-control-immutable/))