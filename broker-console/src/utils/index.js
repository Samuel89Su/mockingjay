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
    let pathSeg = pathSegs[i];
    if (dummy instanceof Array) {
      let index = parseInt(pathSeg)
      dummy = dummy[index]
    } else if (i === pathSegs.length - 1) {
      dummy = dummy[pathSeg]
    } else {
      dummy = dummy[pathSeg]
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
    let pathSeg = pathSegs[i];
    if (i === pathSegs.length - 1) {
      if (value === 'true') {
        value = true
      } else if (value === 'false') {
        value = false
      }
      if (dummy instanceof Array) {
        let index = parseInt(pathSeg)
        dummy[index] = value
      } else {
        dummy[pathSeg] = value
      }
    } else if (dummy instanceof Array) {
      let index = parseInt(pathSeg)
      if (index > dummy.length - 1) {
        dummy.push(dummy[0] instanceof Array?[]:(typeof dummy[0] === 'object'? {}:''))
      }
      dummy = dummy[index]
    } else {
      dummy = dummy[pathSeg]
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
    let pathSeg = pathSegs[i];
    if (dummy instanceof Array) {
      let index = parseInt(pathSeg)
      dummy = dummy[index]
    } else if (i === pathSegs.length - 1) {
      delete dummy[pathSeg]
    } else {
      dummy = dummy[pathSeg]
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

/**
 * convert object to array, DO NOT recursive
 * @param {Object} obj 
 * @returns {Array<Object>} [{key: '', value: ..}]
 */
function object2Array (obj) {
  let dummy = []
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            dummy.push({ key: key, value: value })
        }
    }
  }
  return dummy
}

/**
 * convert array to object, DO NOT recursive
 * @param {Array<Object>} [{key: '', value: ..}]
 * @returns {Object} 
 */
function array2Object (arr) {
  let dummy = {}
  if (arr && arr instanceof Array && arr.length > 0) {
    arr.forEach(kv => {
      if (kv.key && typeof kv.key === 'string'
        && kv.value) {
          dummy[kv.key] = kv.value
      }
    })
  }
  return dummy
}

export {
  deepClone,
  updateByPath,
  delByPath,
  getPropertyByPath,
  parseRecursive,
  object2Array,
  array2Object
}
