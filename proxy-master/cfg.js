'use strict'

exports = module.exports = {
    host: '0.0.0.0',                // 服务绑定 IP
    port: 3200,                     // 服务绑定端口
    staticRoot: './static',         // 本地静态资源路径
    fiddleAspRoute: true,           // 模拟 asp.net MVC 路由，举个栗子，/home/test 将优先路由到 {staticRoot}/home/test.html，若文件不存在则使用代理
    proxyOpts: {                    // 代理配置， 参见 http-proxy-middleware
        context: [],
        changeOrigin: true,
        target: 'http://teacher.235.mistong.com',
        router: {
            // '/Teacher/PsychologyEvaluation/GetSchoolIndexEvaluationData': 'http://localhost:57761'
        }
    }
}