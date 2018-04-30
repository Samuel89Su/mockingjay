webpackJsonp([9],{

/***/ 1030:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _semanticUiReact = __webpack_require__(88);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserList = function (_Component) {
    _inherits(UserList, _Component);

    function UserList(props) {
        _classCallCheck(this, UserList);

        return _possibleConstructorReturn(this, (UserList.__proto__ || Object.getPrototypeOf(UserList)).call(this, props));
    }

    _createClass(UserList, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            try {
                if (!!this.props.fetchData) {
                    this.props.fetchData();
                }
            } catch (error) {
                console.log(this.props.users);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            if (!this.props.users || this.props.users.length === 0) {
                return null;
            }
            return _react2.default.createElement(
                'div',
                { id: 'app-list' },
                _react2.default.createElement(
                    _semanticUiReact.List,
                    { divided: true, horizontal: true },
                    this.props.users.map(function (user, index) {
                        return _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            { key: index },
                            _react2.default.createElement(
                                _semanticUiReact.List.Content,
                                null,
                                _react2.default.createElement(
                                    _semanticUiReact.List.Header,
                                    null,
                                    user.name
                                )
                            )
                        );
                    })
                )
            );
        }
    }]);

    return UserList;
}(_react.Component);

exports.default = UserList;

/***/ })

});
//# sourceMappingURL=9_1044a144dfb570ec9223.js.map