webpackJsonp([1],{1025:function(e,t,a){"use strict";function n(e){if("object"===(void 0===e?"undefined":u(e))){if(e instanceof Array){for(var t=[],a=0;a<e.length;a++)t.push(e[a]);return t}var r={};for(var o in e)r[o]=n(e[o]);return r}return e}function r(e,t){for(var a=t.split("."),n=e,r=0;r<a.length;r++){var o=a[r];if(n instanceof Array){n=n[parseInt(o)]}else n=(a.length,n[o])}return n}function o(e,t,a){for(var n=t.split("."),r=e,o=0;o<n.length;o++){var i=n[o];if(o===n.length-1)if("true"===a?a=!0:"false"===a&&(a=!1),r instanceof Array){var l=parseInt(i);r[l]=a}else r[i]=a;else if(r instanceof Array){var s=parseInt(i);s>r.length-1&&r.push(r[0]instanceof Array?[]:"object"===u(r[0])?{}:""),r=r[s]}else r=r[i]}return e}function i(e,t){for(var a=t.split("."),n=e,r=0;r<a.length;r++){var o=a[r];if(n instanceof Array){n=n[parseInt(o)]}else r===a.length-1?delete n[o]:n=n[o]}return e}function l(e){if(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}else if("object"===(void 0===e?"undefined":u(e))&&e instanceof Array)for(var t=0;t<e.length;t++)e[t]=l(e[t]);else if("object"===(void 0===e?"undefined":u(e)))for(var a in e)if(e.hasOwnProperty(a)){var n=e[a];e[a]=l(n)}}else;return e}function s(e){var t=[];if(e&&"object"===(void 0===e?"undefined":u(e)))for(var a in e)if(e.hasOwnProperty(a)){var n=e[a];t.push({key:a,value:n})}return t}function p(e){var t={};return e&&e instanceof Array&&e.length>0&&e.forEach(function(e){e.key&&"string"==typeof e.key&&e.value&&(t[e.key]=e.value)}),t}Object.defineProperty(t,"__esModule",{value:!0});var u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.deepClone=n,t.updateByPath=o,t.delByPath=i,t.getPropertyByPath=r,t.parseRecursive=l,t.object2Array=s,t.array2Object=p},1028:function(e,t,a){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),l=a(0),s=function(e){return e&&e.__esModule?e:{default:e}}(l),p=a(86);a(1029);var u=function(e){function t(e){return n(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return o(t,e),i(t,[{key:"render",value:function(){return s.default.createElement("div",{className:"container-btn"},s.default.createElement("div",{className:"pane-btn"},s.default.createElement(p.Button,{className:"btn-submit",size:"massive",disabled:this.props.applyDisabled,onClick:this.props.applyAction},s.default.createElement(p.Icon,{name:"save"}),"Save"),this.props.showShare?s.default.createElement(p.Button,{className:"btn-submit",size:"massive",onClick:this.props.shareAction},s.default.createElement(p.Icon,{name:"slideshare"}),"Share"):null,s.default.createElement("br",null)))}}]),t}(l.Component);t.default=u},1029:function(e,t,a){var n=a(1030);"string"==typeof n&&(n=[[e.i,n,""]]);var r={};r.transform=void 0;a(1016)(n,r);n.locals&&(e.exports=n.locals)},1030:function(e,t,a){t=e.exports=a(1015)(!1),t.push([e.i,".container-btn {\n  position: fixed;\n  height: 100%;\n  width: 100%; }\n  .container-btn .pane-btn {\n    position: fixed;\n    right: 50px;\n    bottom: 50px;\n    width: 200px;\n    height: 120px; }\n    .container-btn .pane-btn .btn-submit {\n      background: blue;\n      color: white;\n      margin: 5px 0 0 10px; }\n    .container-btn .pane-btn .btn-discard {\n      background: #7a0505;\n      color: white;\n      margin: 5px 0 0 10px; }\n",""])},486:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var l=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),s=a(0),p=n(s),u=a(43),c=n(u),f=a(1025),d=a(86),h=a(1028),m=n(h),b=function(e){function t(e){r(this,t);var a=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.update=a.update.bind(a),a.discard=a.discard.bind(a),a.handleChange=a.handleChange.bind(a),a.state={apiCfg:e.apiCfg,updateDisabled:!0},a}return i(t,e),l(t,[{key:"componentWillReceiveProps",value:function(e){e.apiCfg||this.props.history.goBack(),0===this.state.apiCfg.id&&e.apiCfg.id>0?this.props.history.push("/api/details?appId="+this.state.query.appId+"&appName="+this.state.query.appName+"&id="+e.apiCfg.id):this.setState({apiCfg:e.apiCfg})}},{key:"componentWillMount",value:function(){var e=this.props.location&&this.props.location.search?this.props.location.search:window.location.search,t=c.default.parse(e);this.setState({query:t}),this.props.register||this.props.onMounted(e),this.props.appCfg&&this.props.appCfg.name||this.props.fetchApp(e)}},{key:"handleChange",value:function(e,t){this.state.updateDisabled&&this.setState({updateDisabled:!1});var a=t.name,n="checkbox"===t.type?t.checked:t.value,r=(0,f.updateByPath)((0,f.deepClone)(this.state.apiCfg),a,n);this.setState({apiCfg:r})}},{key:"update",value:function(e){this.setState({updateDisabled:!0});var t=this.state.apiCfg;t.appId=parseInt(this.state.query.appId),this.props.onUpdateClick(t)}},{key:"discard",value:function(e){e.target.disabled=!0;var t=this.state.apiCfg;this.props.onDiscardClick(t,this.props.history)}},{key:"render",value:function(){var e=this.state.apiCfg;if(!e||!e.hasOwnProperty("name"))return p.default.createElement("div",null,"has no state");var t="",a=[];if(this.props.appCfg&&this.props.appCfg.targets&&this.props.appCfg.targets.length>0)for(var n=0;n<this.props.appCfg.targets.length;n++){var r=this.props.appCfg.targets[n];a.push({text:r.name,value:r.name}),e.forwardTarget===r.name&&(t=r.value)}return p.default.createElement("div",{id:"div_apiCfg"},p.default.createElement(d.Form,{id:"fm_apiCfg"},p.default.createElement(d.Input,{name:"name",label:"名称:",value:e.name,onChange:this.handleChange,className:"margin-bottom"}),p.default.createElement(d.Header,{as:"h4"},"描述"),p.default.createElement(d.TextArea,{name:"description",rows:"4",value:e.description,onChange:this.handleChange,placeholder:"descripe this api",autoHeight:!0,className:"margin-bottom"}),p.default.createElement(d.Label,{className:"margin-bottom"},"Method: "),p.default.createElement(d.Dropdown,{name:"method",placeholder:"Select a method",className:"margin-bottom",selection:!0,inline:!0,options:[{text:"GET",value:"GET"},{text:"POST",value:"POST"}],value:e.method,onChange:this.handleChange}),p.default.createElement("br",null),p.default.createElement(d.Input,{label:"Path: ",name:"path",value:e.path,onChange:this.handleChange,className:"input-row margin-bottom"}),p.default.createElement("br",null),p.default.createElement(d.Checkbox,{label:"验证数据",name:"validate",toggle:!0,checked:e.validate,onChange:this.handleChange,className:"margin-bottom"}),p.default.createElement("br",null),p.default.createElement(d.Checkbox,{label:"代理",name:"forward",toggle:!0,checked:e.forward,onChange:this.handleChange,className:"margin-bottom"}),p.default.createElement(d.Dropdown,{name:"forwardTarget",placeholder:"Select a target",className:"dropdown-proxy margin-bottom",selection:!0,inline:!0,options:a,value:e.forwardTarget,onChange:this.handleChange}),p.default.createElement(d.Label,null,t),p.default.createElement("br",null),p.default.createElement(d.Label,{className:"margin-bottom"},"Logging: "),p.default.createElement(d.Dropdown,{name:"logReq",placeholder:"Select a log level",selection:!0,inline:!0,options:[{text:"Req",value:1},{text:"Res",value:2}],value:e.logReq,onChange:this.handleChange}),p.default.createElement("input",{type:"hidden"})),p.default.createElement(m.default,{applyAction:this.update,applyDisabled:this.state.updateDisabled&&!!this.state.updateDisabled,hideDiscard:this.props.register,discardAction:this.discard}))}}]),t}(s.Component);t.default=b}});