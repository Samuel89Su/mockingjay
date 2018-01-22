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
        this.createReactor =this.createReactor.bind(this)

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
                dummy[path] = e.target.value
            } else {
                dummy = dummy[path]
            }
        }

        this.setState(newState)
    }

    update(e) {
      e.target.disabled = true
      let apiMcCfg = this.state
      this.props.onUpdateClick(apiMcCfg)
    }

    createValidator(namePrefix, validator) {
        if (validator) {
            return (<div>
                        <input name={namePrefix + '.validator.type'} value={validator.type} onChange={this.handleChange} /><br/>
                        <textarea name={namePrefix + '.validator.val'} value={validator.value} onChange={this.handleChange} />
                    </div>)
        } else {
            return <span></span>
        }
    }

    createReactor(namePrefix, reactor) {
        if (reactor) {
            return (<div>
                        <input name={namePrefix + '.reactor.type'} value={reactor.type} /><br/>
                        <textarea name={namePrefix + '.reactor.val'} value={reactor.value} />
                    </div>)
        } else {
            return <span></span>
        }
    }

    render() {
        let apiMcCfg = this.state
        if (!apiMcCfg || !apiMcCfg.hasOwnProperty('path')) {
            return (<div>has no state</div>)
        }

        return (
            <div id="div_apiSchema">
                <h4>Api Schema</h4>
                <Link to='/app/apilist?appId=1'>back to list</Link>
                <div id="pn_cfg">
                    <h3>General</h3>
                    <div>
                        <span id="sp_method">{ apiMcCfg.method }</span>
                        <span id="sp_path">{ apiMcCfg.path }</span><br/>
                        <label htmlFor="ck_mock">Mock</label>
                        <input type="checkbox" id="ck_mock" value={apiMcCfg.mock} />
                    </div>

                    <div id="dv_mockCfg">
                        <label htmlFor="checkbox">Validate Request: </label>
                        <input type="checkbox" value={apiMcCfg.mockCfg.validateReq} /><br/>
                        <h2>Request description</h2>
                        <h3>Queries</h3>
                        <ul>
                        {
                            apiMcCfg.mockCfg.reqDescriptor.queries.map((query, index)=>{
                                return (
                                <li key={index} class="div-key">
                                    <label>Key: </label>
                                    <input name={'mockCfg.reqDescriptor.queries.' + index + '.key'} value={query.key} onChange={this.handleChange} />
                                    <input name={'mockCfg.reqDescriptor.queries.' + index + '.required'} type="checkbox" value={query.required} onChange={this.handleChange} />
                                    <label >Required</label><br/>
                                    <h4>Validator</h4>
                                    { this.createValidator('mockCfg.reqDescriptor.queries.' + index, query.validator) }
                                </li>)
                            })
                        }
                        </ul>
                        <h3>Headers</h3>
                        <ul>
                        {
                            apiMcCfg.mockCfg.reqDescriptor.headers.map((header, index)=>{
                                return (
                                <li key={index} class="div-key">
                                    <label>Key: </label>
                                    <input name={'mockCfg.reqDescriptor.headers.' + index + '.key'} value={header.key} onChange={this.handleChange} />
                                    <input name={'mockCfg.reqDescriptor.headers.' + index + '.required'} type="checkbox" value={header.required} onChange={this.handleChange} />
                                    <label >Required</label><br/>
                                    <h4>Validator</h4>
                                    { this.createValidator('mockCfg.reqDescriptor.headers.' + index, header.validator) }
                                </li>)
                            })
                        }
                        </ul>
                        <h3>Body</h3>
                        <div>
                            <label>Required</label>
                            <input name="mockCfg.reqDescriptor.body" type="checkbox" value={apiMcCfg.mockCfg.reqDescriptor.body.required} />
                            { this.createValidator('mockCfg.reqDescriptor.body', apiMcCfg.mockCfg.reqDescriptor.body.validator) }
                        </div>
                        <h2>Response description</h2>
                        <h3>Headers</h3>
                        <ul>
                        {
                            apiMcCfg.mockCfg.resDescriptor.headers.map((header, index)=>{
                                return (
                                <li key={index} class="div-key">
                                    <label>Key: </label>
                                    <input name={'mockCfg.resDescriptor.headers.' + index + '.key'} value={header.key} onChange={this.handleChange} />
                                    <input name={'mockCfg.resDescriptor.headers.' + index + '.required'} type="checkbox" value={header.optional} onChange={this.handleChange} />
                                    <label >Optional</label><br/>
                                    <h4>Reactor</h4>
                                    { this.createReactor('mockCfg.resDescriptor.headers.' + index, header.reactor) }
                                </li>)
                            })
                        }
                        </ul>
                        <h3>Body</h3>
                        <div>
                            <label>Optional</label>
                            <input name="mockCfg.resDescriptor.body" type="checkbox" value={apiMcCfg.mockCfg.resDescriptor.body.optional} />
                            { this.createValidator('mockCfg.resDescriptor.body', apiMcCfg.mockCfg.resDescriptor.body.reactor) }
                        </div>
                    </div>

                    <button id="btn_submit" onClick={this.update}>Apply</button>

                </div>
            </div>
        );
    }
}

export default apiMcCfgV