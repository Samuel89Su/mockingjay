'use strict'

exports = module.exports = {
    host: '0.0.0.0',
    port: 3200,
    staticRoot: './static',
    proxyOpts: {
        changeOrigin: true,
        target: 'http://teacher.235.mistong.com',
        router: {
            // '/Teacher/PsychologyEvaluation/GetSchoolIndexEvaluationData': 'http://localhost:57761'
        }
    }
}