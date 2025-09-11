---
aliases:
  - "@Builder"
  - "@SuperBuilder"
tags:
  - Annotation
  - Annotation/생성자
  - Lombok
특징: 빌더 패턴 자동 구현
isPublic: true
---
# @Builder
- 빌드 패턴으로 자동 구현
- 가독성과 안정성을 높임
## 장점
- 가독성 향상 : 설정하는 값이 무엇인지 명확함
- 유연한 객체 생성 : 생성자는 정해진 매개변수를 모두 받아야하지만 빌더는 원하는 필드만 선택적으로 설정
- 안정성(객체 불변성) : `setter` 통해 내부 값 변경을 막을 수 있음(보통 `final` 을 붙여서 더 명확하게 사용)
## 단점
### Entity, Jackson 사용 까다로움
- 생성자 관리의 복잡성 증가(Entity, Jackson 사용 불가)
	- `@Builder` 모든 필드를 인자로 받는 생성자 [[@AllArgsConstructor ]] 자동으로 생성
	- 이 과정에서 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@NoArgsConstructor|@NoArgsConstructor]] 기본 생성자가 사라짐
	- JPA [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|Entity]] 나 Jackson 는 기본 생성자가 필요하여 에러 발생
- 해결 방법
```java title:"Entity, Jackson에서도 사용할 방법"
@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA를 위해 기본 생성자 추가
@AllArgsConstructor // Builder가 사용할 생성자 추가
public class Member {
    // ... 필드
}
```
### 기본값 설정 까다로움
- `@Builder.Default` 를 사용해야만 기본 값 설정 가능
### 필수 값 설정 방법
- 선택적 값을 설정하는 방법이기 때문에 컴파일 시점에 강제할 수 없음
- 해결방법
	- [[2.Ref(데이터 및 정보 저장)/Spring/Validator/Bean Validation|Bean Validation]] 방법으로 런타임 중에 에러 발생
```java
import lombok.Builder;
import lombok.NonNull;

@Builder
public class User {
    @NonNull // name 필드는 필수!
    private String name;
    private int age; // 선택
}

// User.builder().age(20).build(); -> name이 null이므로 NPE 발생
```
### 상속 구조의 한계
- 상속할 때 `@Builder` 사용할 경우 부모 필드를 무시
- 해결방법
	- 상속 진행 시 `@Builder` 사용은 불가능하고 `@SuperBuilder`를 사용해야함

## 🛠 사용 예제
### 기본 사용 방법
```java
import lombok.Builder;

@Builder
public class Member {
    private final String name;
    private final int age;
}
```

**사용 예시:**
```java
// 필요한 값만 설정하여 유연하게 객체 생성
Member member = Member.builder()
    .name("홍길동")
    .age(30)
    .build();
```
### 필드 기본값 설정: `@Builder.Default`
`@Builder` 사용 시 필드에 직접 초기값을 할당하면 무시됩니다. 반드시 **`@Builder.Default`** 어노테이션을 함께 사용

```java
@Builder
public class ApiRequest {
    private String url;
    
    @Builder.Default
    private int timeout = 5000; // timeout을 설정하지 않으면 기본값으로 5000이 사용됨
}
```
### 생성자 함께 사용하기
`@Builder`는 모든 필드를 포함하는 생성자(`@AllArgsConstructor`)를 자동 생성
만약 기본 생성자(`@NoArgsConstructor`)가 필요하다면 (e.g., JPA Entity, Jackson 직렬화), 명시적으로 추가해야함

```java
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 기본 생성자 추가
@AllArgsConstructor // 모든 필드 생성자 추가
public class User {
    private String name;
    private String email;
}
```
### 3. 상속 관계에서 빌더 사용: `@SuperBuilder`
부모 클래스와 자식 클래스에서 모두 빌더를 사용해야 할 경우, 일반 `@Builder`는 부모 필드를 제대로 처리하지 못함
이럴 땐 **`@SuperBuilder`**를 사용

```java
@Getter
@SuperBuilder
public class Parent {
    private String parentField;
}

@Getter
@SuperBuilder
public class Child extends Parent {
    private String childField;
}

// 사용 예시
// 부모만 따로 사용도 가능
Parent parent = Parent.builder()
    .parentField("본인값")
    .build();
// 상속 사용도 가능
Child child = Child.builder()
    .parentField("부모값") // 부모 필드도 설정 가능
    .childField("자식값")
    .build();
```
### 커스텀 빌더 사용 방법
[[2.Ref(데이터 및 정보 저장)/Intellij/Lombok|Lombok]]의 `@Builder`는 `[클래스명]Builder` 라는 이름의 내부 클래스가 **이미 존재하면**, 새로 빌더 클래스를 생성하는 대신 **기존 클래스를 그대로 사용**
이를 이용해 원하는 메소드만 오버라이드하거나 추가할 수 있음
```java title:"커스텀 빌더 사용 방법"
@Data
@Builder
public class FindApplyInfoDto {
  //검색용으로 사용
  private String appId;
  private List<String> appIds;
  private String uploader;
  private LocalDateTime findRegStartDt;
  private LocalDateTime findRegEndDt;

  // Builder Custom
  public static class FindApplyInfoDtoBuilder {
    public FindApplyInfoDtoBuilder findRegStartDt(LocalDateTime findRegStartDt) {
      this.findRegStartDt = findRegStartDt;
      return this;
    }

    public FindApplyInfoDtoBuilder findRegEndDt(LocalDateTime findRegEndDt) {
      this.findRegEndDt = findRegEndDt;
      return this;
    }

    public FindApplyInfoDtoBuilder findRegStartDt(String strFindRegStartDt) {
      if (ObjectUtil.isNotEmpty(strFindRegStartDt)) {
        strFindRegStartDt = strFindRegStartDt.replace("%20", " ");
        this.findRegStartDt = DateTimeUtil.stringToLocalDateTime(strFindRegStartDt);
      }

      return this;
    }

    public FindApplyInfoDtoBuilder findRegEndDt(String strFindRegEndDt) {
      if (ObjectUtil.isNotEmpty(strFindRegEndDt)) {
        strFindRegEndDt = strFindRegEndDt.replace("%20", " ");
        this.findRegEndDt = DateTimeUtil.stringToLocalDateTime(strFindRegEndDt);
      }

      return this;
    }

    public FindApplyInfoDtoBuilder appIds(List<String> appIds) {
      this.appIds = appIds;
      return this;
    }

    public FindApplyInfoDtoBuilder appIds(String strAppIds) {
      List<String> appIds = new ArrayList<>();
      if (ObjectUtil.isNotEmpty(strAppIds)) {
        appIds = Arrays.asList(strAppIds.split(","));
      }
      this.appIds = appIds;

      return this;
    }
  }
}

```