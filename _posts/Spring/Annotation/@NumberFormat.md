---
aliases:
  - "@NumberFormat"
tags:
  - Annotation
  - Spring
  - Spring/Request
  - Spring/Converter
특징: String To Number | Number To String
---
# @NumberFormat
숫자 관련 형식 지정 포맷터 사용, `NumberFormatAnnotationFormatterFactory`

```java
@Data
class Form {
	@NumberFormat(pattern = "###,###")
	private Integer number;
}
```