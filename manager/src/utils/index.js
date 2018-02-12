/**
 * Deepin clone an object
 * @param [Object] obj
 * @returns [Object] {*}
 */
const deepClone = function (obj) {
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

/**
 * Deepin clone an object
 * @param [Object] obj
 * @param [String] path
 * @param [String] value
 * @returns {*}
 */
const updateByPath = function (obj, path, value) {
    let pathSegs = path.split('.')
    let dummy = obj
    for (let i = 0; i < pathSegs.length; i++) {
      let path = pathSegs[i];
      if (dummy instanceof Array) {
        let index = parseInt(path)
        dummy = dummy[index]
      } else if (i === pathSegs.length - 1) {
        if (value === 'true') {
          value = true
        } else if (value === 'false') {
          value = false
        }
        dummy[path] = value
      } else {
        dummy = dummy[path]
      }
    }
  
    return obj
  }

export { deepClone, updateByPath }
