'use strict'

const defaultConfig = {
    // fiddleAspRoute: true,           // 模拟 asp.net MVC 路由，举个栗子，/home/test 将优先路由到 {staticRoot}/home/test.html，若文件不存在则使用代理
    proxyOpts: {                    // 代理配置， 参见 http-proxy-middleware
        context: ['/'],
        changeOrigin: true,
        target: 'http://teacher.233.mistong.com',
        // router: {
        // },
        // test path with regexp, forward to the target if matched
        // regExpRoutes: [
        //     {
        //         regExp: /GetClassIndexEvaluationData$/i,    // 单个正则，或是正则数组 [ /GetClassIndexEvaluationData$/i ]
        //         target: 'http://localhost:57761',
        //     }
        // ],
        // xmlHttRequestTarget: 'http://localhost'      // for all request that x-request-with header is 'XMLHttpRequest'
    }
}

exports = module.exports = defaultConfig
