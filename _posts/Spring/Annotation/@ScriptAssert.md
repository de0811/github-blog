---
aliases: 
tags:
  - Annotation
  - Spring
  - Spring/Validation
  - BeanValidation
특징: ObjectError 처리 (왠만하면 사용하지 않음)
---

```java
@ScriptAssert(lang = "javascript", script = "_this.price * _this.quantity >= 10000")
```
해당 방법은 기능이 너무 약하며 사용에 까다롭기 때문에 권장하지 않음
controller 에 java 소스로 작성하는 것을 추천