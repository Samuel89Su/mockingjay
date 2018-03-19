const assert = require('assert')
const redisClient = require('../../src/common/redisClient')

async function scan() {
    try {
        let keys = await redisClient.scanAsync(0, 'MATCH', 'api*', 'COUNT', 3)
        .then(
            (res)=>{
                return res
            },
            (err)=>{
                throw err
            })

        console.log(JSON.stringify(keys))
    } catch (error) {
        console.log(JSON.stringify(error))
    }
}

scan()
