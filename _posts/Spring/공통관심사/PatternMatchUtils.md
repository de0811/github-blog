---
aliases:
  - PatternMatchUtils
tags:
  - Spring
  - Spring/공통처리
  - Spring/공통관심사
특징: 
---
# PatternMatchUtils
패턴 매칭에 관련된 것을 만들어줌
`*`(와일드카드) 문자만 지원
정규식과는 다른 방식
```java
public abstract class PatternMatchUtils {  
  // 주어진 패턴과 문자열이 간단한 패턴 매칭을 통해 일치하는지 확인합니다.  
  public static boolean simpleMatch(@Nullable String pattern, @Nullable String str);
  
  // 주어진 패턴 배열 중 하나라도 문자열과 매치되면 true를 반환합니다.  
  public static boolean simpleMatch(@Nullable String[] patterns, String str);
}
```