---
aliases:
  - Tomcat
tags:
  - WebApplicationServer
  - WAS
  - WebServer
특징:
---
# Tomcat

## 서버 포트 변경
```xml title:"tomcat/conf/server.xml"
<Connector port="8080" protocol="HTTP/1.1"
					 connectionTimeout="20000"
					 redirectPort="8443" />
```
> `tomcat/conf/server.xml`

