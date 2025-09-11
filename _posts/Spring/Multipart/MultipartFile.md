---
aliases:
  - MultipartFile
  - multipart/form-data
tags:
  - Spring
  - Multipart
특징:
---
# MultipartFile
스프링에서 제공
`Multipart` 파일을 지원하기 위해 만들어진 인터페이스
```java
public interface MultipartFile extends InputStreamSource {  
  // 클라이언트가 전달한 field 이름(무슨 이름으로 담겨오는지 나타냄)
  String getName();  
  // 업로드 파일 명
  @Nullable  
  String getOriginalFilename();  
  // Content-Type ex)text/plain
  @Nullable  
  String getContentType();  
  
  boolean isEmpty();  
  
  long getSize();  
  
  byte[] getBytes() throws IOException;  
  // MultipartFile 전송 데이터
  InputStream getInputStream() throws IOException;  
  
  default Resource getResource() {  
    return new MultipartFileResource(this);  
  }  
  void transferTo(File dest) throws IOException, IllegalStateException;  
  //파일 저장
  default void transferTo(Path dest) throws IOException, IllegalStateException {  
    FileCopyUtils.copy(this.getInputStream(), Files.newOutputStream(dest));  
  }
}
```

## 사용 방법
```java
@PostMapping("/upload")  
public String saveFile(  
  @RequestParam String itemName,  
  @RequestParam MultipartFile file,  
  HttpServletRequest request  
  ) {  
  log.info("request={}", request);  
  log.info("itemName={}", itemName);  
  log.info("MultiPartFile={}", file);  
  
  if (!file.isEmpty()) {  
    String fullPath = fileDir + file.getOriginalFilename();  
    log.info("fileFullPath={}", fullPath);  
    try {  
      file.transferTo(new File(fullPath));  
    } catch (Exception e) {  
      e.printStackTrace();  
    }  
  }  
  return "upload-form";  
}
```