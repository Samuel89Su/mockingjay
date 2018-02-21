function parse(rawValue) {
    try {
        if (typeof rawValue === 'string') {
            try {
                rawValue = JSON.parse(rawValue)
                rawValue = parse(rawValue)
            } catch (err) {
                return rawValue
            }
        } else if (typeof rawValue === 'object') {
            if (rawValue instanceof Array) {
                for (let i = 0; i < rawValue.length; i++) {
                    const item = rawValue[i]
                    rawValue[i] = parse(item)
                }
            } else {
                for (const key in rawValue) {
                    if (rawValue.hasOwnProperty(key)) {
                        const prop = rawValue[key];
                        rawValue[key] = parse(prop)
                    }
                }
            }
        }

        return rawValue
    } catch (error) {
        // console.log(error)
    }
}

exports = module.exports = parse