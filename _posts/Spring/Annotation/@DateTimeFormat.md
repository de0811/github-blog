---
aliases:
  - "@DateTimeFormat"
tags:
  - Annotation
  - Spring
  - Spring/Request
  - Spring/Converter
특징: String To Date | Date To String
---
# @DateTimeFormat
날짜 관련 형식 지정 포맷터 사용
`Jsr310DateTimeFormatAnnotationFormatterFactory`

```java
@Data
class Form {
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime localDateTime;
}
```