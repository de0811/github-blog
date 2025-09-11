---
aliases:
  - Part
tags:
  - Spring
  - Servlet
  - Multipart
특징: 
---
# Part
서블릿에서 제공
[[2.Ref(데이터 및 정보 저장)/Spring/HttpServletRequest|HttpServletRequest]] 통해서 사용 가능 (`Collection<Part> parts = request.getParts();`)
`Multipart` 로 데이터가 전달되었을 때 가지고 있는 기본 데이터 타입
`Multipart`로 전달 되었다는 것은 파일 데이터 뿐만 아니라 param 정보까지 포함
```java
public interface Part {
  // Part의 전송 데이터
  InputStream getInputStream() throws IOException;
  // Content-Type ex)text/plain
  String getContentType();
  // 클라이언트가 전달한 field 이름(무슨 이름으로 담겨오는지 나타냄)
  String getName();
  // 클라이언트가 전달한 파일명
  String getSubmittedFileName();
  // 데이터의 크기
  long getSize();
  // Part를 통해 전송된 데이터를 파일로 저장
  void write(String var1) throws IOException;

  void delete() throws IOException;
  // 저장된 헤더 이름에 맞는 값
  String getHeader(String var1);
  // 저장된 헤더 이름에 맞는 값들(목록으로 표현)
  Collection<String> getHeaders(String var1);
  // 저장된 헤더 이름
  Collection<String> getHeaderNames();
}

```
## 단점
- HttpServletRequest 를 사용
- 해당 `Part`가 파일이라는 것을 확인하는 코드 필요

## 사용 예제
```java
@PostMapping("/upload")
  public String saveFileV1(HttpServletRequest request) throws ServletException, IOException {
  Collection<Part> parts = request.getParts();
}
```
> Part 가져오는 방법

```java
  @PostMapping("/upload")
  public String saveFileV1(HttpServletRequest request) throws ServletException, IOException {
    log.info("request={}", request);

    String itemName = request.getParameter("itemName");
    log.info("itemName={}", itemName);

    Collection<Part> parts = request.getParts();
    log.info("parts={}", parts);
    parts.forEach(part -> {
      log.info("==== PART ====");
      log.info("name={}", part.getName());
      Collection<String> headerNames = part.getHeaderNames();
      headerNames.forEach(headerName -> log.info("header {}: {}", headerName, part.getHeader(headerName)));
      log.info("name={}", part.getName());
      log.info("submittedFileName={}", part.getSubmittedFileName());
      log.info("contentType={}", part.getContentType());
      log.info("size={}", part.getSize());
      part.getHeaderNames().forEach(headerName -> log.info("header {}: {}", headerName, part.getHeader(headerName)));
      try {
        InputStream inputStream = part.getInputStream();
        log.info("inputStream={}", StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8));
        part.write(fileDir + part.getSubmittedFileName());
      } catch (IOException e) {
        throw new RuntimeException(e);
      }

      log.info("==== END ====");
    } );

    return "upload-form";
  }
```
> 각종 정보 보는 방법