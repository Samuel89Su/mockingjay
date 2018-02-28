exports = module.exports = {
    // filter: filter,
    target: 'http://teacher.235.mistong.com',
    router: {
        '/Teacher/PsychologyEvaluation/GetSchoolIndexEvaluationData': 'http://localhost:57761'
    }
}

/**
 * @param {String} pathname
 * @param {Object} req
 * @return {Boolean}
 */
function filter (pathname, req) {
    if ((pathname.match('/home/test') && req.method === 'GET')) {
        return false
    }
    return true
};