exports = module.exports = {
    // host: '0.0.0.0',                // 服务绑定 IP
    port: 8700,                         // 服务绑定端口
    fiddleAspRoute: true, // 模拟 asp.net MVC 路由，举个栗子，/home/test 将优先路由到 {staticRoot}/home/test.html，若文件不存在则使用代理
    // 代理配置， 参见 http-proxy-middleware
    context: ['/'],
    changeOrigin: true,
    target: 'http://teacher.235.mistong.com',
    router: {
        '/chimurai/http-proxy-middleware': 'https://github.com'
    },
    // test path with regexp, forward to the target if matched
    regExpRoutes: [
        {
            regExp: /docs/i,    // 单个正则，或是正则数组 [ /GetClassIndexEvaluationData$/i ]
            target: 'https://doc.react-china.org'
        }
    ],
    // xmlHttRequestTarget: 'http://localhost:8090' // for all request that x-request-with header is 'XMLHttpRequest'
}