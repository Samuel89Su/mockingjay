'use strict'

exports = module.exports = {
    host: '0.0.0.0',                // 服务绑定 IP
    port: 5000,                     // 服务绑定端口
    staticRoot: './static',         // 本地静态资源路径
    fiddleAspRoute: true,           // 模拟 asp.net MVC 路由，举个栗子，/home/test 将优先路由到 {staticRoot}/home/test.html，若文件不存在则使用代理
    proxyOpts: {                    // 代理配置， 参见 http-proxy-middleware
        context: ['/inventory'],
        changeOrigin: true,
        target: 'http://139.196.103.143',
        router: {
        },
        // test path with regexp, forward to the target if matched
        regExpRoutes: [
            {
                regExp: /GetClassIndexEvaluationData$/i,    // 单个正则，或是正则数组 [ /GetClassIndexEvaluationData$/i ]
                target: 'http://localhost:57761',
            }
        ],
        // xmlHttRequestTarget: 'http://localhost'      // for all request that x-request-with header is 'XMLHttpRequest'
    }
}