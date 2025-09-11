---
aliases:
  - "@RequestPart"
tags:
  - Spring
  - Annotation
  - Spring/Request
특징: 
---
# @RequestPart
[[2.Ref(데이터 및 정보 저장)/Spring/Multipart/MultipartFile|multipart/form-data]] 에 포함된 경우 사용
[[2.Ref(데이터 및 정보 저장)/Spring/Multipart/MultipartFile|MultipartFile]] 포함된 경우 [[MultipartResolver]] 동작하여 역직렬화 진행
만약 [[2.Ref(데이터 및 정보 저장)/Spring/Multipart/MultipartFile|MultipartFile]] 포함되지 않은 경우 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RequestBody|@RequestBody]] 와 동일한 동작 진행
JSON 파일을 받는 경우 처리 가능
즉, Json 형태로 오거나 [[2.Ref(데이터 및 정보 저장)/Spring/Multipart/MultipartFile|multipart/form-data]] 형으로 올 경우 둘 다 처리 가능
```java title:"두 타입에 대해 받는게 가능"
consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE}
```

> [!error] [[2.Ref(데이터 및 정보 저장)/Intellij/IntelliJ]] HttpClient 에서는 동작하지 않는 예제
```http
POST http://localhost:8080/api/venue  
Authorization: {{authorization}}  
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW  
  
------WebKitFormBoundary7MA4YWxkTrZu0gW  
Content-Disposition: form-data; name="venueInsertDto"  
Content-Type: application/json  
  
{  
  "name": "mmVenue",  
  "address": "서울시 파파이야 파파존스"  
}  
------WebKitFormBoundary7MA4YWxkTrZu0gW  
Content-Disposition: form-data; name="files"; filename="venue.svg"  
Content-Type: image/svg+xml  
  
< /Users/sdm/Documents/SOURCE/TIKET/SERVER/Tiket.server/svg/venue.svg  
------WebKitFormBoundary7MA4YWxkTrZu0gW  
Content-Disposition: form-data; name="files"; filename="zone.svg"  
Content-Type: image/svg+xml  
  
< /Users/sdm/Documents/SOURCE/TIKET/SERVER/Tiket.server/svg/zone.svg  
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```
