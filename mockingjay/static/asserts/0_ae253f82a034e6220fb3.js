webpackJsonp([0],{1011:function(e,t,n){"use strict";function a(e){if("object"===(void 0===e?"undefined":p(e))){if(e instanceof Array){for(var t=[],n=0;n<e.length;n++)t.push(e[n]);return t}var r={};for(var i in e)r[i]=a(e[i]);return r}return e}function r(e,t){for(var n=t.split("."),a=e,r=0;r<n.length;r++){var i=n[r];if(a instanceof Array){a=a[parseInt(i)]}else a=(n.length,a[i])}return a}function i(e,t,n){for(var a=t.split("."),r=e,i=0;i<a.length;i++){var o=a[i];if(i===a.length-1)if("true"===n?n=!0:"false"===n&&(n=!1),r instanceof Array){var l=parseInt(o);r[l]=n}else r[o]=n;else if(r instanceof Array){var s=parseInt(o);s>r.length-1&&r.push(r[0]instanceof Array?[]:"object"===p(r[0])?{}:""),r=r[s]}else r=r[o]}return e}function o(e,t){for(var n=t.split("."),a=e,r=0;r<n.length;r++){var i=n[r];if(a instanceof Array){a=a[parseInt(i)]}else r===n.length-1?delete a[i]:a=a[i]}return e}function l(e){if(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}else if("object"===(void 0===e?"undefined":p(e))&&e instanceof Array)for(var t=0;t<e.length;t++)e[t]=l(e[t]);else if("object"===(void 0===e?"undefined":p(e)))for(var n in e)if(e.hasOwnProperty(n)){var a=e[n];e[n]=l(a)}}else;return e}function s(e){var t=[];if(e&&"object"===(void 0===e?"undefined":p(e)))for(var n in e)if(e.hasOwnProperty(n)){var a=e[n];t.push({key:n,value:a})}return t}function u(e){var t={};return e&&e instanceof Array&&e.length>0&&e.forEach(function(e){e.key&&"string"==typeof e.key&&e.value&&(t[e.key]=e.value)}),t}Object.defineProperty(t,"__esModule",{value:!0});var p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.deepClone=a,t.updateByPath=i,t.delByPath=o,t.getPropertyByPath=r,t.parseRecursive=l,t.object2Array=s,t.array2Object=u},1014:function(e,t,n){"use strict";function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),l=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(l),u=n(262);n(1015);var p=function(e){function t(e){return a(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return i(t,e),o(t,[{key:"render",value:function(){return s.default.createElement("div",{className:"container-btn"},s.default.createElement("div",{className:"pane-btn"},s.default.createElement(u.Button,{className:"btn-submit",size:"massive",disabled:this.props.applyDisabled,onClick:this.props.applyAction},"Update"),s.default.createElement("br",null)))}}]),t}(l.Component);t.default=p},1015:function(e,t,n){var a=n(1016);"string"==typeof a&&(a=[[e.i,a,""]]);var r={};r.transform=void 0;n(1005)(a,r);a.locals&&(e.exports=a.locals)},1016:function(e,t,n){t=e.exports=n(1004)(!1),t.push([e.i,".container-btn {\n  position: fixed;\n  height: 100%;\n  width: 100%; }\n  .container-btn .pane-btn {\n    position: fixed;\n    right: 125px;\n    bottom: 40px;\n    width: 150px;\n    height: 120px; }\n    .container-btn .pane-btn .btn-submit {\n      background: blue;\n      color: white;\n      margin: 5px 0 0 10px; }\n    .container-btn .pane-btn .btn-discard {\n      background: #7a0505;\n      color: white;\n      margin: 5px 0 0 10px; }\n",""])},1022:function(e,t,n){var a=n(1023);"string"==typeof a&&(a=[[e.i,a,""]]);var r={};r.transform=void 0;n(1005)(a,r);a.locals&&(e.exports=a.locals)},1023:function(e,t,n){t=e.exports=n(1004)(!1),t.push([e.i,"#div_appCfg .sp-inline-form {\n  margin: 0 0 0 80px; }\n",""])},486:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),s=n(0),u=a(s);n(1022);var p=n(1011),c=n(262),f=n(1014),d=a(f),h=function(e){function t(e){r(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.update=n.update.bind(n),n.discard=n.discard.bind(n),n.handleChange=n.handleChange.bind(n),n.addTagert=n.addTagert.bind(n),n.discardTarget=n.discardTarget.bind(n),n.state={appCfg:e.appCfg,updateDisabled:!0},n}return o(t,e),l(t,[{key:"componentWillReceiveProps",value:function(e){0===this.state.appCfg.id&&e.appCfg.id>0?this.props.history.push("/app/details?appId="+e.appCfg.id+"&appName="+e.appCfg.name):this.setState({appCfg:e.appCfg})}},{key:"componentWillMount",value:function(){if(!this.props.register){var e=this.props.location&&this.props.location.search?this.props.location.search:window.location.search;this.props.onMounted(e)}}},{key:"handleChange",value:function(e,t){this.state.updateDisabled&&this.setState({updateDisabled:!1});var n=t.name,a=(0,p.updateByPath)((0,p.deepClone)(this.state.appCfg),n,t.value);this.setState({appCfg:a})}},{key:"addTagert",value:function(){this.state.updateDisabled&&this.setState({updateDisabled:!1});var e=(0,p.deepClone)(this.state.appCfg);e.targets.push({name:(new Date).valueOf().toString(),value:""}),this.setState({appCfg:e})}},{key:"discardTarget",value:function(e){this.state.updateDisabled&&this.setState({updateDisabled:!1});var t=(0,p.deepClone)(this.state.appCfg),n=parseInt(e.target.name);t.targets.splice(n,1),this.setState({appCfg:t})}},{key:"update",value:function(e){this.setState({updateDisabled:!0});var t=this.state.appCfg;this.props.onUpdateClick(t),e.target.disabled=!1}},{key:"discard",value:function(e){e.target.disabled=!0;var t=this.state.appCfg;this.props.onDiscardClick(t)}},{key:"render",value:function(){var e=this,t=this.state.appCfg;if(!t||!t.hasOwnProperty("name"))return u.default.createElement("div",null,"has no state");var n=[];return t.targets&&t.targets.length>0&&t.targets.forEach(function(e){e&&e.name&&n.push({text:e.name,value:e.name})}),u.default.createElement("div",{id:"div_appCfg"},u.default.createElement(c.Header,{as:"h2"},"App details"),u.default.createElement("div",null,u.default.createElement(c.Button,{onClick:function(){return e.props.history.push("/")}},"返回应用列表")),u.default.createElement(c.Form,{id:"fm_appCfg"},u.default.createElement(c.Input,{name:"name",label:"名称:",value:t.name,disabled:!this.props.register,onChange:this.handleChange}),u.default.createElement(c.Header,{as:"h4"},"描述"),u.default.createElement(c.TextArea,{name:"desc",rows:"5",value:t.desc,onChange:this.handleChange,placeholder:"descripe this application",autoHeight:!0}),u.default.createElement(c.Header,{as:"h4"},"代理"),u.default.createElement(c.Button,{onClick:this.addTagert},"添加"),u.default.createElement("br",null),u.default.createElement(c.Label,{size:"large"},"代理到: "),u.default.createElement(c.Dropdown,{name:"apiForwardTarget",placeholder:"Select a target",selection:!0,inline:!0,options:n,value:t.apiForwardTarget,onChange:this.handleChange}),u.default.createElement("br",null),u.default.createElement("ul",null,t.targets&&t.targets.length>0?t.targets.map(function(t,n){if(t&&t.name)return u.default.createElement("li",{key:t.name},u.default.createElement(c.Input,{name:"targets."+n+".name",label:"名称:",value:t.name,onChange:e.handleChange}),u.default.createElement(c.Input,{name:"targets."+n+".value",label:"BaseUrl:",value:t.value,onChange:e.handleChange}),u.default.createElement("span",{className:"sp-inline-form"}),u.default.createElement(c.Button,{name:n,onClick:e.discardTarget},"删除"))}):null),u.default.createElement("br",null),u.default.createElement("input",{type:"hidden"})),u.default.createElement(d.default,{applyAction:this.update,applyDisabled:this.state.updateDisabled&&Boolean(this.state.updateDisabled),hideDiscard:this.props.register,discardAction:this.discard}))}}]),t}(s.Component);t.default=h}});