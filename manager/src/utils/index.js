/**
 * Deepin clone an object
 * @param [Object] obj
 * @returns [Object] {*}
 */
function deepClone (obj) {
  if (typeof obj === 'object') {
    if (obj instanceof Array) {
      var newArr = [];
      for (var i = 0; i < obj.length; i++) newArr.push(obj[i]);
      return newArr;
    } else {
      var newObj = {};
      for (var key in obj) {
        newObj[key] = deepClone(obj[key]);
      }
      return newObj;
    }
  } else {
    return obj;
  }
}

function getPropertyByPath (obj, path) {
  let pathSegs = path.split('.')
  let dummy = obj
  for (let i = 0; i < pathSegs.length; i++) {
    let path = pathSegs[i];
    if (dummy instanceof Array) {
      let index = parseInt(path)
      dummy = dummy[index]
    } else if (i === pathSegs.length - 1) {
      dummy = dummy[path]
    } else {
      dummy = dummy[path]
    }
  }

  return dummy
}

/**
 * update by path
 * @param [Object] obj
 * @param [String] path
 * @param [Object] value
 * @returns {Object}
 */
function updateByPath (obj, path, value) {
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

/**
 * delete propperty of object by path, return new object
 * @param [Object] obj
 * @param [String] path
 * @returns {Object}
 */
function delByPath (obj, path) {
  let pathSegs = path.split('.')
  let dummy = obj
  for (let i = 0; i < pathSegs.length; i++) {
    let path = pathSegs[i];
    if (dummy instanceof Array) {
      let index = parseInt(path)
      dummy = dummy[index]
    } else if (i === pathSegs.length - 1) {
      delete dummy[path]
    } else {
      dummy = dummy[path]
    }
  }

  return obj
}

function parseRecursive(data) {
  if (!data) {
  }
  else if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (error) {
    }
  } else if (typeof data === 'object' && data instanceof Array) {
    for (let i = 0; i < data.length; i++) {
      data[i] = parseRecursive(data[i])      
    }
  } else if (typeof data === 'object') {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const prop = data[key];
        data[key] = parseRecursive(prop)
      }
    }
  }

  return data
}

export {
  deepClone,
  updateByPath,
  delByPath,
  getPropertyByPath,
  parseRecursive
}
