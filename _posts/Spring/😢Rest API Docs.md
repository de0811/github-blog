---
aliases:
  - Rest API Docs
tags:
  - Spring
특징:
---
# Rest API Docs
## Swagger
- 이쁨
- 직접 테스트 가능
- 어노테이션 기반이라 편함
- 단점 : 소스가 더러워짐

## Spring Rest Docs
- 테스트가 되어야만 문서 작성
- 개어려움
- 시발
- 확실함
- [공식문서](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/)


## restdocs-api-spec
- 확실함
- 개어려움
- 테스트가 되어야만 문서 작성
- Swagger UI 써서 이쁨



```java title:"단순 사용"
@AutoConfigureMockMvc  
@AutoConfigureRestDocs  
@SpringBootTest  
@ExtendWith({SpringExtension.class, RestDocumentationExtension.class})  
class TestControllerTest {  
  @Autowired private MockMvc mockMvc;  
  
  @BeforeEach  
  void setUp(WebApplicationContext webApplicationContext, RestDocumentationContextProvider restDocumentation) {  
    this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)  
      .apply(MockMvcRestDocumentation.documentationConfiguration(restDocumentation))  
      .build();  
  }  
  
  @Test  
  @DisplayName("test controller test")  
  void index() throws Exception {  
    mockMvc.perform(RestDocumentationRequestBuilders.get("/test").accept(MediaType.APPLICATION_JSON))  
      .andExpect(MockMvcResultMatchers.status().isOk())  
      .andExpect(MockMvcResultMatchers.content().string("Hello World"))  
      .andDo(MockMvcRestDocumentationWrapper.document("index"));  
  }
```

```sh title:"문서 만들기"
./gradlew openapi3
```

```sh title:"Swagger UI Docker 동작"
docker run -d -p 80:8080 --name swagger -e SWAGGER_JSON=/tmp/openapi3.json -v {openapi13.json 파일이 위치한 디렉토리 경로}:/tmp swaggerapi/swagger-ui
```

```sh title:"조져보쟈 ~"
docker run -d -p 80:8080 --name swagger -e SWAGGER_JSON=/tmp/openapi3.json -v /Users/sdm/Documents/SOURCE/TIKET/Tiket.server/build/api-spec:/tmp swaggerapi/swagger-ui
```


```yml title:"docker-compose.yml"
# swaggerui-docker-compose.yml
version: "3"
services:
  swagger:
    container_name: local-swagger
    image: swaggerapi/swagger-ui
    ports:
      - "8080:8080"
    env_file:
      - .env
```


구동에 성공해도 결과부분에 `Failed to fetch.` 등의 내용이 나오는데 그건 [[CORS]] 설정을 해야한다함
![[config/AttachedFile/Pasted image 20240621235321.png|600]]


# Swagger UI + Spring Rest docs = restdocs-api-spec  
Swagger UI 장점인 클라이언트 직접 테스트 가능  
Spring Rest Docs 장점인 테스트 코드를 통한 API 문서화  
두 장점을 합쳐서 사용할 수 있는 restdocs-api-spec 라이브러리 사용 방법  
  
## 순서  
1. build.gradle 파일에 restdocs-api-spec 라이브러리 추가  
2. SecurityConfig 작성  
3. 테스트 코드 작성  
4. build.gradle 등록한 openapi3 명령을 실행  
5. restdocs-api-spec 라이브러리를 통한 openapi3.json 파일 생성  
6. docker 통한 Swagger UI 실행  
  
### restdocs-api-spec 문서화를 위한 테스트 코드 실행 및 문서 생성  
```shell  
./gradlew openapi3  
```  
> 해당 과정을 거치면 build/api-spec 디렉토리에 openapi3.json 파일이 생성  
  
### docker 직접 실행 명령  
```shell title:"Swagger UI 실행"  
docker run -d -p 80:8080 --name swagger -e SWAGGER_JSON=/tmp/openapi3.json -v {openapi13.json 파일이 위치한 디렉토리 경로}:/tmp swaggerapi/swagger-ui  
```  
  
### docker-compose 실행  
```shell title:"docker-compose.yml"  
version: '3'  
services:  
  swagger-ui:    image: swaggerapi/swagger-ui  
    container_name: swagger  
    ports:  
      - "80:8080"  
    volumes:  
      - {openapi13.json 파일이 위치한 디렉토리 경로}:/tmp  
    environment:  
      SWAGGER_JSON: /tmp/openapi3.json  
```