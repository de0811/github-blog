---
aliases:
  - ExceptionTranslationFilter
tags:
  - Spring/Exception
  - Spring/Security
  - Spring
특징: Security Filter 에서 에러 처리
---
# ExceptionTranslationFilter
해당 필터가 호출 이후 순서의 필터의 에러만 처리
에러 발생 시 인증 관련 에러의 경우 [[2.Ref(데이터 및 정보 저장)/Spring/Security/AuthenticationEntryPoint|AuthenticationEntryPoint]]  호출
에러 발생 시 권한 관련 에러의 경우 [[2.Ref(데이터 및 정보 저장)/Spring/Security/AccessDeniedHandler|AccessDeniedHandler]] 호출

> [!caution] 인증 에러에 대한 고찰
기존의 시큐리티 필터들은 인증에러를 원래 반환하지 않음
[관련 내용](https://okky.kr/questions/1172081)
> 
> [[UsernamePasswordAuthenticationFilter]] 필터의 경우도 인증을 검증할 때 에러 발생 시 로그인 실패를 반환하지 에러를 그대로 반환하지 않음
> [[AuthenticationFailureHandler]] 사용하여 인증 에러를 처리하는게 합당




