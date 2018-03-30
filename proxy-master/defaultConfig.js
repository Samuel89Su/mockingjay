'use strict'

const fs = require('fs')
const userConfigPath = require('./src/configMgr').userConfigFileName

const defaultConfig = {
    host: '0.0.0.0', // 服务绑定 IP
    port: 8700, // 服务绑定端口
    staticRoot: './static', // 本地静态资源路径
    fiddleAspRoute: false, // 模拟 asp.net MVC 路由，举个栗子，/home/test 将优先路由到 {staticRoot}/home/test.html，若文件不存在则使用代理
    changeOrigin: true,
    // target: 'http://139.196.103.143',
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

let userConfig = {}
try {
    if (fs.existsSync(userConfigPath)) {
        let stat = fs.statSync(userConfigPath)
        if (stat && stat.isFile()) {
            let content = fs.readFileSync(userConfigPath, 'utf8')
            userConfig = JSON.parse(content)
        }
    }
} catch (error) {

}

var mergedConfig = Object.assign({}, defaultConfig, userConfig)

exports = module.exports = mergedConfig