/**
 * Deepin clone an object
 * @param obj
 * @returns {*}
 */
function deepClone(obj) {
    if(typeof obj === 'object') {
        if(obj instanceof Array) {
            var newArr = [];
            for(var i = 0; i < obj.length; i++) newArr.push(obj[i]);
            return newArr;
        } else {
            var newObj = {};
            for(var key in obj) {
                newObj[key] = deepClone(obj[key]);
            }
            return newObj;
        }
    } else {
        return obj;
    }
}

export default deepClone
