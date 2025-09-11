---
aliases:
  - "@CrossOrigin"
tags:
  - Annotation
  - Spring
  - Spring/Security
특징: CORS 설정
---
# @CrossOrigin

인자 없이 사용할 경우 모든 도메인 모든 요청방식에 사용됨을 허용하겠다는 의미

```java
@RestController
@RequestMapping("/account")
public class AccountController{
	
    @CrossOrigin
    @RequestMapping("/{id}")
    public Account retrieve(@PathVariable Long id){
    	// ...
    }
    
    
    @RequestMapping(method = RequestMethod.DELETE, value = "/{id}")
    public void remove(@PathVariable Long id){
    // ...
    }
}
```


```java
@CrossOrigin(origins = "http://domain1.com, http://domain2.com")
@RequestController
@RequestMapping("/account")
public class AccountController{
	
    @RequestMapping("/{id}")
    public Account retrieve(@PathVariable Long id){
    	// ... 
    }
    
    @RequestMapping(method = RequestMethod.DELETE, value = "/{id}")
    public void remove(@PathVariable Long id){
    	// ...
    }
}
```
> 클래스 전체로 묶어서 사용하는 경우도 있음
