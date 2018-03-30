var _ = require('lodash')
var httpProxy = require('http-proxy')
var url = require('url')
const fs = require('fs')
const Path = require('path')
var configFactory = require('./config-factory')
var handlers = require('./handlers')
var contextMatcher = require('./context-matcher')
var PathRewriter = require('./path-rewriter')
var Router = require('./router')
var logger = require('./logger').getInstance()
var getArrow = require('./logger').getArrow

class ProxyContainer {
  constructor(arg) {
    this.Proxy = this.HttpProxyMiddleware.bind(this)
    this.middleware = this.middleware.bind(this)
    this.catchUpgradeRequest = this.catchUpgradeRequest.bind(this)
    this.handleUpgrade = this.handleUpgrade.bind(this)
    this.shouldProxy = this.shouldProxy.bind(this)
    this.prepareProxyRequest = this.prepareProxyRequest.bind(this)
    this.__applyRouter = this.__applyRouter.bind(this)
    this.__applyPathRewrite = this.__applyPathRewrite.bind(this)
    this.logError = this.logError.bind(this)
    this.fetchFiles = this.fetchFiles.bind(this)

    this.context = null
    this.opts = null
    this.proxyOptions = null
    this.pathRewriter = null
    this.proxy = null
    this.wsUpgradeDebounced = null
    this.wsInitialized = null
  }



  middleware(req, res, next) {
    if (this.shouldProxy(this.context, req)) {
      var activeProxyOptions = this.prepareProxyRequest(req)
      this.proxy.web(req, res, activeProxyOptions)
    } else {
      next()
    }

    if (this.proxyOptions.ws === true) {
      // use initial request to access the server object to subscribe to http upgrade event
      this.catchUpgradeRequest(req.connection.server)
    }
  }

  catchUpgradeRequest(server) {
    // subscribe once; don't subscribe on every request...
    // https://github.com/chimurai/http-proxy-middleware/issues/113
    if (!this.wsInitialized) {
      server.on('upgrade', this.this.wsUpgradeDebounced)
      this.wsInitialized = true
    }
  }

  handleUpgrade(req, socket, head) {
    // set to initialized when used externally
    this.wsInitialized = true

    if (this.shouldProxy(this.context, req)) {
      var activeProxyOptions = this.prepareProxyRequest(req)
      this.proxy.ws(req, socket, head, activeProxyOptions)
      logger.info('[HPM] Upgrading to WebSocket')
    }
  }


  /**
   * Determine whether request should be proxied.
   *
   * @private
   * @param  {String} context [description]
   * @param  {Object} req     [description]
   * @return {Boolean}
   */
  shouldProxy(context, req) {
    var reqPath = (req.originalUrl || req.url)
    let pathname = reqPath && url.parse(reqPath).pathname
    let doProxy = true
    if (req.method === 'GET' || req.method === 'HEAD') {
      if (pathname.lastIndexOf('.') > pathname.lastIndexOf('/')) {
        let filePath = Path.resolve(__dirname, '../', this.opts.staticRoot, './' + pathname)
        try {
          let stats = fs.statSync(filePath)
          if (stats.isFile()) {
            doProxy = false
          }
        } catch (error) {}
      }

      if (pathname.lastIndexOf('.') < pathname.lastIndexOf('/') && doProxy && this.opts.fiddleAspRoute) {
        let parentDir = pathname.substr(0, pathname.lastIndexOf('/'))
        let filePath = Path.resolve(__dirname, '../', this.opts.staticRoot, '.' + parentDir)
        var files = this.fetchFiles(filePath)
        if (files && files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            const fileName = files[i].replace(/\\/g, '/')
            let extension = fileName.substr(fileName.lastIndexOf('.'))
            if (fileName.lastIndexOf(pathname + extension) > -1) {
              // overwrite req.url
              req.url = req.url + extension
              req.originalUrl = req.originalUrl + extension
              doProxy = false
            }
          }
        }
      }
    }

    if (!doProxy) {
      return doProxy
    }

