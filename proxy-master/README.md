# Devlopment 前置代理
## Features
- 本地资源优先
- 兼容 ASP.NET MVC 视图路由
- 扩展请求 path 的正则匹配，代理到指定 host
- 支持级联
- 代理监控
- 兼容 webpack-dev-server proxy, 可直接移植

## 代理规则及特性优先级
0.  本地资源
1.  ASP.NET MVC 路由模拟
2.  context 代理判别
3.  router 路由表配置
4.  regExpRoutes 正则路由表配置
5.  X-Requested-With: XMLHttpRequest 请求头匹配

唯一配置文件 cfg.js