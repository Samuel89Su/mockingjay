webpackJsonp([7],{

/***/ 1037:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(266);

var _queryString = __webpack_require__(44);

var _queryString2 = _interopRequireDefault(_queryString);

__webpack_require__(1058);

var _semanticUiReact = __webpack_require__(88);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AppList = function (_Component) {
    _inherits(AppList, _Component);

    function AppList(props) {
        _classCallCheck(this, AppList);

        var _this = _possibleConstructorReturn(this, (AppList.__proto__ || Object.getPrototypeOf(AppList)).call(this, props));

        _this.register = _this.register.bind(_this);
        _this.handlePaginationChange = _this.handlePaginationChange.bind(_this);
        _this.search = _this.search.bind(_this);

        _this.state = { activePage: 1 };
        return _this;
    }

    _createClass(AppList, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            try {
                if (!this.props.pagedApps || !this.props.pagedApps.records || !(this.props.pagedApps.records instanceof Array) || this.props.pagedApps.records.length === 0) {
                    this.props.fetchData({ owned: this.props.owned, pageNum: this.state.activePage - 1 });
                }
            } catch (error) {
                console.log(this.props.pagedApps);
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.setState({ isSearching: false });
            // 切换 tab 刷新数据
            if (this.props.owned ^ nextProps.owned) {
                var search = this.props.location && this.props.location.search ? this.props.location.search : window.location.search;
                var query = _queryString2.default.parse(search);
                query.owned = nextProps.owned;
                this.setState({ query: query });
                query.pageNum = 0;
                this.props.fetchData(query);
            }
        }
    }, {
        key: 'register',
        value: function register(event, data) {
            this.props.history.push('/app/register');
        }
    }, {
        key: 'handlePaginationChange',
        value: function handlePaginationChange(e, data) {
            this.setState({
                activePage: data.activePage
            });
            this.props.fetchData({ owned: this.props.owned, pageNum: data.activePage - 1, partialName: this.state.partialName });
        }
    }, {
        key: 'search',
        value: function search(e, data) {
            this.setState({ isSearching: true, partialName: data.value });

            this.props.fetchData({ owned: this.props.owned, pageNum: this.state.activePage - 1, partialName: data.value });
        }
    }, {
        key: 'render',
        value: function render() {
            var pagedResult = this.props.pagedApps || { records: [] };
            var list = pagedResult.records || [];
            if (!list || !(list instanceof Array)) {
                return _react2.default.createElement(
                    'div',
                    null,
                    'has no state'
                );
            }

            var _state = this.state,
                isSearching = _state.isSearching,
                partialName = _state.partialName;


            return _react2.default.createElement(
                'div',
                { id: 'app-list' },
                _react2.default.createElement(
                    _semanticUiReact.Header,
                    { as: 'h2' },
                    '\u5E94\u7528'
                ),
                _react2.default.createElement(
                    'div',
                    null,
                    this.props.owned ? _react2.default.createElement(
                        _semanticUiReact.Button,
                        { onClick: this.register },
                        '\u521B\u5EFA\u5E94\u7528'
                    ) : '',
                    _react2.default.createElement(
                        'div',
                        { className: 'div-search' },
                        _react2.default.createElement(_semanticUiReact.Search, { loading: isSearching,
                            open: false,
                            onSearchChange: this.search,
                            value: partialName,
                            className: 'search',
                            placeholder: '\u540D\u79F0\u6A21\u7CCA\u641C\u7D22' })
                    )
                ),
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        _semanticUiReact.Table,
                        null,
                        _react2.default.createElement(
                            _semanticUiReact.Table.Header,
                            { fullWidth: true },
                            _react2.default.createElement(
                                _semanticUiReact.Table.Row,
                                null,
                                _react2.default.createElement(
                                    _semanticUiReact.Table.HeaderCell,
                                    null,
                                    'ID'
                                ),
                                _react2.default.createElement(
                                    _semanticUiReact.Table.HeaderCell,
                                    null,
                                    '\u540D\u79F0'
                                ),
                                _react2.default.createElement(
                                    _semanticUiReact.Table.HeaderCell,
                                    null,
                                    '\u63CF\u8FF0'
                                ),
                                _react2.default.createElement(
                                    _semanticUiReact.Table.HeaderCell,
                                    null,
                                    '\u4EE3\u7406'
                                ),
                                _react2.default.createElement(
                                    _semanticUiReact.Table.HeaderCell,
                                    null,
                                    '\u8BE6\u60C5'
                                ),
                                _react2.default.createElement(
                                    _semanticUiReact.Table.HeaderCell,
                                    null,
                                    'API List'
                                )
                            )
                        ),
                        _react2.default.createElement(
                            _semanticUiReact.Table.Body,
                            null,
                            list.map(function (app, index) {
                                return _react2.default.createElement(
                                    _semanticUiReact.Table.Row,
                                    { key: index },
                                    _react2.default.createElement(
                                        _semanticUiReact.Table.Cell,
                                        null,
                                        app.id
                                    ),
                                    _react2.default.createElement(
                                        _semanticUiReact.Table.Cell,
                                        null,
                                        app.name
                                    ),
                                    _react2.default.createElement(
                                        _semanticUiReact.Table.Cell,
                                        null,
                                        app.desc
                                    ),
                                    _react2.default.createElement(
                                        _semanticUiReact.Table.Cell,
                                        null,
                                        app.apiForwardTarget
                                    ),
                                    _react2.default.createElement(
                                        _semanticUiReact.Table.Cell,
                                        null,
                                        _react2.default.createElement(
                                            _reactRouterDom.Link,
                                            { to: '/app/details?appId=' + app.id + '&appName=' + app.name },
                                            '\u8BE6\u60C5'
                                        )
                                    ),
                                    _react2.default.createElement(
                                        _semanticUiReact.Table.Cell,
                                        null,
                                        _react2.default.createElement(
                                            _reactRouterDom.Link,
                                            { to: '/app/apilist?appId=' + app.id + '&appName=' + app.name },
                                            'api \u5217\u8868'
                                        )
                                    )
                                );
                            })
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(_semanticUiReact.Pagination, { floated: 'right', activePage: this.state.activePage, onPageChange: this.handlePaginationChange, totalPages: pagedResult.pageCnt || 0 })
                    )
                )
            );
        }
    }]);

    return AppList;
}(_react.Component);

exports.default = AppList;

/***/ }),

/***/ 1058:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1059);
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
		module.hot.accept("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_postcss-loader@2.1.3@postcss-loader/lib/index.js!../../node_modules/_sass-loader@6.0.7@sass-loader/lib/loader.js!./appList.scss", function() {
			var newContent = require("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_postcss-loader@2.1.3@postcss-loader/lib/index.js!../../node_modules/_sass-loader@6.0.7@sass-loader/lib/loader.js!./appList.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 1059:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1028)(false);
// imports


// module
exports.push([module.i, "/* app list begin */\n#app-list table {\n  width: 100%;\n  text-align: left; }\n\n#app-list th:nth-child(1) {\n  width: 20px; }\n\n#app-list th:nth-child(2) {\n  width: 160px; }\n\n#app-list th:nth-child(4) {\n  width: 150px; }\n\n#app-list th:nth-child(5) {\n  width: 120px; }\n\n#app-list th:nth-child(6) {\n  width: 150px; }\n\n#app-list .div-search {\n  display: inline; }\n  #app-list .div-search .search {\n    float: right; }\n\n/* app list end */\n", ""]);

// exports


/***/ })

});
//# sourceMappingURL=7_1044a144dfb570ec9223.js.map