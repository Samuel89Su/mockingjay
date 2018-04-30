webpackJsonp([1],{

/***/ 1038:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Deepin clone an object
 * @param [Object] obj
 * @returns [Object] {*}
 */
function deepClone(obj) {
  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
    if (obj instanceof Array) {
      var newArr = [];
      for (var i = 0; i < obj.length; i++) {
        newArr.push(obj[i]);
      }return newArr;
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

function getPropertyByPath(obj, path) {
  var pathSegs = path.split('.');
  var dummy = obj;
  for (var i = 0; i < pathSegs.length; i++) {
    var pathSeg = pathSegs[i];
    if (dummy instanceof Array) {
      var index = parseInt(pathSeg);
      dummy = dummy[index];
    } else if (i === pathSegs.length - 1) {
      dummy = dummy[pathSeg];
    } else {
      dummy = dummy[pathSeg];
    }
  }

  return dummy;
}

/**
 * update by path
 * @param [Object] obj
 * @param [String] path
 * @param [Object] value
 * @returns {Object}
 */
function updateByPath(obj, path, value) {
  var pathSegs = path.split('.');
  var dummy = obj;
  for (var i = 0; i < pathSegs.length; i++) {
    var pathSeg = pathSegs[i];
    if (i === pathSegs.length - 1) {
      if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      }
      if (dummy instanceof Array) {
        var index = parseInt(pathSeg);
        dummy[index] = value;
      } else {
        dummy[pathSeg] = value;
      }
    } else if (dummy instanceof Array) {
      var _index = parseInt(pathSeg);
      if (_index > dummy.length - 1) {
        dummy.push(dummy[0] instanceof Array ? [] : _typeof(dummy[0]) === 'object' ? {} : '');
      }
      dummy = dummy[_index];
    } else {
      dummy = dummy[pathSeg];
    }
  }

  return obj;
}

/**
 * delete propperty of object by path, return new object
 * @param [Object] obj
 * @param [String] path
 * @returns {Object}
 */
function delByPath(obj, path) {
  var pathSegs = path.split('.');
  var dummy = obj;
  for (var i = 0; i < pathSegs.length; i++) {
    var pathSeg = pathSegs[i];
    if (dummy instanceof Array) {
      var index = parseInt(pathSeg);
      dummy = dummy[index];
    } else if (i === pathSegs.length - 1) {
      delete dummy[pathSeg];
    } else {
      dummy = dummy[pathSeg];
    }
  }

  return obj;
}

function parseRecursive(data) {
  if (!data) {} else if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (error) {}
  } else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && data instanceof Array) {
    for (var i = 0; i < data.length; i++) {
      data[i] = parseRecursive(data[i]);
    }
  } else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var prop = data[key];
        data[key] = parseRecursive(prop);
      }
    }
  }

  return data;
}

/**
 * convert object to array, DO NOT recursive
 * @param {Object} obj 
 * @returns {Array<Object>} [{key: '', value: ..}]
 */
function object2Array(obj) {
  var dummy = [];
  if (obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var value = obj[key];
        dummy.push({ key: key, value: value });
      }
    }
  }
  return dummy;
}

/**
 * convert array to object, DO NOT recursive
 * @param {Array<Object>} [{key: '', value: ..}]
 * @returns {Object} 
 */
function array2Object(arr) {
  var dummy = {};
  if (arr && arr instanceof Array && arr.length > 0) {
    arr.forEach(function (kv) {
      if (kv.key && typeof kv.key === 'string' && kv.value) {
        dummy[kv.key] = kv.value;
      }
    });
  }
  return dummy;
}

exports.deepClone = deepClone;
exports.updateByPath = updateByPath;
exports.delByPath = delByPath;
exports.getPropertyByPath = getPropertyByPath;
exports.parseRecursive = parseRecursive;
exports.object2Array = object2Array;
exports.array2Object = array2Object;

/***/ }),

/***/ 1041:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _semanticUiReact = __webpack_require__(88);

