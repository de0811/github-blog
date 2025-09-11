---
aliases:
  - RequestResponseBodyMethodProcessor
tags:
  - Spring
---
[[2.Ref(데이터 및 정보 저장)/Spring/ArgumentResolver(HandlerMethodArgumentResolver)]] 와 [[2.Ref(데이터 및 정보 저장)/Spring/ReturnValueHandler(HandlerMethodReturnValueHandler)]] 를 상속
[[Parameter]] 또는 반환 값이 자신이 처리할 수 있는 것인지 확인하여 알려주며 처리하는 기능 또한 포함
- HTTP 메세지를 [[2.Ref(데이터 및 정보 저장)/Spring/ArgumentResolver(HandlerMethodArgumentResolver)]]는 [[2.Ref(데이터 및 정보 저장)/Spring/변환기/HttpMessageConverter|HttpMessageConverter]]를 이용하여 들어갈 인자에 맞게 변형하여 전달
- 반환된 Data를 [[2.Ref(데이터 및 정보 저장)/Spring/ReturnValueHandler(HandlerMethodReturnValueHandler)]]는 [[2.Ref(데이터 및 정보 저장)/Spring/변환기/HttpMessageConverter|HttpMessageConverter]] 를 이용하여 HTTP 메세지로 변환

