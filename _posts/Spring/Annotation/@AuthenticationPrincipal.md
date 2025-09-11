---
aliases:
  - "@AuthenticationPrincipal"
tags:
  - Spring
  - Spring/Security
  - Annotation
특징: 인증된 사용자의 세부 정보를 메소드 매개변수로 주입 받을 수 있게 해주는 어노테이션
---
# @AuthenticationPrincipal
인증된 사용자의 세부 정보를 메소드 매개변수로 주입 받을 수 있게 해주는 어노테이션

**[[AuthenticationPrincipalArgumentResolver]]** 클래스를 통해 매개 변수로 사용할 수 있음
`UserDetails` 또는 `OAuth2User` 를 사용할 때 받아 올 수 있는 어노테이션

```java
@GetMapping("/")  
public String index(Model model, @RegisteredOAuth2AuthorizedClient OAuth2AuthorizedClient authorizedClient,  
   @AuthenticationPrincipal OAuth2User oauth2User) {  
  model.addAttribute("userName", oauth2User.getName());  
  model.addAttribute("clientName", authorizedClient.getClientRegistration().getClientName());  
  model.addAttribute("userAttributes", oauth2User.getAttributes());  
  return "index";  
}
```

```java
@GetMapping("/user")  
public @ResponseBody String user(@AuthenticationPrincipal PrincipalDetails principalDetails) {  
  System.out.println("Principal : " + principalDetails);  
  System.out.println("OAuth2 : "+principalDetails.getUser().getProvider());  
  // iterator 순차 출력 해보기  
  Iterator<? extends GrantedAuthority> iter = principalDetails.getAuthorities().iterator();  
  while (iter.hasNext()) {  
   GrantedAuthority auth = iter.next();  
   System.out.println(auth.getAuthority());  
  }  
  
  return "유저 페이지입니다.";  
}
```



## 아래 방법들의 단점 및 문제점들 때문에 해당 방법을 사용

```java
Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal(); 
UserDetails userDetails = (UserDetails)principal; 
String username = principal.getUsername(); 
String password = principal.getPassword();
```
> SecurityContextHolder 에서 직접 가져오는 방법

단점 : 해당 오브젝트를 `static` 으로 만들어서 사용할 수 있지만 비효율

```java
@Controller 
public class SecurityController { 

    @GetMapping("/username") 
    @ResponseBody 
    public String currentUserName(Principal principal) { 
        return principal.getName(); 
    } 
}
```
> Controller 에서 Principal 객체를 가져오는 방법

단점 : `Principal` 객체에서 쓸 수 있는 데이터는 `getName()` 밖에 없기에 쓸모가 없음