__webpack_require__(1042);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Btns = function (_Component) {
    _inherits(Btns, _Component);

    function Btns(props) {
        _classCallCheck(this, Btns);

        return _possibleConstructorReturn(this, (Btns.__proto__ || Object.getPrototypeOf(Btns)).call(this, props));
    }

    _createClass(Btns, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'container-btn' },
                _react2.default.createElement(
                    'div',
                    { className: 'pane-btn' },
                    _react2.default.createElement(
                        _semanticUiReact.Button,
                        { className: 'btn-submit', size: 'massive',
                            disabled: this.props.applyDisabled,
                            onClick: this.props.applyAction },
                        _react2.default.createElement(_semanticUiReact.Icon, { name: 'save' }),
                        'Save'
                    ),
                    this.props.showShare ? _react2.default.createElement(
                        _semanticUiReact.Button,
                        { className: 'btn-submit', size: 'massive',
                            onClick: this.props.shareAction },
                        _react2.default.createElement(_semanticUiReact.Icon, { name: 'slideshare' }),
                        'Share'
                    ) : null,
                    _react2.default.createElement('br', null)
                )
            );
        }
    }]);

    return Btns;
}(_react.Component);

exports.default = Btns;

/***/ }),

/***/ 1042:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1043);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1029)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_postcss-loader@2.1.3@postcss-loader/lib/index.js!../../node_modules/_sass-loader@6.0.7@sass-loader/lib/loader.js!./btn.scss", function() {
			var newContent = require("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_postcss-loader@2.1.3@postcss-loader/lib/index.js!../../node_modules/_sass-loader@6.0.7@sass-loader/lib/loader.js!./btn.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 1043:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1028)(false);
// imports


// module
exports.push([module.i, ".container-btn {\n  position: fixed;\n  height: 100%;\n  width: 100%; }\n  .container-btn .pane-btn {\n    position: fixed;\n    right: 50px;\n    bottom: 50px;\n    width: 200px;\n    height: 120px; }\n    .container-btn .pane-btn .btn-submit {\n      background: blue;\n      color: white;\n      margin: 5px 0 0 10px; }\n    .container-btn .pane-btn .btn-discard {\n      background: #7a0505;\n      color: white;\n      margin: 5px 0 0 10px; }\n", ""]);

// exports


/***/ }),

/***/ 491:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _queryString = __webpack_require__(44);

var _queryString2 = _interopRequireDefault(_queryString);

var _utils = __webpack_require__(1038);

var _semanticUiReact = __webpack_require__(88);

var _BtnApplyDiscard = __webpack_require__(1041);

