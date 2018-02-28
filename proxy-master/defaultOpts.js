const { URL } = require('url')
const queryString = require('query-string')
const fs = require('fs')
const path = require('path')
const { host, port } = require('./cfg')

// function logProvider(provider) {
//   var logger = new (require('winston').Logger)();

//   var defaultProvider = {
//       log: logger.log,
//       debug: logger.debug,
//       info: logger.info,
//       warn: logger.warn,
//       error: logger.error
//   }
//   return defaultProvider;
// }

exports = module.exports = {
  filter: filter,
  changeOrigin: true,             // for vhosted sites, changes host header to match to target's host
  // logLevel: 'info',
  // logProvider: logProvider,
  onProxyReq: onProxyReq,
  onProxyRes: onProxyRes
}

function onProxyReq(proxyReq, req, res) {
  // add custom header to request 
  // proxyReq.setHeader('x-added', 'foobar');
  // or log the req 
}

function onProxyRes(proxyRes, req, res) {
  if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302) {
    let location = proxyRes.headers.location
    // let url = new URL(req.headers.host + location)
    let search = location.substr(location.indexOf('?'))
    let query = queryString.parse(search)
    if (query.fromurl) {
      let redirectUrl = new URL(query.fromurl)
      if (redirectUrl.host === 'teacher.235.mistong.com' || redirectUrl.host === 'my.235.mistong.com') {
        console.log('origin redirect url: ' + location)

        query.fromurl = query.fromurl.replace(redirectUrl.host, 'localhost:' + port)
        proxyRes.headers.location = proxyRes.headers.location.replace(search, '?' + queryString.stringify(query))
      }
    }
    console.log('modified redirect to: ' + proxyRes.headers.location)
  }
  // proxyRes.headers['x-added'] = 'foobar';     // add new header to response 
  // delete proxyRes.headers['x-removed'];       // remove header from response 
}

/**
 * @param {String} pathname
 * @param {Object} req
 * @return {Boolean}
 */
function filter(pathname, req) {
  let parentDir = pathname.substr(0, pathname.lastIndexOf('/'))
  var files = fetchFiles('./static' + parentDir)
  if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
          const fileName = files[i]
          let fileNameWithoutExtension = fileName.substr(6).replace(/\\/g, '/')
          if (pathname.lastIndexOf('.') === -1) {
              fileNameWithoutExtension = fileNameWithoutExtension.substr(0, fileNameWithoutExtension.lastIndexOf('.'))
          }
          if (pathname === fileNameWithoutExtension) {
              return false
          }
      }
  }

  return true
}

/**
* 文件遍历方法
* @param filePath 需要遍历的文件路径
*/
function fetchFiles(filePath, recursive) {
  let fileNames = []
  try {
      //根据文件路径读取文件，返回文件列表
      let files = fs.readdirSync(filePath)
      //遍历读取到的文件列表
      files.forEach((filename) => {
          //获取当前文件的绝对路径
          var filedir = path.join(filePath, filename)
          try {
              //根据文件路径获取文件信息，返回一个fs.Stats对象
              let stats = fs.statSync(filedir)

              var isFile = stats.isFile(); //是文件
              var isDir = stats.isDirectory(); //是文件夹
              if (isFile) {
                  fileNames.push(filedir)
                  console.log(filedir)
              }
              if (isDir && recursive) {
                  fileNames.push(fetchFiles(filedir)); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
              }
          } catch (error) {
              console.warn(error)
          }
      })
  } catch (error) {
      console.warn(error)
  }

  return fileNames
}
