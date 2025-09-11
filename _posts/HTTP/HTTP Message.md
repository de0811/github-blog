---
aliases:
tags:
  - HTTP
---

http 요청 메시지를 통해 클라이언트에서 서버로 데이터를 전달하는 방법
크게 3가지의 방법이 존재
## GET - [[Query String or URL Params or Query Parameters, Path Variable]] 방법 사용
```http
GET http://localhost:8080/request-param-v2?username=hello&age=20
Connection: Keep-Alive
User-Agent: Apache-HttpClient/4.5.14 (Java/17.0.9)
Accept-Encoding: br,deflate,gzip,x-gzip
```
## POST - HTML Form
- 메시지 바디에 쿼리 파라미터 형식으로 전달 (`username=hello&age=20`)
- content-type: application/x-www-form-urlencoded
```http
POST http://localhost:8080/request-param-v2
content-type: application/x-www-form-urlencoded
Content-Length: 21
Connection: Keep-Alive
User-Agent: Apache-HttpClient/4.5.14 (Java/17.0.9)
Accept-Encoding: br,deflate,gzip,x-gzip

username=hello&age=20
```
## HTTP message body 데이터를 직접 담아서 요청
- 데이터 형식은 주로 JSON 사용
- POST, PUT, PATCH, DELETE
- HTTP API 에서 주로 사용, JSON, XML, TEXT