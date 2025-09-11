---
aliases:
  - "@EnableJpaAuditing"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 
---
# @EnableJpaAuditing
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Spring Data JPA|Spring Data JPA]] 에서 JPA Auditing 기능을 활성화하는데 사용
- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]]가 생성되거나 수정될 때 자동으로 날짜와 시간을 기록하는 기능 제공
- 사용자 정보를 자동으로 등록하는 방법으로도 효과적
## 🚨 주의사항
## 🔍 속성 설명
### 📌
## 🛠 사용 예제
- [사용자 정보 자동 입력 방법1](https://javacpro.tistory.com/85)
- [사용자 정보 자동 입력 방법2](https://velog.io/@wonizizi99/SpringData-JPA-Auditing)
- [사용자 정보 자동 입력 방법3](https://eoneunal.tistory.com/33)
### 기존의 사용 방법
```java
@Getter
@MappedSuperclass
public class JpaBaseEntity {
  @Column(updatable = false)
  private LocalDateTime createdDate;
  private LocalDateTime updatedDate;

  @PrePersist
  public void prePersist() {
    LocalDateTime now = LocalDateTime.now();
    createdDate = now;
    updatedDate = now;
  }

  @PreUpdate
  public void preUpdate() {
    updatedDate = LocalDateTime.now();
  }
}

@Entity
@Getter @Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"id", "username"})
@NamedEntityGraph(name = "Member.all", attributeNodes = @NamedAttributeNode("team"))
public class Member extends JpaBaseEntity {
  @Id @GeneratedValue
  @Column(name = "member_id")
  private Long id;
  private String username;
  private int age;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "team_id")
  Team team;
}
```
### @EnableJpaAuditing 사용한 방법
```java
@EntityListeners(AuditingEntityListener.class)  
@Getter  
@MappedSuperclass  
public class BaseEntity {  
  @CreatedDate  
  @Column(updatable = false)  
  private LocalDateTime createdDate;  
  @LastModifiedDate  
  private LocalDateTime lastModifiedDate;  
  @CreatedBy  
  @Column(updatable = false)  
  private String createdBy;  
  @LastModifiedBy  
  private String lastModifiedBy;  
}

@Entity  
@Getter @Setter  
@NoArgsConstructor(access = AccessLevel.PROTECTED)  
public class Member extends BaseEntity {  
  @Id @GeneratedValue  
  @Column(name = "member_id")  
  private Long id;  
  private String username;  
  private int age;  
  
  @ManyToOne(fetch = FetchType.LAZY)  
  @JoinColumn(name = "team_id")  
  Team team;
}

@EnableJpaAuditing
@SpringBootApplication
public class DataJpaApplication {
	public static void main(String[] args) {
		SpringApplication.run(DataJpaApplication.class, args);
	}

	// 사용할 때는 아이디 값이나 계정 정보를 넣어주면 됨
	@Bean
	public AuditorAware<String> auditorProvider() {
		return () -> {
			return java.util.Optional.of(UUID.randomUUID().toString());
		};
	}
}
```