---
aliases:
  - DispatchType
tags:
  - Spring
  - Spring/Exception
특징:
---
# DispatchType
`request.getDispatcherType()` 통해서 확인 가능
## REQUEST
클라이언트에서 요청했을 때 지정되는 타입
## ERROR
클라이언트에서 요청이 에러 발생 후 [[2.Ref(데이터 및 정보 저장)/Web (Application) Server/Web Application Server(WAS)|WAS]]  에서 ERROR 페이지를 요청할때 지정되는 타입
## FORWARD
MVC 에서 배웠던 서블릿에서 다른 서블릿이나 JSP 를 호출할때 지정되는 타입
> `RequestDispatcher.forward(request, response);`
## INCLUDE
서블릿에서 다른 서블릿이나 JSP 결과를 포함할때 지정되는 타입
>`ReqeustDispatcher.include(request, response);`
## ASYNC
서블릿 비동기 호출
