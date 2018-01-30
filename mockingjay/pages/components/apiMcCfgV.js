import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/apiMcCfg.scss'
import deepClone from '../utils/deepClone'

class apiMcCfgV extends Component {
    constructor(props) {
        super(props)

        this.update = this.update.bind(this)
        this.handleChange = this.handleChange.bind(this)
        
        this.createValidator = this.createValidator.bind(this)
        this.createReactor = this.createReactor.bind(this)
        this.addKey = this.addKey.bind(this)
        this.discardKey = this.discardKey.bind(this)

        this.state = {}
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.apiMcCfg)
    }

    componentDidMount() {
        this.props.onMounted(this.props.location.search)
    }

    handleChange(e) {
        let oPath = e.target.name
        let pathSegs = oPath.split('.')
        let newState = deepClone(this.state)
        let dummy = newState
        for (let i = 0; i < pathSegs.length; i++) {
            const path = pathSegs[i];
            if (i === pathSegs.length - 1) {
                let value = e.target.value
                if (value === 'true') {
                    value = true
                } else if (value === 'false') {
                    value = false
                }
                dummy[path] = value
            } else {
                dummy = dummy[path]
            }
        }

        this.setState(newState)
    }

    update(e) {
      e.target.disabled = true
      let apiMcCfg = this.state
      let length = apiMcCfg.mockCfg.reqDescriptor.queries.length
      if (length > 0) {
        let last = apiMcCfg.mockCfg.reqDescriptor.queries[length - 1]
        if(!last.key || !last.key.trim()) {
            apiMcCfg.mockCfg.reqDescriptor.queries.pop()
        }
      }

      length = apiMcCfg.mockCfg.reqDescriptor.headers.length
      if (length > 0) {
        let last = apiMcCfg.mockCfg.reqDescriptor.headers[length - 1]
        if(!last.key || !last.key.trim()) {
            apiMcCfg.mockCfg.reqDescriptor.headers.pop()
        }
      }

      length = apiMcCfg.mockCfg.resDescriptor.headers.length
      if (length > 0) {
        let last = apiMcCfg.mockCfg.resDescriptor.headers[length - 1]
        if(!last.key || !last.key.trim()) {
            apiMcCfg.mockCfg.resDescriptor.headers.pop()
        }
      }

      this.props.onUpdateClick(apiMcCfg)
    }

    createValidator(namePrefix, validator) {
        if (validator) {
            return (<div>
                        <input name={namePrefix + '.validator.type'} value={validator.type} onChange={this.handleChange} /><br/>
                        <textarea name={namePrefix + '.validator.value'} value={validator.value} onChange={this.handleChange} />
                    </div>)
        } else {
            return <span></span>
        }
    }

    createReactor(namePrefix, reactor) {
        if (reactor) {
            return (<div>
                        <input name={namePrefix + '.reactor.type'} value={reactor.type} onChange={this.handleChange} /><br/>
                        <textarea name={namePrefix + '.reactor.value'} value={reactor.value} onChange={this.handleChange} />
                    </div>)
        } else {
            return <span></span>
        }
    }

    addKey(type) {
        let cfg = this.state
        let dummy = {}
        let key = null
        switch (type) {
            case 'query':
                dummy = cfg.mockCfg.reqDescriptor.queries
                key = {
                    key: '',
                    required: false,
                    validator: {
                        type: 'custom',
                        value: '',
                        errMsg: ''
                    }
                }
                break;
            case 'reqHeader':
                dummy = cfg.mockCfg.reqDescriptor.headers
                key = {
                    key: '',
                    required: false,
                    validator: {
                        type: 'custom',
                        value: '',
                        errMsg: ''
                    }
                }
                break;
            case 'resHeader':
                dummy = cfg.mockCfg.resDescriptor.headers
                key = {
                    key: '',
                    optional: false,
                    reactor: {
                        type: 'custom',
                        value: '',
                        errMsg: ''
                    }
                }
                break;
            default:
                return
        }

        let length = dummy.length
        if (length > 0) {
            let last = dummy[length - 1]
            if (!last.key) {
                return
            }
        }

        dummy.push(key)
        
        this.setState(cfg)
    }

    discardKey(type, key) {
        let cfg = this.state
        let dummy = {}
        switch (type) {
            case 'query':
                dummy = cfg.mockCfg.reqDescriptor.queries
                break;
            case 'reqHeader':
                dummy = cfg.mockCfg.reqDescriptor.headers
                break;
            case 'resHeader':
                dummy = cfg.mockCfg.resDescriptor.headers
                break;
            default:
                return
        }

        let idx = -1
        for (let i = 0; i < dummy.length; i++) {
            const query = dummy[i];
            if (query.key === key) {
                idx = i
            }
        }
        dummy.splice(idx, 1)

        this.setState(cfg)
    }

    render() {
        let apiMcCfg = this.state
        if (!apiMcCfg || !apiMcCfg.hasOwnProperty('path')) {
            return (<div>has no state</div>)
        }

        return (
            <div id="div_apiMcCfg">
                    <div className="vice-header">
                        <h2>Api Schema</h2>
                    </div>
                    <div className="pading-right">
                        <Link id="lk_back" to='/app/apilist?appId=1'>back to list</Link>
                    </div>
                
                <div id="pn_cfg">
                    <h3>General</h3>
                    <div>
                        <span id="sp_method">{ apiMcCfg.method }</span>
                        <span id="sp_path">{ apiMcCfg.path }</span><br/>
                        <label htmlFor="ck_mock">Mock</label>
                        <input type="checkbox" id="ck_mock" value={apiMcCfg.mock} onChange={this.handleChange} />
                    </div>

                    <div id="dv_mockCfg">
                        <label htmlFor="checkbox">Validate Request: </label>
                        <input type="checkbox" value={apiMcCfg.mockCfg.validateReq} onChange={this.handleChange} /><br/>
                        <h3>Request description</h3>
                        <h4>Queries</h4>
                        <button onClick={()=>this.addKey('query')}>Add</button>
                        <ul>
                        {
                            apiMcCfg.mockCfg.reqDescriptor.queries.map((query, index)=>{
                                return (
                                <li key={index} className="div-key">
                                    <label>Key: </label>
                                    <input name={'mockCfg.reqDescriptor.queries.' + index + '.key'} value={query.key} onChange={this.handleChange} />
                                    <input name={'mockCfg.reqDescriptor.queries.' + index + '.required'} type="checkbox" value={query.required} onChange={this.handleChange} />
                                    <label >Required</label><br/>
                                    <button onClick={() => this.discardKey('query', query.key)}>Discard</button>
                                    <h5>Validator</h5>
                                    { this.createValidator('mockCfg.reqDescriptor.queries.' + index, query.validator) }
                                </li>)
                            })
                        }
                        </ul>
                        <h4>Headers</h4>
                        <button onClick={()=>this.addKey('reqHeader')}>Add</button>
                        <ul>
                        {
                            apiMcCfg.mockCfg.reqDescriptor.headers.map((header, index)=>{
                                return (
                                <li key={index} className="div-key">
                                    <label>Key: </label>
                                    <input name={'mockCfg.reqDescriptor.headers.' + index + '.key'} value={header.key} onChange={this.handleChange} />
                                    <input name={'mockCfg.reqDescriptor.headers.' + index + '.required'} type="checkbox" value={header.required} onChange={this.handleChange} />
                                    <label >Required</label><br/>
                                    <button onClick={() => this.discardKey('reqHeader', header.key)}>Discard</button>
                                    <h5>Validator</h5>
                                    { this.createValidator('mockCfg.reqDescriptor.headers.' + index, header.validator) }
                                </li>)
                            })
                        }
                        </ul>
                        <h4>Body</h4>
                        <div>
                            <label>Required</label>
                            <input name="mockCfg.reqDescriptor.body" type="checkbox" value={apiMcCfg.mockCfg.reqDescriptor.body.required} onChange={this.handleChange} />
                            { this.createValidator('mockCfg.reqDescriptor.body', apiMcCfg.mockCfg.reqDescriptor.body.validator) }
                        </div>
                        <h3>Response description</h3>
                        <h4>Headers</h4>
                        <button onClick={()=>this.addKey('resHeader')}>Add</button>
                        <ul>
                        {
                            apiMcCfg.mockCfg.resDescriptor.headers.map((header, index)=>{
                                return (
                                <li key={index} className="div-key">
                                    <label>Key: </label>
                                    <input name={'mockCfg.resDescriptor.headers.' + index + '.key'} value={header.key} onChange={this.handleChange} />
                                    <input name={'mockCfg.resDescriptor.headers.' + index + '.required'} type="checkbox" value={header.optional} onChange={this.handleChange} />
                                    <label >Optional</label><br/>
                                    <button onClick={() => this.discardKey('resHeader', header.key)}>Discard</button>
                                    <h5>Reactor</h5>
                                    { this.createReactor('mockCfg.resDescriptor.headers.' + index, header.reactor) }
                                </li>)
                            })
                        }
                        </ul>
                        <h4>Body</h4>
                        <div>
                            <label>Optional</label>
                            <input name="mockCfg.resDescriptor.body" type="checkbox" value={apiMcCfg.mockCfg.resDescriptor.body.optional} onChange={this.handleChange} />
                            { this.createReactor('mockCfg.resDescriptor.body', apiMcCfg.mockCfg.resDescriptor.body.reactor) }
                        </div>
                    </div>

                    <button id="btn_submit" onClick={this.update}>Update</button>

                </div>
            </div>
        );
    }
}

export default apiMcCfgV