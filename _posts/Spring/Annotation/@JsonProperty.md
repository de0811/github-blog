---
aliases:
  - "@JsonProperty"
tags:
  - Spring
  - Spring/Request
  - Spring/Response
  - Spring/Converter
  - Spring/Controller
  - Annotation
  - Jackson
특징: Json -> 자바 객체 / 자바 객체 -> Json 할 때 사용할 이름 지정
isPublic: false
---
# @JsonProperty
- Json -> 자바 객체 / 자바 객체 -> Json 할 때 사용할 이름 지정
- 전달 받을 때 또는 전달할 때 Json 을 어떤 이름으로 지정할지 설정
- 가장 주된 사용 이유는 **서로 다른 네이밍 컨벤션(Naming Convention)을 맞추기 위함**
	* **JSON**: 필드 이름으로 **snake_case** (`user_name`)나 **kebab-case** (`user-name`)를 사용하는 경우가 많음
	* **Java**: 필드 이름으로 **camelCase** (`userName`)를 사용
```java
public class User {
    @JsonProperty("user_id")
    private Long userId;
    private String name;

    // 생성자, Getter
}

// 위 객체를 JSON으로 변환하면?
User user = new User(1L, "홍길동");
// 결과: {"user_id":1, "name":"홍길동"}
```
## 🚨 주의사항
* `@JsonProperty`는 **Getter/Setter**에도 붙일 수 있음
	*  만약 필드, Getter, Setter에 모두 다른 이름으로 어노테이션이 붙으면 예상치 못한 결과가 발생할 수 있으므로, **한 곳에만 일관되게 적용 필요**
* 이름을 지정하지 않고 `@JsonProperty`만 사용하면(`@JsonProperty()`) 해당 필드/메소드명을 그대로 JSON 키로 사용하겠다는 의미이며, 이는 보통 필드 접근 제어자(private) 등의 이유로 Jackson이 해당 필드를 자동으로 인식하지 못할 때 명시적으로 포함시키기 위해 사용
## 🔍 속성 설명
### `access` 속성: 읽기/쓰기 제어
`@JsonProperty`의 `access` 속성을 사용하면 특정 필드를 **읽기 전용** 또는 **쓰기 전용**으로 설정
* `Access.READ_ONLY`: **Serialization(객체→JSON)에서만 사용** JSON으로 보낼 때는 포함되지만, 받을 때는 무시
* `Access.WRITE_ONLY`: **Deserialization(JSON→객체)에서만 사용** JSON 데이터를 받을 때는 포함되지만, 보낼 때는 무시 (예: 비밀번호)
* `Access.READ_WRITE`: 기본값으로, 읽고 쓰는 모든 경우에 사용
```java title:"사용 예제 (비밀번호 필드)"
public class Member {
    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password; // 회원가입 시 JSON으로 받기는 하지만, 응답으로 절대 보내지 않음
}

// Member 객체를 JSON으로 변환 시 password 필드는 결과에서 제외됨
// 결과: {"username":"testuser"}
```
## 🛠 사용 예제
```java
@Getter
public class ReqAuditLogDto {
  private WORK_TYPE workType;
  @Setter
  @JsonProperty("who")
  private String who;

  @JsonProperty("work-type")
  public void setWorkType(String workType) {
    this.workType = WORK_TYPE.codeToResult(workType);
  }

  public void setWho(String who, String defaultWho) {
    if (ObjectUtil.isEmpty(who)) {
      this.who = defaultWho;
    } else {
      this.who = who;
    }
  }
}
```
### 메소드 사용 예제
```java
@Getter
public class ReqAuditLogDto {
  private WORK_TYPE workType;
  
  @Setter
  @JsonProperty("who") // "who"라는 JSON 키를 who 필드에 매핑
  private String who;

  // "work-type"이라는 JSON 키를 setWorkType 메소드에 매핑
  // JSON 데이터를 받을 때(Deserialization) 이 메소드가 호출됨
  @JsonProperty("work-type")
  public void setWorkType(String workType) {
    // 문자열 코드를 enum 타입으로 변환하는 로직 수행
    this.workType = WORK_TYPE.codeToResult(workType);
  }

  // 이 메소드는 @JsonProperty와 직접적인 관련은 없는 일반 메소드
  public void setWho(String who, String defaultWho) {
    if (ObjectUtil.isEmpty(who)) {
      this.who = defaultWho;
    } else {
      this.who = who;
    }
  }
}
```

