---
aliases:
  - RequestMappingHandlerMapping
  - HandlerMapping
tags:
  - Spring
특징: 어떤 핸들러(컨트롤러의 메서드)에서 처리할지 결정하고 매핑하는 것
isPublic: false
---
# HandlerMapping
- URL 에 맞는 컨트롤러를 반환하기 위해 사용
- 클라이언트로부터 들어온 [[2.Ref(데이터 및 정보 저장)/Spring/HttpServletRequest|HttpServletRequest]]를 어떤 핸들러(컨트롤러의 메서드)에서 처리할지 결정하고 매핑하는 것
## 상속자
### RequestMappingHandlerMapping
[[@Controller]] 등록이 될 경우 등록된 URL주소와 함수를 매핑해주는 기능



> [!danger] 3.0 버전 이전의 상태
> [[@RequestMapping]]과 [[@Controller]] 둘 중 하나만 등록 되어도 컨트롤러로 인식 되었음
> 최신의 3.0 이상의 버전의 경우 [[@Controller]] 하나만 스프링 컨트롤러로 인식


