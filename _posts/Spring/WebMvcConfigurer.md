---
aliases:
  - WebMvcConfigurer
tags:
  - Spring
---
# WebMvcConfigurer 
Spring 기능의 각종 것들을 확장하기 위해 필요

```java
@Bean
public WebMvcConfigurer webMvcConfigurer() {
	return new WebMvcConfigurer() {
		@Override
		public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {/*...*/}
		@Override 
		public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {/*...*/}
	};
}
```

## Global Validator 등록 방법
- [[2.Ref(데이터 및 정보 저장)/Spring/Validator/Validator|Validator]] 
- 모든 컨트롤러에서 사용하는 방법
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Validated-@Valid|@Validated-@Valid]] 어노테이션들을 이용해 사용 가능
#Spring/Validation
```java
@SpringBootApplication
 public class ItemServiceApplication implements WebMvcConfigurer {

     public static void main(String[] args) {
         SpringApplication.run(ItemServiceApplication.class, args);

}

@Override public Validator getValidator() { 
  return new ItemValidator();
  }
}
```

## HandlerExceptionResolver 등록 방법
[[2.Ref(데이터 및 정보 저장)/Spring/Exception/HandlerExceptionResolver|HandlerExceptionResolver]]
```java
@Configuration  
public class WebConfig implements WebMvcConfigurer {  
  @Override  
  public void extendHandlerExceptionResolvers(List<HandlerExceptionResolver> resolvers) {  
    resolvers.add(0, new MyHandlerExceptionResolver());  
  }
}
```
이 방법 말고 다른 방법이 하나 더 있는데
`configureHandlerExceptionResolvers(...)` 방법은 스프링이 기본으로 등록하는 `ExceptionResolver` 모두 제거한 뒤 추가하기 때문에 사용하지 않는 것을 추천

##  Converter 등록 방법
[[2.Ref(데이터 및 정보 저장)/Spring/변환기/Converter|Converter]]
```java
@Configuration
 public class WebConfig implements WebMvcConfigurer {
     @Override
     public void addFormatters(FormatterRegistry registry) {
         registry.addConverter(new StringToIntegerConverter());
         registry.addConverter(new IntegerToStringConverter());
         registry.addConverter(new StringToIpPortConverter());
         registry.addConverter(new IpPortToStringConverter());
		} 
	}
}
```
Spring 내부에서 `ConversionService`를 가지고 있으며 `WebMvcConfigurer.addFormatters()`를 이용해서 각종 컨버터를 등록할 수 있다. 

## Formatter 등록 방법
[[2.Ref(데이터 및 정보 저장)/Spring/변환기/Formatter|Formatter]]
```java
 @Configuration 
 public class WebConfig implements WebMvcConfigurer {

	@Override 
	public void addFormatters(FormatterRegistry registry) {
		//주석처리 우선순위  
		//registry.addConverter(new StringToIntegerConverter());
		//registry.addConverter(new IntegerToStringConverter()); 
		registry.addConverter(new StringToIpPortConverter()); 
		registry.addConverter(new IpPortToStringConverter());
		//추가
		registry.addFormatter(new MyNumberFormatter());
	}
}
```

## LocalValidatorFactoryBean 수동 설정
[[0.New Note/LocalValidatorFactoryBean|LocalValidatorFactoryBean]]
```java title:"error.properties 파일을 검증 메시지 소스로 사용하는 LocalValidatorFactoryBean 수동 등록"
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.validation.Validator;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // 1. 검증 메시지를 담은 MessageSource Bean을 등록
    @Bean
    public MessageSource validationMessageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        // `resources/errors.properties` 파일을 메시지 소스로 지정
        messageSource.setBasename("classpath:errors");
        messageSource.setDefaultEncoding("UTF-8");
        return messageSource;
    }

    // 2. LocalValidatorFactoryBean을 글로벌 Validator로 설정
    @Override
    public Validator getValidator() {
        LocalValidatorFactoryBean bean = new LocalValidatorFactoryBean();
        // 1번에서 등록한 MessageSource를 검증 메시지 소스로 사용하도록 설정
        bean.setValidationMessageSource(validationMessageSource());
        return bean;
    }
}
```

## 커스텀 HttpMessageConverter 등록
[[2.Ref(데이터 및 정보 저장)/Spring/변환기/HttpMessageConverter|HttpMessageConverter]] 
- `WebMvcConfigurer`를 사용하여 기본 컨버터를 바꾸거나 새로운 컨버터를 추가할 수 있음
```java title:"WebConfig.java"
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        // 기본 컨버터는 유지하면서, 새로운 커스텀 컨버터를 추가
        // 우선순위를 높이고 싶다면 리스트의 앞쪽(index 0)에 추가
        converters.add(0, new MyCustomConverter());
    }
}

```
- `extendMessageConverters`: 기존 컨버터 목록에 새 컨버터를 추가 (권장)
- `configureMessageConverters`: 기존 컨버터를 모두 무시하고 완전히 새로운 컨버터 목록을 설정