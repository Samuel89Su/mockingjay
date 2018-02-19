/**
 * 
 * @param {Boolean} desc true: desc, false: asc
 * @param {String} propName sort prop name
 * @param {Function} preProcessor process before compare
 * @returns {Function} 
 */
function getComparer (propName, desc, preProcessor) {
    if (!desc) {
        desc = false
    }

    if (!propName) {
        if (!desc) {
            return function sort (a, b) {
                return compare(a, b, preProcessor)
            }
        } else {
            return function sort (a, b) {
                return compare(b, a, preProcessor)
            }
        }
    } else {
        if (!desc) {
            return function sort (a, b) {
                return compare(a[propName], b[propName], preProcessor)
            }
        } else {
            return function sort (a, b) {
                return compare(b[propName], a[propName], preProcessor)
            }
        }
    }
}

function compare(a, b, preProcessor) {
    if (preProcessor) {
        a = preProcessor(a)
        b = preProcessor(b)
    }
    if (typeof a === 'string') {
        return a === b ? 0 : (a > b ? 1 : -1)
    } else if (!Number.isNaN(a)) {
        return a - b
    } else {
        return 0
    }
}

exports = module.exports = getComparer
