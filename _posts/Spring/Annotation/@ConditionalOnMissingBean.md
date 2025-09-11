---
aliases:
  - "@ConditionalOnMissingBean"
tags:
  - Spring
  - Annotation
  - Spring/Configration
특징: 
---
# @ConditionalOnMissingBean
- 인자로 들어오는 클래스가 없다면 해당 클래스를 등록
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ConditionalOnClass|@ConditionalOnClass]] 기능과 반대

```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnMissingBean(JdbcOperations.class)
class JdbcTemplateConfiguration {
	@Bean
	@Primary
	JdbcTemplate jdbcTemplate(DataSource dataSource, JdbcProperties properties)
	{
		JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
		JdbcProperties.Template template = properties.getTemplate();
		jdbcTemplate.setFetchSize(template.getFetchSize());
		jdbcTemplate.setMaxRows(template.getMaxRows());
		if (template.getQueryTimeout() != null) {
			jdbcTemplate.setQueryTimeout((int)
			template.getQueryTimeout().getSeconds());
		}
		return jdbcTemplate;
	}
}
```