var _BtnApplyDiscard2 = _interopRequireDefault(_BtnApplyDiscard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ApiCfg = function (_Component) {
    _inherits(ApiCfg, _Component);

    function ApiCfg(props) {
        _classCallCheck(this, ApiCfg);

        var _this = _possibleConstructorReturn(this, (ApiCfg.__proto__ || Object.getPrototypeOf(ApiCfg)).call(this, props));

        _this.update = _this.update.bind(_this);
        _this.discard = _this.discard.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);

        _this.state = { apiCfg: props.apiCfg, updateDisabled: true };
        return _this;
    }

    _createClass(ApiCfg, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (!nextProps.apiCfg) {
                this.props.history.goBack();
            }
            if (this.state.apiCfg.id === 0 && nextProps.apiCfg.id > 0) {
                this.props.history.push('/api/details?appId=' + this.state.query.appId + '&appName=' + this.state.query.appName + '&id=' + nextProps.apiCfg.id);
            } else {
                this.setState({ apiCfg: nextProps.apiCfg });
            }
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            var search = this.props.location && this.props.location.search ? this.props.location.search : window.location.search;
            var query = _queryString2.default.parse(search);
            this.setState({ query: query });
            if (!this.props.register) {
                this.props.onMounted(search);
            }

            if (!this.props.appCfg || !this.props.appCfg.name) {
                this.props.fetchApp(search);
            }
        }
    }, {
        key: 'handleChange',
        value: function handleChange(e, data) {
            if (this.state.updateDisabled) {
                this.setState({ updateDisabled: false });
            }
            var oPath = data.name;
            var value = data.type === 'checkbox' ? data.checked : data.value;
            var apiCfg = (0, _utils.updateByPath)((0, _utils.deepClone)(this.state.apiCfg), oPath, value);
            this.setState({ apiCfg: apiCfg });
        }
    }, {
        key: 'update',
        value: function update(e) {
            this.setState({ updateDisabled: true });
            var apiCfg = this.state.apiCfg;
            apiCfg.appId = parseInt(this.state.query.appId);
            this.props.onUpdateClick(apiCfg);
        }
    }, {
        key: 'discard',
        value: function discard(e) {
            e.target.disabled = true;
            var apiCfg = this.state.apiCfg;
            this.props.onDiscardClick(apiCfg, this.props.history);
        }
    }, {
        key: 'render',
        value: function render() {
            var apiCfg = this.state.apiCfg;
            if (!apiCfg || !apiCfg.hasOwnProperty('name')) {
                return _react2.default.createElement(
                    'div',
                    null,
                    'has no state'
                );
            }

            var targetUrl = '';
            var targets = [];
            if (this.props.appCfg && this.props.appCfg.targets && this.props.appCfg.targets.length > 0) {
                for (var i = 0; i < this.props.appCfg.targets.length; i++) {
                    var target = this.props.appCfg.targets[i];
                    targets.push({ text: target.name, value: target.name });
                    if (apiCfg.forwardTarget === target.name) {
                        targetUrl = target.value;
                    }
                }
            }

            return _react2.default.createElement(
                'div',
                { id: 'div_apiCfg' },
                _react2.default.createElement(
                    _semanticUiReact.Form,
                    { id: 'fm_apiCfg' },
                    _react2.default.createElement(_semanticUiReact.Input, { name: 'name', label: '\u540D\u79F0:', value: apiCfg.name, onChange: this.handleChange, className: 'margin-bottom' }),
                    _react2.default.createElement(
                        _semanticUiReact.Header,
                        { as: 'h4' },
                        '\u63CF\u8FF0'
                    ),
                    _react2.default.createElement(_semanticUiReact.TextArea, { name: 'description', rows: '4', value: apiCfg.description, onChange: this.handleChange, placeholder: 'descripe this api', autoHeight: true, className: 'margin-bottom' }),
                    _react2.default.createElement(
                        _semanticUiReact.Label,
                        { className: 'margin-bottom' },
                        'Method: '
                    ),
                    _react2.default.createElement(_semanticUiReact.Dropdown, { name: 'method', placeholder: 'Select a method', className: 'margin-bottom',
                        selection: true, inline: true, options: [{ text: 'GET', value: 'GET' }, { text: 'POST', value: 'POST' }],
                        value: apiCfg.method,
                        onChange: this.handleChange }),
                    _react2.default.createElement('br', null),
                    _react2.default.createElement(_semanticUiReact.Input, { label: 'Path: ', name: 'path', value: apiCfg.path, onChange: this.handleChange, className: 'input-row margin-bottom' }),
                    _react2.default.createElement('br', null),
                    _react2.default.createElement(_semanticUiReact.Checkbox, { label: '\u9A8C\u8BC1\u6570\u636E', name: 'validate', toggle: true, checked: apiCfg.validate, onChange: this.handleChange, className: 'margin-bottom' }),
                    _react2.default.createElement('br', null),
                    _react2.default.createElement(_semanticUiReact.Checkbox, { label: '\u4EE3\u7406', name: 'forward', toggle: true, checked: apiCfg.forward, onChange: this.handleChange, className: 'margin-bottom' }),
                    _react2.default.createElement(_semanticUiReact.Dropdown, { name: 'forwardTarget', placeholder: 'Select a target',
                        className: 'dropdown-proxy margin-bottom',
                        selection: true, inline: true,
                        options: targets,
                        value: apiCfg.forwardTarget,
                        onChange: this.handleChange }),
                    _react2.default.createElement(
                        _semanticUiReact.Label,
                        null,
                        targetUrl
                    ),
                    _react2.default.createElement('br', null),
                    _react2.default.createElement(
                        _semanticUiReact.Label,
                        { className: 'margin-bottom' },
                        'Logging: '
                    ),
                    _react2.default.createElement(_semanticUiReact.Dropdown, { name: 'logReq', placeholder: 'Select a log level',
                        selection: true, inline: true,
                        options: [{ text: 'Req', value: 1 }, { text: 'Res', value: 2 }],
                        value: apiCfg.logReq,
                        onChange: this.handleChange }),
                    _react2.default.createElement('input', { type: 'hidden' })
                ),
                _react2.default.createElement(_BtnApplyDiscard2.default, { applyAction: this.update, applyDisabled: this.state.updateDisabled && !!this.state.updateDisabled,
                    hideDiscard: this.props.register, discardAction: this.discard })
            );
        }
    }]);

    return ApiCfg;
}(_react.Component);

exports.default = ApiCfg;

/***/ })

});
//# sourceMappingURL=1_1044a144dfb570ec9223.js.map