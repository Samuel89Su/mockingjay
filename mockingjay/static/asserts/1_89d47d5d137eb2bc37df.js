webpackJsonp([1],{1e3:function(e,t,n){t=e.exports=n(990)(!1),t.push([e.i,".container-btn {\n  position: fixed;\n  height: 100%;\n  width: 100%; }\n  .container-btn .pane-btn {\n    position: fixed;\n    right: 125px;\n    bottom: 40px;\n    width: 150px;\n    height: 120px; }\n    .container-btn .pane-btn .btn-submit {\n      background: blue;\n      color: white;\n      margin: 5px 0 0 10px; }\n    .container-btn .pane-btn .btn-discard {\n      background: #7a0505;\n      color: white;\n      margin: 5px 0 0 10px; }\n",""])},482:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),s=n(0),p=a(s),u=n(69),c=a(u),f=n(997),d=n(257),h=n(998),b=a(h),g=function(e){function t(e){r(this,t);var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.update=n.update.bind(n),n.discard=n.discard.bind(n),n.handleChange=n.handleChange.bind(n),n.state={apiCfg:e.apiCfg,updateDisabled:!0},n}return i(t,e),l(t,[{key:"componentWillReceiveProps",value:function(e){e.apiCfg||this.props.history.goBack(),0===this.state.apiCfg.id&&e.apiCfg.id>0?this.props.history.push("/api/details?appId="+this.state.query.appId+"&appName="+this.state.query.appName+"&id="+e.apiCfg.id):this.setState({apiCfg:e.apiCfg})}},{key:"componentWillMount",value:function(){var e=this.props.location&&this.props.location.search?this.props.location.search:window.location.search,t=c.default.parse(e);this.setState({query:t}),this.props.register||this.props.onMounted(e),this.props.appCfg&&this.props.appCfg.name||this.props.fetchApp(e)}},{key:"handleChange",value:function(e,t){this.state.updateDisabled&&this.setState({updateDisabled:!1});var n=t.name,a="checkbox"===t.type?t.checked:t.value,r=(0,f.updateByPath)((0,f.deepClone)(this.state.apiCfg),n,a);this.setState({apiCfg:r})}},{key:"update",value:function(e){this.setState({updateDisabled:!0});var t=this.state.apiCfg;this.props.onUpdateClick(t)}},{key:"discard",value:function(e){e.target.disabled=!0;var t=this.state.apiCfg;this.props.onDiscardClick(t,this.props.history)}},{key:"render",value:function(){var e=this.state.apiCfg;if(!e||!e.hasOwnProperty("name"))return p.default.createElement("div",null,"has no state");var t="",n=[];if(this.props.appCfg&&this.props.appCfg.targets&&this.props.appCfg.targets.length>0)for(var a=0;a<this.props.appCfg.targets.length;a++){var r=this.props.appCfg.targets[a];n.push({text:r.name,value:r.name}),e.forwardTarget===r.name&&(t=r.value)}return p.default.createElement("div",{id:"div_apiCfg"},p.default.createElement(d.Form,{id:"fm_apiCfg"},p.default.createElement(d.Input,{name:"name",label:"名称:",value:e.name,onChange:this.handleChange}),p.default.createElement(d.Header,{as:"h4"},"描述"),p.default.createElement(d.TextArea,{name:"description",rows:"4",value:e.description,onChange:this.handleChange,placeholder:"descripe this api"}),p.default.createElement(d.Label,null,"Method: "),p.default.createElement(d.Dropdown,{name:"method",placeholder:"Select a method",selection:!0,inline:!0,options:[{text:"GET",value:"GET"},{text:"POST",value:"POST"}],value:e.method,onChange:this.handleChange}),p.default.createElement("br",null),p.default.createElement(d.Input,{label:"Path: ",name:"path",value:e.path,onChange:this.handleChange}),p.default.createElement("br",null),p.default.createElement(d.Checkbox,{label:"验证数据",name:"validate",toggle:!0,checked:e.validate,onChange:this.handleChange}),p.default.createElement("br",null),p.default.createElement(d.Checkbox,{label:"代理",name:"forward",toggle:!0,checked:e.forward,onChange:this.handleChange}),p.default.createElement(d.Dropdown,{name:"forwardTarget",placeholder:"Select a target, prior over app config",selection:!0,inline:!0,options:n,value:e.forwardTarget,onChange:this.handleChange}),p.default.createElement(d.Label,null,t),p.default.createElement("br",null),p.default.createElement(d.Label,null,"Logging: "),p.default.createElement(d.Dropdown,{name:"logReq",placeholder:"Select a log level",selection:!0,inline:!0,options:[{text:"Req",value:1},{text:"Res",value:2}],value:e.logReq,onChange:this.handleChange}),p.default.createElement("input",{type:"hidden"})),p.default.createElement(b.default,{applyAction:this.update,applyDisabled:this.state.updateDisabled&&Boolean(this.state.updateDisabled),hideDiscard:this.props.register,discardAction:this.discard}))}}]),t}(s.Component);t.default=g},997:function(e,t,n){"use strict";function a(e){if("object"===(void 0===e?"undefined":u(e))){if(e instanceof Array){for(var t=[],n=0;n<e.length;n++)t.push(e[n]);return t}var r={};for(var o in e)r[o]=a(e[o]);return r}return e}function r(e,t){for(var n=t.split("."),a=e,r=0;r<n.length;r++){var o=n[r];if(a instanceof Array){a=a[parseInt(o)]}else a=(n.length,a[o])}return a}function o(e,t,n){for(var a=t.split("."),r=e,o=0;o<a.length;o++){var i=a[o];if(r instanceof Array){r=r[parseInt(i)]}else o===a.length-1?("true"===n?n=!0:"false"===n&&(n=!1),r[i]=n):r=r[i]}return e}function i(e,t){for(var n=t.split("."),a=e,r=0;r<n.length;r++){var o=n[r];if(a instanceof Array){a=a[parseInt(o)]}else r===n.length-1?delete a[o]:a=a[o]}return e}function l(e){if(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}else if("object"===(void 0===e?"undefined":u(e))&&e instanceof Array)for(var t=0;t<e.length;t++)e[t]=l(e[t]);else if("object"===(void 0===e?"undefined":u(e)))for(var n in e)if(e.hasOwnProperty(n)){var a=e[n];e[n]=l(a)}}else;return e}function s(e){var t=[];if(e&&"object"===(void 0===e?"undefined":u(e)))for(var n in e)if(e.hasOwnProperty(n)){var a=e[n];t.push({key:n,value:a})}return t}function p(e){var t={};return e&&e instanceof Array&&e.length>0&&e.forEach(function(e){e.key&&"string"==typeof e.key&&e.value&&(t[e.key]=e.value)}),t}Object.defineProperty(t,"__esModule",{value:!0});var u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.deepClone=a,t.updateByPath=o,t.delByPath=i,t.getPropertyByPath=r,t.parseRecursive=l,t.object2Array=s,t.array2Object=p},998:function(e,t,n){"use strict";function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),l=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(l),p=n(257);n(999);var u=function(e){function t(e){return a(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return o(t,e),i(t,[{key:"render",value:function(){return s.default.createElement("div",{className:"container-btn"},s.default.createElement("div",{className:"pane-btn"},s.default.createElement(p.Button,{className:"btn-submit",size:"massive",disabled:this.props.applyDisabled,onClick:this.props.applyAction},"Update"),s.default.createElement("br",null)))}}]),t}(l.Component);t.default=u},999:function(e,t,n){var a=n(1e3);"string"==typeof a&&(a=[[e.i,a,""]]);var r={};r.transform=void 0;n(991)(a,r);a.locals&&(e.exports=a.locals)}});