---
aliases:
  - BasicErrorController
tags:
  - Spring
  - Spring/Exception
특징: 
---
```properties title:"BasicErrorController 끄고 키는 방법"
server.error.whitelabel.enabled=false
```
에러에 대한 처리를 자동으로 하도록 도와주는 컨트롤러
따로 `WebServerFactoryCustomizer`를 설정해주지 않는다면 자동으로 `BasicErrorController` 를 사용
서블릿 밖으로 예외 발생하거나 `response.sendError(...)`가 호출되면 `BasicErrorController` 통해 `/error` 디렉토리 호출
# 기본 처리 방법
html 페이지로 반환할지 API 형식으로 반환할지는 http 메세지의 `Accept`항목을 보고 무엇을 전달할지 판단
- `Accept: text/html` : 일반적인 html 페이지 전달
- `Accept: application/json` : json 형태의 데이터(`message`, `status`) 전달
```json
{
  "message": "잘못된 사용자",
  "status": 500
}
```
`ErrorMvcAutoConfiguration` 설정 파일이 오류페이지를 자동으로 등록하는 역활을 맡음

# Exception Page 처리
```java
@Controller  
@RequestMapping({"${server.error.path:${error.path:/error}}"})  
public class BasicErrorController extends AbstractErrorController {  
	@RequestMapping(produces = {"text/html"})  
	public ModelAndView errorHtml(HttpServletRequest request, HttpServletResponse response) {}
	@RequestMapping  
	public ResponseEntity<Map<String, Object>> error(HttpServletRequest request) {}
  ...
  }
```
> Page 처리의 경우 기본적으로 `/error` 에서 파일을 찾음, 그 이외는 데이터를 전달

기본 경로는 `server.error.path` 를 설정 하여 사용 가

1. [[2.Ref(데이터 및 정보 저장)/Spring/View Template/View Template|뷰 템플릿]]
	1.  `resource/templates/error/500.html` 디테일한 에러 번호가 우선순위 높음
	2. `resource/templates/error/5xx.html` 디테일한 것보단 우선순위 낮음
2. 정적 리소스(`static`, `public`)
	1. `resource/static/error/400.html`디테일한 에러 번호가 우선순위 높음
	2. `resource/static/error/4xx.html` 디테일한 것보단 우선순위 낮음
3. 적용 대상이 없을 때 뷰 이름(`error`)
	1. `resource/templates/error.html`