    return contextMatcher.match(context, reqPath, req)
  }



  /**
   * Apply option.router and option.pathRewrite
   * Order matters:
   *    Router uses original path for routing;
   *    NOT the modified path, after it has been rewritten by pathRewrite
   * @param {Object} req
   * @return {Object} proxy options
   */
  prepareProxyRequest(req) {
    // https://github.com/chimurai/http-proxy-middleware/issues/17
    // https://github.com/chimurai/http-proxy-middleware/issues/94
    req.url = (req.originalUrl || req.url)

    // store uri before it gets rewritten for logging
    var originalPath = req.url
    var newProxyOptions = _.assign({}, this.proxyOptions)

    // Apply in order:
    // 1. option.router
    // 2. option.pathRewrite
    this.__applyRouter(req, newProxyOptions)
    this.__applyPathRewrite(req, this.pathRewriter)

    // debug logging for both http(s) and websockets
    if (this.proxyOptions.logLevel === 'debug') {
      var arrow = getArrow(originalPath, req.url, this.proxyOptions.target, newProxyOptions.target)
      logger.debug('[HPM] %s %s %s %s', req.method, originalPath, arrow, newProxyOptions.target)
    }

    return newProxyOptions
  }

  // Modify option.target when router present.
  __applyRouter(req, options) {
    var newTarget

    if (options.router) {
      newTarget = Router.getTarget(req, options)

      if (newTarget) {
        logger.debug('[HPM] Router new target: %s -> "%s"', options.target, newTarget)
        options.target = newTarget
      }
    }
  }

  // rewrite path
  __applyPathRewrite(req, pathRewriter) {
    if (pathRewriter) {
      var path = pathRewriter(req.url, req)

      if (typeof path === 'string') {
        req.url = path
      } else {
        logger.info('[HPM] pathRewrite: No rewritten path found. (%s)', req.url)
      }
    }
  }

  logError(err, req, res) {
    var hostname = (req.headers && req.headers.host) || (req.hostname || req.host) // (websocket) || (node0.10 || node 4/5)
    var target = this.proxyOptions.target.host || this.proxyOptions.target
    var errorMessage = '[HPM] Error occurred while trying to proxy request %s from %s to %s (%s) (%s)'
    var errReference = 'https://nodejs.org/api/errors.html#errors_common_system_errors' // link to Node Common Systems Errors page

    logger.error(errorMessage, req.url, hostname, target, err.code, errReference)
  }

  /**
   * 文件遍历
   * @param {String} filePath 需要遍历的文件路径
   * @param {Boolean} recursive 是否向下递归
   */
  fetchFiles(filePath, recursive) {
    let fileNames = []
    try {
      //根据文件路径读取文件，返回文件列表
      let files = fs.readdirSync(filePath)
      //遍历读取到的文件列表
      files.forEach((filename) => {
        //获取当前文件的绝对路径
        var filedir = Path.join(filePath, filename)
        try {
          //根据文件路径获取文件信息，返回一个fs.Stats对象
          let stats = fs.statSync(filedir)

          var isFile = stats.isFile(); //是文件
          var isDir = stats.isDirectory(); //是文件夹
          if (isFile) {
            fileNames.push(filedir)
          }
          if (isDir && recursive) {
            fileNames.push(fetchFiles(filedir)); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
          }
        } catch (error) {}
      })
    } catch (error) {}

    return fileNames
  }

  HttpProxyMiddleware(context, opts) {
    // https://github.com/chimurai/http-proxy-middleware/issues/57
    this.wsUpgradeDebounced = _.debounce(this.handleUpgrade)
    this.wsInitialized = false
    this.opts = opts
    var config = configFactory.createConfig(context, opts)
    this.proxyOptions = config.options

    this.context = config.context

    // create proxy
    this.proxy = httpProxy.createProxyServer({})
    logger.info('[HPM] Proxy created:', config.context, ' -> ', this.proxyOptions.target)

    this.pathRewriter = PathRewriter.create(this.proxyOptions.pathRewrite) // returns undefined when "pathRewrite" is not provided

    // attach handler to http-proxy events
    handlers.init(this.proxy, this.proxyOptions)

    // log errors for debug purpose
    this.proxy.on('error', this.logError)

    // https://github.com/chimurai/http-proxy-middleware/issues/19
    // expose function to upgrade externally
    this.middleware.upgrade = this.wsUpgradeDebounced

    return this.middleware
  }
}

exports = module.exports = new ProxyContainer()