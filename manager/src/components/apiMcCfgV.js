import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/apiMcCfg.scss'
import { deepClone, updateByPath, delByPath, getPropertyByPath } from '../utils'
import { Header, Button, Input, Label, TextArea, Form, Dropdown, Checkbox } from 'semantic-ui-react'
import Btns from './btn-apply-discard'

class apiMcCfgV extends Component {
    constructor(props) {
        super(props)

        this.update = this.update.bind(this)
        this.discard = this.discard.bind(this)
        this.handleChange = this.handleChange.bind(this)
        
        this.createValidator = this.createValidator.bind(this)
        this.createReactor = this.createReactor.bind(this)
        this.addKey = this.addKey.bind(this)
        this.discardKey = this.discardKey.bind(this)

        this.state = props.apiMcCfg
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.apiMcCfg)
    }

    componentWillMount() {
        this.props.onMounted(this.props.location.search)
    }

    handleChange(e, data) {
        let oPath = data.name
        let value = data.type === 'checkbox' ? data.checked : data.value
        let newState = updateByPath(deepClone(this.state), oPath, value)
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

    discard(e) {
        history.back()
    }

    createValidator(namePrefix, validator) {
        if (validator) {
            return (<div>
                        <Input readOnly="true" name={namePrefix + '.validator.type'} value={validator.type} onChange={this.handleChange} /><br/>
                        <TextArea name={namePrefix + '.validator.value'} value={validator.value} onChange={this.handleChange} />
                    </div>)
        } else {
            return <span></span>
        }
    }

    createReactor(namePrefix, reactor) {
        if (reactor) {
            return (<div>
                        <Dropdown name={namePrefix + '.reactor.type'} value={reactor.type} onChange={this.handleChange}
                            options={[{text: 'Fixed', value: 'fixed'}, {text:'Custom', value:'custom'}]} />
                        <TextArea name={namePrefix + '.reactor.value'} value={reactor.value} onChange={this.handleChange} />
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
                break
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
                break
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
                break
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
                break
            case 'reqHeader':
                dummy = cfg.mockCfg.reqDescriptor.headers
                break
            case 'resHeader':
                dummy = cfg.mockCfg.resDescriptor.headers
                break
            default:
                return
        }

        let idx = -1
        for (let i = 0; i < dummy.length; i++) {
            const query = dummy[i]
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
                <Header as='h2'>Mock Config</Header>                
                <div>
                    <Button onClick={()=>this.props.history.push(`/app/apilist?${this.props.appQuery}`)} >Back to list</Button>
                </div>
                
                <Header as='h3'>General</Header>
                <div>
                    <span id="sp_method">{ apiMcCfg.method }</span>
                    <span id="sp_path">{ apiMcCfg.path }</span><br/>
                </div>

                <Form>
                    <Checkbox label='Mock' name='mock' toggle 
                        checked={apiMcCfg.mock} 
                        onChange={this.handleChange} />
                    <Checkbox label='Validate Request' toggle 
                        name="mockCfg.validateReq" onChange={this.handleChange}
                        checked={apiMcCfg.mockCfg.validateReq} className='sp-inline-form'/>

                    <div id="dv_mockCfg">
                        <Header as='h3'>Request description</Header>
                        <Header as='h4'>Queries</Header>
                        <Button onClick={()=>this.addKey('query')}>Add</Button>
                        <ul>
                        {
                            apiMcCfg.mockCfg.reqDescriptor.queries.map((query, index) => {
                                return (
                                <li key={index}>
                                    <Input label='Key: ' name={'mockCfg.reqDescriptor.queries.' + index + '.key'} value={query.key} onChange={this.handleChange} />
                                    <Checkbox label='Required' toggle className='sp-inline-form'
                                        name={'mockCfg.reqDescriptor.queries.' + index + '.required'} 
                                        checked={query.required} onChange={this.handleChange} />
                                    <Button onClick={() => this.discardKey('query', query.key)}>Discard</Button>
                                    <Header as='h5'>Validator</Header>
                                    { this.createValidator('mockCfg.reqDescriptor.queries.' + index, query.validator) }
                                </li>)
                            })
                        }
                        </ul>
                        <Header as='h4'>Headers</Header>
                        <Button onClick={()=>this.addKey('reqHeader')}>Add</Button>
                        <ul>
                        {
                            apiMcCfg.mockCfg.reqDescriptor.headers.map((header, index)=>{
                                return (
                                <li key={index}>
                                    <Input label='Key: ' name={'mockCfg.reqDescriptor.headers.' + index + '.key'} value={header.key} onChange={this.handleChange} />
                                    <Checkbox label='Required' toggle className='sp-inline-form' 
                                        name={'mockCfg.reqDescriptor.headers.' + index + '.required'} 
                                        checked={header.required} onChange={this.handleChange} />
                                    <Button onClick={() => this.discardKey('reqHeader', header.key)}>Discard</Button>
                                    <Header as='h5'>Validator</Header>
                                    { this.createValidator('mockCfg.reqDescriptor.headers.' + index, header.validator) }
                                </li>)
                            })
                        }
                        </ul>
                        <Header as='h4'>Body</Header>
                        <div>
                            <Checkbox label='Required' toggle name="mockCfg.reqDescriptor.body.required" checked={apiMcCfg.mockCfg.reqDescriptor.body.required} onChange={this.handleChange} />
                            { this.createValidator('mockCfg.reqDescriptor.body', apiMcCfg.mockCfg.reqDescriptor.body.validator) }
                        </div>
                        <Header as='h3'>Response description</Header>
                        <Header as='h4'>Headers</Header>
                        <Button onClick={()=>this.addKey('resHeader')}>Add</Button>
                        <ul>
                        {
                            apiMcCfg.mockCfg.resDescriptor.headers.map((header, index)=>{
                                return (
                                <li key={index}>
                                    <Input label='Key: ' name={'mockCfg.resDescriptor.headers.' + index + '.key'} value={header.key} onChange={this.handleChange} />
                                    <Checkbox label='Optional' toggle className='sp-inline-form' 
                                        name={'mockCfg.resDescriptor.headers.' + index + '.required'} checked={header.optional} value={header.optional} onChange={this.handleChange} />
                                    <Button onClick={() => this.discardKey('resHeader', header.key)}>Discard</Button>
                                    <Header as='h5'>Reactor</Header>
                                    { this.createReactor('mockCfg.resDescriptor.headers.' + index, header.reactor) }
                                </li>)
                            })
                        }
                        </ul>
                        <h4>Body</h4>
                        <div>
                            <Checkbox label='Optional' toggle name="mockCfg.resDescriptor.body.optional" checked={apiMcCfg.mockCfg.resDescriptor.body.optional} onChange={this.handleChange} />
                            { this.createReactor('mockCfg.resDescriptor.body', apiMcCfg.mockCfg.resDescriptor.body.reactor) }
                        </div>
                    </div>
                </Form>

                <Btns applyAction={this.update} hideDiscard={false} discardAction={this.discard} />
            </div>
        )
    }
}

export default apiMcCfgV