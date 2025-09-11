---
aliases:
  - AccessLevel
tags:
  - Spring
  - Lombok
특징:
---
# AccessLevel
- 클래스나 필드, 메서드의 접근 수준을 설정
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Getter|@Getter]] [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Setter|@Setter]] [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@NoArgsConstructor|@NoArgsConstructor]] 등에서 사용
## 🚨 주의사항
## 🔍 속성 설명
```java
public enum AccessLevel {
  PUBLIC,
  MODULE,
  PROTECTED,
  PACKAGE,
  PRIVATE,
  NONE;

  private AccessLevel() {
  }
}
```
> `PUBLIC`: 공개 접근 수준
> `MODULE`: 모듈 접근 수준 (Java 9 이상)
> `PROTECTED`: 보호된 접근 수준
> `PACKAGE`: 패키지 접근 수준 (기본 접근 수준)
> `PRIVATE`: 비공개 접근 수준
> `NONE`: 접근 수준 없음
### 📌
## 🛠 사용 예제