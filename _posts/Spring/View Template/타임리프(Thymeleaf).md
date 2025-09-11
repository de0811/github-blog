---
aliases:
  - Natural Template
  - 타임리프
  - thymeleaf
tags:
  - Spring
  - spring/ViewTemplate
---
>https://www.thymeleaf.org/doc/tutorials/3.0/thymeleafspring.html

순수 HTML 형태를 그대로 유지하면서 [[2.Ref(데이터 및 정보 저장)/Spring/View Template/View Template]] 도 사용할 수 있는 타임리프의 특징을 네츄럴 템플릿이라고 함
## 의존성
```groovy
implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
```

## 설정
```properties
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html
```
> [템플릿 설정](https://docs.spring.io/spring-boot/docs/2.4.3/reference/html/appendix-application-properties.html#common-application-properties-templating)

## HTML 초기 작성
```html
<!DOCTYPE HTML>  
<html xmlns:th="http://www.thymeleaf.org">
...
```
`<html xmlns:th="http://www.thymeleaf.org">` 필수 작성

## 기본 제공(예약어)
```html
<h2 th:if="${param.status}" th:text="'저장 완료'"></h2>
```
[[Query String or URL Params or Query Parameters, Path Variable|Query String]] 경우 param 이라는 이름으로 자동으로 등록되어 사용 가능

## 문법
### 변수`${...}`
```html
<span th:text="${data}">샘플</span>
```

```java
@Data  
static class User {  
  private String username;  
  private int age;  
  public User(String user, int age) {  
    this.username = user;  
    this.age = age;  
}
```
> 예제 class
#### Object 변수의 접근법(SpringEL 표현식)
```html
<li>${user.username} =    <span th:text="${user.username}"></span></li>  
<li>${user['username']} = <span th:text="${user['username']}"></span></li>  
<li>${user.getUsername()} = <span th:text="${user.getUsername()}"></span></li>
```
#### List 변수의 접근법(SpringEL 표현식)
```html
<li>${users[0].username}    = <span th:text="${users[0].username}"></span></li>  
<li>${users[0]['username']} = <span th:text="${users[0]['username']}"></span></li>  
<li>${users[0].getUsername()} = <span th:text="${users[0].getUsername()}"></span></li>
```
#### Map 변수의 접근법(SpringEL 표현식)
```html
<li>${userMap['userA'].username} =  <span th:text="${userMap['userA'].username}"></span></li>  
<li>${userMap['userA']['username']} = <span th:text="${userMap['userA']['username']}"></span></li>  
<li>${userMap['userA'].getUsername()} = <span th:text="${userMap['userA'].getUsername()}"></span></li>
```
#### 지역 변수 선언 방법
`th:with` 방법을 이용한 지역 변수 선언
<span style="background:#ff4d4f">선언한 태그를 벗어나면 사용 불가</span>
```html
<div th:with="first=${users[0]}">  
    <p>처음 사람의 이름은 <span th:text="${first.username}"></span></p>  
</div>
```
#### thymeleaf 기본 사용 객체
최신의 방법으로는 `#request` `#response` `#session` `#servletContext` 사용 불가
##### locale - 식 기본 객체(Expression Basic Objects)
```html
<li>locale = <span th:text="${#locale}"></span></li>
```
##### param
```html
<li>Request Parameter = <span th:text="${param.paramData}"></span></li>
```
##### session
```html
<li>session = <span th:text="${session.sessionData}"></span></li>
```
##### Bean
```html
<li>spring bean = <span th:text="${@helloBean.hello('Spring!')}"></span></li>
```
### 컨버전 서비스 적용 `${{...}}`
[[2.Ref(데이터 및 정보 저장)/Spring/변환기/Converter|Converter]] 를 사용하는 기능
spring 에서 등록된 컨버터를 사용
```html
<li>${{ipPort}}: <span th:text="${{ipPort}}" ></span></li>
```
### 선택 변수 표현식`*{...}`
### 메시지 표현식`#{...}`
#국제화 
```html
<div th:text="#{page.addItem}"}>상품 등록</div>
```

### 링크 URL 표현식`@{...}`
#### 기본적인 링크 방법
```html
<li><a th:href="@{/hello}">basic url</a></li>
```
#### query param
```html
<a th:href="@{/hello(param1=${param1}, param2=${param2})}">hello query param</a>
```
<span style="background:#d4b106">결과</span> http://localhost:8080/hello?param1=data1&param2=data2
#### path variable
링큼 표현식 내부에 변수를 넣으려면 그 값의 이름을 지정해야 넣어 줄 수 있다
`<a th:href="@{/hello/${param1}/${param2}}">path variable2</a>`  이렇게 사용 불가능
```html
<a th:href="@{/hello/{param1}/{param2}(param1=${param1}, param2=${param2})}">path variable</a>
```
<span style="background:#d4b106">결과</span> http://localhost:8080/hello/data1/data2
####  query param + path variable
변수를 직접 사용하지 않으면 [[Parameter]] 로 전달
```html
<a th:href="@{/hello/{param1}(param1=${param1}, param2=${param2})}">path variable + query parameter</a>
```
<span style="background:#d4b106">결과</span> http://localhost:8080/hello/data1?param2=data2
### 조각 표현식`~{...}`
템플릿 조각(Template Layout)
#### 조각을 만드는 방법(th:fragment)
호출할 조각의 이름을 정하는 방법
```html
<footer th:fragment="copy">  
    푸터 자리 입니다.  
</footer>

<footer th:fragment="copyParam (param1, param2)">  
    <p>파라미터 자리 입니다.</p>  
    <p th:text="${param1}"></p>  
    <p th:text="${param2}"></p>  
</footer>
```
`th:fragment="사용할이름"` 이름을 미리 지정해놓고 다른 곳에서 사용
여러개의 조각을 정의 할 수 있음
#### 자식으로 추가하는 방법 (th:insert)
다른 조각을 불러오는 방법은 `~{경로/파일이름 :: fragment이름}` 형태로 지정
간편하게 `경로/파일이름 :: fragment이름` 이렇게 `~{}` 생략 가능
```html
<div th:insert="~{template/fragment/footer :: copy}"></div>
```
---
```html
<div>
	<footer>푸터</footer>
</div>
```
#### 원래 있던 내용 대신해서 넣는 방법 (th:replace)
다른 조각을 불러오는 방법은 `~{경로/파일이름 :: fragment이름}` 형태로 지정
간편하게 `경로/파일이름 :: fragment이름` 이렇게 `~{}` 생략 가능
```html
<div th:replace="~{template/fragment/footer :: copy}"></div>
```
---
```html
<footer>푸터</footer>
```
#### [[Parameter]] 쓰는 방법
```html
<div th:replace="~{template/fragment/footer :: copyParam ('데이터1', '데이터2')}"></div>
```
#### 내가 정의한 것을 파라메타로 전달하여 다시 쓰는 방법
```html
<html xmlns:th="http://www.thymeleaf.org">  
<head th:fragment="common_header(title,links)">  
  
    <title th:replace="${title}">레이아웃 타이틀</title>  
  
    <!-- 공통 -->  
    <link rel="shortcut icon" th:href="@{/images/favicon.ico}">  
    <script type="text/javascript" th:src="@{/sh/scripts/codebase.js}"></script>  
  
    <!-- 추가 -->  
    <th:block th:replace="${links}" />  
  
</head>
```
> fragment.html
---
```html
<!DOCTYPE html>  
<html xmlns:th="http://www.thymeleaf.org">  
<head th:replace="template/layout/base :: common_header(~{::title},~{::link})">  
    <title>메인 타이틀</title>  
    <link rel="stylesheet" th:href="@{/css/bootstrap.min.css}">  
    <link rel="stylesheet" th:href="@{/themes/smoothness/jquery-ui.css}">  
</head>  
<body>  
메인 컨텐츠  
</body>  
</html>
```
> mainLayout.html
##### 순서도
1. `mainLayout.html` 에서 `<head>` 부분을 `template/layout/base` 파일의 `common_header` fragment 를 호출
2. `<head>` 태그 안에 정의한 `title`과 `link` 를 [[Parameter|파라메타]] 로 전달
3. `fragment.html` 에서 받아온 `title`은 기존의 `title`과 교체
4. `th:block` 을 사용하여 `links` 들을 등록
5. `mainLayout.html`에 `fragment.html`을 교체
#### html 태그 붙이기
```html
<!DOCTYPE html>  
<html th:fragment="layout (title, content)" xmlns:th="http://www.thymeleaf.org">  
<head>  
    <title th:replace="${title}">레이아웃 타이틀</title>  
</head>  
<body>  
<h1>레이아웃 H1</h1>  
<div th:replace="${content}">  
    <p>레이아웃 컨텐츠</p>  
</div>  
<footer>  
    레이아웃 푸터  
</footer>  
</body>  
</html>
```
> fragmentMain.html
```html
<!DOCTYPE html>  
<html th:replace="~{template/layoutExtend/fragmentMain :: layout(~{::title}, ~{::section})}"  
      xmlns:th="http://www.thymeleaf.org">  
<head>  
    <title>메인 페이지 타이틀</title>  
</head>  
<body>  
<section>  
    <p>메인 페이지 컨텐츠</p>  
    <div>메인 페이지 포함 내용</div>  
</section>  
</body>  
</html>
```
> main.html
##### 순서도
1. `main.html` 에서 `template/layoutExtend/fragmentMain` 파일의 `layout` fragment 호출
2. `<html>` 태그 안에 정의한 `title`과 `section` 태그를 전달
3. `fragmentMain.html` 에서 받아온 `title`은 기존의 `title`과 교체
4. `content`를 바꿔서 작성
5. `main.html` 에 `fragmentMain.html` 교체
### SpringEL `${@...}`

### 연산자
#### 문자 연산
문자는 항상 따옴표(`''`)로 감싸줘야함
`A-Z`, `a-z`, `0-9`, `[]`, `.`, `-`, `_` 문자가 연달아 진행될 경우 따옴표를 생략 가능
```html
<span th:text="hello">
```
해당 소스는 문제가 없음
```html
<span th:text="hello world!">
```
이 소스는 에러 발생(공백과 느낌표 사용하였기 때문에 따옴표 생략 불가능)
##### 문자 합치기
`'a' + 'b'`
##### 리터럴 대체
`|The name is ${name}|`
#### 산술연산
+, -, \*, / ,%
#### Boolean 연산
and, or, !, not
#### 비교, 동등 연산
\>(gt), <(lt), >=(ge), <=(le), !(not), \==(eq), !=(neq,ne)
#### Elvis 연산자
데이터가 없을 경우 `?:` 오른쪽에 있는 [[리터럴]] 출력
```html
data == 'spring!'
nullData == null

${data}?: '데이터가 없습니다.' = <span th:text="${data}?: '데이터가 없습니다.'"></span>
${nullData}?: '데이터가 없습니다.' = <span th:text="${nullData}?: '데이터가 없습니다.'"></span>
```
<span style="background:#d4b106">출력</span>
`${data}?: '데이터가 없습니다.' = spring!`
`${nullData}?: '데이터가 없습니다.' = 데이터가 없습니다.`

#### 특별 토큰(No-Operation: _)
Elvis 연산자와 유사하지만 다른 점은 `_` 문자가 들어갈 경우 어떤 값을 대입하지 않고 기존에 작성되어 있는 모습을 그대로 표현하라는 뜻
```html
data == 'spring!'
nullData == null

${data}?: _ = <span th:text="${data}?: _">데이터가 없습니다.</span>
${nullData}?: _ = <span th:text="${nullData}?: _">데이터가 없습니다.</span>
```
<span style="background:#d4b106">출력</span>
`${data}?: _ = spring!`
`${nullData}?: _ = 데이터가 없습니다.`
#### 조건 연산
##### If-then
`(if) ? (then)`
##### If-then-else
`(if) ? (then) : (else)`
##### Default
`(value) ?: (defaultValue)`

### 유틸리티
[유틸리티 객체 설명](https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#expression-utility-objects)
[유틸리티 객체 사용방법](https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#appendix-b-expression-utility-objects)
java8 날짜 클래스인 `LocalDate`, `LocalDateTime`, `Instant` 를 사용하려면 추가 라이브러리가 필요
스프링부트 타입리프를 사용하면 자동으로 추가되어 있음
### th: 문법
#### 대체하기 th:text
```html
<ul>  
  <li>th:text = <span th:text="${data}"></span></li>  
  <li>th:utext = <span th:utext="${data}"></span></li>  
</ul>  
<ul>  
  <li><span th:inline="none">[[...]] = </span>[[${data}]]</li>  
  <li><span th:inline="none">[(...)] = </span>[(${data})]</li>  
</ul>
```
```html
<ul>
  <li>th:text = <span>Hello &lt;b&gt;Spring&lt;/b&gt;!</span></li>
  <li>th:utext = <span>Hello <b>Spring</b>!</span></li>
</ul>
<ul>
  <li><span>[[...]] = </span>Hello &lt;b&gt;Spring&lt;/b&gt;!</li>
  <li><span>[(...)] = </span>Hello <b>Spring</b>!</li>
</ul>
```
#### 원래 값 대치
###### [[Escape sequence]]
```html
<span th:text="${data}">temp String</span>
```
${data}에 내용이 있다면 기존 값 대치
##### [[Escape sequence]] 하지 않기
```html
<span th:utext="${data}">temp String</span>
```
#### 덧붙이기
##### [[Escape sequence]] 
`[[${data}]]`
```html
<span>컨텐츠에 덧붙이기 = [[${data}]]</span>
```
##### [[Escape sequence]] 하지 않기
`[(...)]`
```html
<span>컨텐츠에 덧붙이기 = [(${data})]</span>
```
#### 대체하기 th:checked
```html
<input type="text" name="mock" th:name="userA" />
<input type="checkbox" name="active" th:checked="true" />
<input type="checkbox" name="active" th:checked="false" />
```
checked 의 경우에는 false 값이 들어가면 속성을 삭제
#### 기존 값을 대신하여 넣기
`th:xxx` xxx 에는 대체할 attribute 지정
```html
<link th:href="@{/css/bootstrap.min.css}"  
        href="../css/bootstrap.min.css" rel="stylesheet">
```
#### 문자 그대로 HTML에 작성
`|location.href='@{/basic/items/add}'|` 에서 처럼 or(|) 을 사용하여 작성
`th:onclick="'location.href=' + '\'' + @{/basic/items/add} + '\''"` 
`th:onclick="|location.href='@{/basic/items/add}'|"`
이렇게 사용할 수 있음
```html
<div class="col">  
    <button class="btn btn-primary float-end"  
            onclick="location.href='addForm.html'"  
            th:onclick="|location.href='@{/basic/items/add}'|"  
            type="button">상품 등록</button>  
</div>
```
#### 추가하기 th:attrappend
##### 뒤에 추가하기(attrappend)
```html
<input type="text" class="text" th:attrappend="class=' large'" />
```
##### 앞에 추가하기 (attrprepend)
```html
<input type="text" class="text" th:attrprepend="class='large '" />
```
##### 클래스 지정 추가하기(classappend)
```html
<input type="text" class="text" th:classappend="large" />
```
#### th:inline="html"
주 기능 : 자바스크립트를 편리하게 사용하기 위한 자바스크립트 인라인 기능
기본적으로 모든 th:inline 문법에는 `<TAG th:inline="html">` 내용이 되어있다고 생각하면 됨
javascript 를 사용하고 싶다면 `<script th:inline="javascript>"`이렇게 표시해줘함
CSS 의 경우는 `<style th:inline="css">` 이렇게 표시
무엇이든 다 표현하고 싶다면 `<TAG th:inline="none">`이렇게 작성하면 됨

##### inline="javascript" 사용하지 않았을 때
```html
<script>  
    var username = [[${user.username}]];  
    var age = [[${user.age}]];  
    //자바스크립트 내추럴 템플릿  
    var username2 = /*[[${user.username}]]*/ "test username";  
    //객체  
    var user = [[${user}]];  
</script>
```
---
```html
<script>
    var username = userA;
    var age = 10;
    //자바스크립트 내추럴 템플릿
    var username2 = /*userA*/ "test username";
    //객체
    var user = BasicController.User(username=userA, age=10);
</script>
```
- `var username = userA;`내용에 문자열이 아닌 객체로 들어가버려 문제 발생
- `var username2 = /*userA*/ "test username";` userA라는 문자열이 아닌 기존의 값만 그대로 사용
- 객체 사용시 담을 수 없는 값으로 전환
##### inline="javascript" 사용할 경우
```html
<script th:inline="javascript">  
    var username = [[${user.username}]];  
    var age = [[${user.age}]];  
    //자바스크립트 내추럴 템플릿  
    var username2 = /*[[${user.username}]]*/ "test username";  
    //객체  
    var user = [[${user}]];  
</script>
```
---
```html
<script>
    var username = "userA";
    var age = 10;
    //자바스크립트 내추럴 템플릿
    var username2 = "userA";
    //객체
    var user = {"username":"userA","age":10};
</script>
```
- `var username = "userA";`알아서 문자열로 변환 확인
- `var username2 = "userA";` 정상적으로 테스트 코드를 대신해서 작성
- `var user = {"username":"userA","age":10};` javascript 가 쓸 수 있는 JSON 모습으로 변환
##### inline="javascript" each 사용
```html
<script th:inline="javascript">  
    [# th:each="user, stat : ${users}"]  
    var user[[${stat.count}]] = [[${user}]];  
    [/]  
</script>
```
---
```html
<script>
    var user1 = {"username":"userA","age":10};
    var user2 = {"username":"userB","age":20};
    var user3 = {"username":"userC","age":30};
</script>
```
#### 반복문 th:each
##### 단순 반복문
```html
<table border="1">  
  <tr>  
    <th>username</th>  
    <th>age</th>  
  </tr>  
  <tr th:each="user : ${users}">  
    <td th:text="${user.username}">username</td>  
    <td th:text="${user.age}">0</td>  
  </tr>  
</table>
```
##### 반복문 상태까지 반환
- `index` : index 값 반환
- `count`: 몇개째인지
- `size` : 총 몇개인지
- `even` : 홀수 번째인지
- `odd` : 짝수 번째인지
- `first` : 첫번째 목록인지
- `last` : 마지막 목록인지
- `current` : 현재 객체
```html
<table border="1">  
  <tr>  
    <th>count</th>  
    <th>username</th>  
    <th>age</th>  
    <th>etc</th>  
  </tr>  
  <tr th:each="user, userStat : ${users}">  
    <td th:text="${userStat.count}">username</td>  
    <td th:text="${user.username}">username</td>  
    <td th:text="${user.age}">0</td>  
    <td>      index = <span th:text="${userStat.index}"></span>  
      count = <span th:text="${userStat.count}"></span>  
      size = <span th:text="${userStat.size}"></span>  
      even? = <span th:text="${userStat.even}"></span>  
      odd? = <span th:text="${userStat.odd}"></span>  
      first? = <span th:text="${userStat.first}"></span>  
      last? = <span th:text="${userStat.last}"></span>  
      current = <span th:text="${userStat.current}"></span>  
    </td>  
  </tr>  
</table>
```
###### 생략 방법
```html
<tr th:each="user : ${users}">  
    <td th:text="${userStat.count}">username</td>  
    <td th:text="${user.username}">username</td>  
    <td th:text="${user.age}">0</td>  
    <td>      index = <span th:text="${userStat.index}"></span>  
      count = <span th:text="${userStat.count}"></span>  
      size = <span th:text="${userStat.size}"></span>  
      even? = <span th:text="${userStat.even}"></span>  
      odd? = <span th:text="${userStat.odd}"></span>  
      first? = <span th:text="${userStat.first}"></span>  
      last? = <span th:text="${userStat.last}"></span>  
      current = <span th:text="${userStat.current}"></span>  
    </td>  
  </tr>  
```
이것처럼 반복시 받는 변수의 이름의 뒤에 `Stat`붙여주면 반복상태를 사용할 수 있음

#### th:if th:unless
th:if 의 경우 조건을 만족할 경우 표시, 만족하지 않을 경우 태그 자체를 쓰지 않음
th:unless 의 경우 조건을 만족할 경우 태그 자체를 쓰지 않음, 만족하지 않을 경우 표시
```html
<span th:text="'미성년자'" th:if="${user.age lt 20}"></span>
<span th:text="'미성년자'" th:unless="${user.age ge 20}"></span>
```
#### th:switch
```html
<td th:switch="${user.age}">
	<span th:case="10">10살</span>
	<span th:case="20">20살</span>
	<span th:case="*">기타</span>
</td>
```
#### th:block
타임리프의 유일한 자체 태그
[[1.React]] 의 `<></>` 문법같이 묶어서 사용하기 위해 쓰는 방법
```html
<th:block th:each="user : ${users}">  
    <div>  
        사용자 이름1 <span th:text="${user.username}"></span>  
        사용자 나이1 <span th:text="${user.age}"></span>  
    </div>  
    <div>요약 <span th:text="${user.username} + ' / ' + ${user.age}"></span>  
    </div>  
</th:block>
```
<span style="background:#d4b106">출력</span>
```html
<div>
	사용자 이름1 <span>userA</span>
	사용자 나이1 <span>10</span>
</div>
<div>
	요약 <span>userA / 10</span>
</div>
...
```
#### th:field Form 관련
#Form
`th:field`를 선언하게 되면 `id`, `name`, `th:value` 대신 작성
```html
<input type="text" id="itemName" name="itemName" class="form-control" placeholder="이름을 입력하세요">
```
---
```html
<input type="text" th:field="${item.itemName}" class="form-control" placeholder="이름을 입력하세요">
```
혹시 반복문 안에서 호출될 경우 자동으로 1, 2, 3 등의 이름을 붙임
```html
<!-- multi checkbox -->  
<div>  
	<div>등록 지역</div>  
	<div th:each="region : ${regions}" class="form-check form-check-inline">  
		<input type="checkbox" th:field="*{regions}" th:value="${region.key}" class="form-check-input">  
		<label th:for="${#ids.prev('regions')}" th:text="${region.value}" class="form-check-label">서울</label>  
	</div>  
</div>
```
---
```html
<div>  
	<div>등록 지역</div>  
	<div class="form-check form-check-inline">  
			<input type="checkbox" value="BUSAN" class="form-check-input" id="regions1" name="regions"><input type="hidden" name="_regions" value="on">  
			<label for="regions1" class="form-check-label">부산</label>  
	</div>  
	<div class="form-check form-check-inline">  
			<input type="checkbox" value="JEJU" class="form-check-input" id="regions2" name="regions"><input type="hidden" name="_regions" value="on">  
			<label for="regions2" class="form-check-label">제주</label>  
	</div>  
	<div class="form-check form-check-inline">  
			<input type="checkbox" value="SEOUL" class="form-check-input" id="regions3" name="regions"><input type="hidden" name="_regions" value="on">  
			<label for="regions3" class="form-check-label">서울</label>  
	</div>  
</div>
```
#### th:object Form 관련
#Form 
```java
@GetMapping("/add")  
public String addForm(Model model) {  
    model.addAttribute("item", new Item());  
    return "form/addForm";  
}
```
```html
<form action="item.html" th:action th:object="${item}" method="post">  
	<input type="text" th:field="*{itemName}" placeholder="이름을 입력하세요">
	<input type="text" th:field="*{price}" placeholder="가격을 입력하세요">  
	<input type="text" th:field="*{quantity}"placeholder="수량을 입력하세요">
```
item 으로 넘겨주게 되면 `th:object` 사용하여 해당 객체로 바로 넣어줄 수 있으며 `*{...}` 를 이용해서 이름을 생략하고 내부 변수를 바로 호출 할 수 있음
#### th:for label 관련
#Form 
```html
<!-- multi checkbox -->  
<div>  
    <div>등록 지역</div>  
    <div th:each="region : ${regions}" class="form-check form-check-inline">  
        <input type="checkbox" th:field="*{regions}" th:value="${region}" class="form-check-input">  
        <label th:for="${#ids.prev('regions')}" th:text="${region.value}" class="form-check-label">서울</label>  
    </div>  
</div>
```
아마 `th:field`로 등록된 `id`가 `ids`에 등록되어서 그 이전에 등록 한 것 또는 그 이후에 등록한 것을 찾는 방법을 나타내는 것으로 보임
#### 에러 처리
`th:errors` `th:errorclass`로 에러 발생시 처리
`th:errors(필드)` : 의 에러가 [[2.Ref(데이터 및 정보 저장)/Spring/Validator/BindingResult|BindingResult]] 통해서 전달된다면 에러값을 출력
`th:errorclass(CSS-Class)` : errors가 맞을 경우 넣은 css class를 등록

#### checkbox 만들기
```html
<!-- multi checkbox -->  
<div>  
    <div>등록 지역</div>  
    <div th:each="region : ${regions}" class="form-check form-check-inline">  
        <input type="checkbox" th:field="*{regions}" th:value="${region}" class="form-check-input">  
        <label th:for="${#ids.prev('regions')}" th:text="${region.value}" class="form-check-label">서울</label>  
    </div>  
</div>
```
#### radio 만들기
```html
<!-- radio button -->  
<div>  
  <div>상품 종류</div>  
  <div th:each="type : ${itemTypes}" class="form-check form-check-inline">  
    <input type="radio" th:field="*{itemType}" th:value="${type.name()}" class="form-check-input">  
    <label th:for="${#ids.prev('itemType')}" th:text="${type.description}" class="form-check-label">  
      BOOK  
    </label>  
  </div>  
</div>
```
#### enum 직접 접근 방법
```html
<!-- radio button enum 직접 접근 -->  
<div>  
    <div>상품 종류</div>  
    <div th:each="type : ${T(hello.itemservice.domain.item.ItemType).values()}" class="form-check form-check-inline">  
        <input type="radio" th:field="${item.itemType}" th:value="${type.name()}" class="form-check-input">  
        <label th:for="${#ids.prev('itemType')}" th:text="${type.description}" class="form-check-label">  
            BOOK  
        </label>  
    </div>  
</div>
```
`${T(classpath)}` 해당 방법으로 enum 타입을 직접적으로 참조 가능
#### select 만들기
```html
<!-- SELECT -->  
<div>  
  <div>배송 방식</div>  
  <select th:field="*{deliveryCode}" class="form-select">  
    <option value="">==배송 방식 선택==</option>  
    <option th:each="deliveryCode : ${deliveryCodes}" th:value="${deliveryCode.code}"  
            th:text="${deliveryCode.displayName}">FAST</option>  
  </select>  
</div>
```
선택 상태로 만들려면 `<option value="SLOW" selected=selected>느린배송</option>` 이렇게 넣어줘야하는데 `th:field` 로 등록할 경우 자동으로 `selected`를 설정
### 주석
##### Html 주석
```html
<!--  
<span th:text="${data}">html data</span> 
-->
```
##### 타임리프 파서 주석
```html
<!--/* [[${data}]] */-->
<!--/*-->
 <span th:text="${data}">html data</span>
 <!--*/-->
```
첫번째 것은 한줄짜리 주석
두번째 것은 여러줄 주석
##### 타임리프 프로토타입 주석
타임리프로 랜더링이 되었을 경우만 정상적인 태그로 출력하는 방법
```html
<!--/*/  
<span th:text="${data}">html data</span> 
/*/-->
```

## 주의사항
### Spring 사용시 발생 문제
#### html checkbox 사용시 false 전달에 통신상 null 을 전달
해결 방법은 히든 필드를 추가하는 방법이 있다
```html
<input type="checkbox" id="open" name="open" class="form-check-input">  
<label for="open" class="form-check-label">판매 오픈</label>
```
기존에는 이런 형식으로 `Form` 데이터를 전송하게 되면 `open` `checkBox` 는 true 일때는 `on`이라는 값이 넘어가지만 없을 경우 아무런 값도 전달하지 않는 문제 발생
```html
<input type="checkbox" id="open" name="open" class="form-check-input">  
<input type="hidden" name="_open" value="on"/>  
<label for="open" class="form-check-label">판매 오픈</label>
```
해당 방법처럼 히든 값인 `name=_원래이름` 으로 넣어줄 경우 원래 값이 true/false 값으로 정상적으로 전달
##### thymeleaf 해결 방법
```html
<input type="checkbox" th:field="*{open}" class="form-check-input">  
<label for="open" class="form-check-label">판매 오픈</label>
```
`th:field` 해줄 경우 자동으로 `<input type="hidden" name="_open" value="on"/>` 붙여서 전달하여 해결

