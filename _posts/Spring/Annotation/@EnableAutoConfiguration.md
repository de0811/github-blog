---
aliases:
  - "@EnableAutoConfiguration"
tags:
  - Spring
  - Spring/Configration
특징: 
---
# @EnableAutoConfiguration
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@AutoConfiguration|@AutoConfiguration]] 사용한 모든 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Configuration|@Configuration]]  자동으로 등록
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Import|@Import]] 통해서 [[2.Ref(데이터 및 정보 저장)/Spring/Configuration/ImportSelector|AutoConfigurationImportSelector]] 를 입력하여 모든 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@AutoConfiguration|@AutoConfiguration]] 등록된 @Bean 검색