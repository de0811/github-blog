---
aliases:
  - Controller
  - Handler
  - 컨트롤러
  - 핸들러
  - Controller Method(Handler)
tags:
  - Spring
  - Spring/용어
특징: 요청 해석하고 검증하여 서비스에 비즈니스로직 돌리고 답 받아서 어떻게 전달할지 판단하는 애
isPublic: false
---
# 컨트롤러(Controller / Handler)
- [[MVC(Model-View-Controller)]] 아키텍처에서 사용자의 **HTTP 요청을 받아 비즈니스 로직(서비스)으로 연결**하고, 그 **처리 결과를 다시 사용자에게 응답**하는 중간 관리자 역할
## Controller vs Handler
두 용어는 거의 동일한 의미로 사용되지만, 스프링 MVC의 관점에서는 미묘한 차이가 있습니다
-   **`Controller`**: 개발자가 작성하는 **클래스 단위의 개념** (`@Controller`, `@RestController`)
    -   MVC 패턴에서 유래한 더 넓은 범위의 용어
-   **`Handler`**: 스프링 `DispatcherServlet`이 요청을 처리할 대상을 지칭하는 **내부 용어**
    -   현대 스프링 MVC에서는 주로 **`@RequestMapping`이 붙은 특정 메소드**를 의미
    - Controller Method 를 의미
## 컨트롤러의 역활
- 요청 수신 및 해석
	- [[2.Ref(데이터 및 정보 저장)/Spring/DispatcherServlet|DispatcherServlet]]으로 HTTP 요청을 전달
	- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RequestParam|@RequestParam]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RequestBody|@RequestBody]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PathVariable|@PathVariable]] 등 사용하여 요청 데이터([[2.Ref(데이터 및 정보 저장)/개발 이론/Parameter|파라메터]] Body 등) 해석
- 데이터 변환 및 검증
	- [[2.Ref(데이터 및 정보 저장)/Spring/ArgumentResolver(HandlerMethodArgumentResolver)|ArgumentResolver]] 통해 데이터를 객체로 변환
	- [[2.Ref(데이터 및 정보 저장)/Spring/Validator/Bean Validation|Bean Validation]]과 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Validated-@Valid|@Validated]] 등을 통해 데이터 유효성 검사하고 결과를 [[2.Ref(데이터 및 정보 저장)/Spring/Validator/BindingResult|BindingResult]]로 전달
- 비즈니스 로직 호출
	- [[Service]] 통해 비즈니스 로직 동작 후 결과 반환 받기
	- [[2.Ref(데이터 및 정보 저장)/Spring/ReturnValueHandler(HandlerMethodReturnValueHandler)|ReturnValueHandler]] 통해 다양한 형태로 응답 전달 
		- [[ModelAndView]] 또는 `String` 같이 뷰를 렌더링하여 응답
		- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ResponseBody|@ResponseBody]] 또는 [[2.Ref(데이터 및 정보 저장)/Spring/HttpEntity|ResponseEntity]] 같이 객체를 JSON 등으로 변환하여 데이터로 응답   

