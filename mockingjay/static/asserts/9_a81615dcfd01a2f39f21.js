webpackJsonp([9],{1017:function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=n(0),l=function(e){return e&&e.__esModule?e:{default:e}}(a),s=n(86),c=function(e){function t(e){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return u(t,e),i(t,[{key:"componentWillMount",value:function(){try{this.props.fetchData&&this.props.fetchData()}catch(e){console.log(this.props.users)}}},{key:"render",value:function(){return this.props.users&&0!==this.props.users.length?l.default.createElement("div",{id:"app-list"},l.default.createElement(s.List,{divided:!0,horizontal:!0},this.props.users.map(function(e,t){return l.default.createElement(s.List.Item,{key:t},l.default.createElement(s.List.Content,null,l.default.createElement(s.List.Header,null,e.name)))}))):null}}]),t}(a.Component);t.default=c}});