import React, { Component } from 'react'
import { deepClone, updateByPath } from '../utils'
import { Header, Button, Input, TextArea, Form, Dropdown, Checkbox } from 'semantic-ui-react'
import Btns from './BtnApplyDiscard'
import queryString from 'query-string'

class ApiMcCfgV extends Component {
    constructor(props) {
        super(props)

        this.update = this.update.bind(this)
        this.discard = this.discard.bind(this)
        this.handleChange = this.handleChange.bind(this)
        
        this.createValidator = this.createValidator.bind(this)
        this.createReactor = this.createReactor.bind(this)
        this.addKey = this.addKey.bind(this)
        this.discardKey = this.discardKey.bind(this)

        this.state = { mockCfg: props.mockCfg }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ mockCfg: nextProps.mockCfg })
    }

    componentWillMount() {
        let search = (this.props.location && this.props.location.search)
                        ? this.props.location.search
                        : window.location.search
        let query = queryString.parse(search)
        this.setState({ query: query })
        this.props.onMounted(search)
    }

    handleChange(e, data) {
        let oPath = data.name
        let value = data.type === 'checkbox' ? data.checked : data.value
        let mockCfg = updateByPath(deepClone(this.state.mockCfg), oPath, value)
        this.setState({ mockCfg: mockCfg })
    }

    update(e) {
      e.target.disabled = true
      let mockCfg = this.state.mockCfg
      if (mockCfg.reqDescriptor) {
        let length = mockCfg.reqDescriptor.queries.length
        if (length > 0) {
            let last = mockCfg.reqDescriptor.queries[length - 1]
            if(!last.key || !last.key.trim()) {
                mockCfg.reqDescriptor.queries.pop()
            }
        }

        length = mockCfg.reqDescriptor.headers.length
        if (length > 0) {
            let last = mockCfg.reqDescriptor.headers[length - 1]
            if(!last.key || !last.key.trim()) {
                mockCfg.reqDescriptor.headers.pop()
            }
        }
      }

      length = mockCfg.resDescriptor.headers.length
      if (length > 0) {
        let last = mockCfg.resDescriptor.headers[length - 1]
        if(!last.key || !last.key.trim()) {
            mockCfg.resDescriptor.headers.pop()
        }
      }

      this.props.onUpdateClick(mockCfg)
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
        let mockCfg = this.state.mockCfg
        let dummy = {}
        let key = null
        switch (type) {
            case 'query':
                dummy = mockCfg.reqDescriptor.queries
                key = {
                    key: '',
                    required: false,
                    validator: {
                        type: 'fixed',
                        value: '',
                        errMsg: ''
                    }
                }
                break
            case 'reqHeader':
                dummy = mockCfg.reqDescriptor.headers
                key = {
                    key: '',
                    required: false,
                    validator: {
                        type: 'fixed',
                        value: '',
                        errMsg: ''
                    }
                }
                break
            case 'resHeader':
                dummy = mockCfg.resDescriptor.headers
                key = {
                    key: '',
                    optional: false,
                    reactor: {
                        type: 'fixed',
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
        
        this.setState({ mockCfg: mockCfg })
    }

    discardKey(type, key) {
        let mockCfg = this.state.mockCfg
        let dummy = {}
        switch (type) {
            case 'query':
                dummy = mockCfg.reqDescriptor.queries
                break
            case 'reqHeader':
                dummy = mockCfg.reqDescriptor.headers
                break
            case 'resHeader':
                dummy = mockCfg.resDescriptor.headers
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

        this.setState({ apiMcCfg: mockCfg })
    }

    render() {
        let mockCfg = this.state.mockCfg
        if (!mockCfg || !mockCfg.hasOwnProperty('mock')) {
            return (<div>has no state</div>)
        }

        return (
            <div id="div_apiMcCfg">
                <Form>
                    <Checkbox label='启用Mock' name='mock' toggle
                        checked={mockCfg.mock}
                        onChange={this.handleChange} />
                    <br/>
                    <text>支持两种Mock规则，fixed: 固定，custom： 编写自定义 js 脚本为变量retVal(已定义)赋值，可使用 request 变量中的 query、header、body </text>
                    <div id="dv_mockCfg">
                        <Header as='h3'>Response</Header>
                        <Header as='h4'>Headers</Header>
                        <Button onClick={()=>this.addKey('resHeader')}>Add</Button>
                        <ul>
                        {
                            mockCfg.resDescriptor.headers.map((header, index)=>{
                                return (
                                <li key={index}>
                                    <Input label='Key: ' name={'resDescriptor.headers.' + index + '.key'} value={header.key} onChange={this.handleChange} />
                                    <Checkbox label='Optional' toggle className='sp-inline-form'
                                        name={'resDescriptor.headers.' + index + '.optional'} checked={header.optional} onChange={this.handleChange} />
                                    <Button onClick={() => this.discardKey('resHeader', header.key)}>Remove</Button>
                                    <Header as='h5'>Rule</Header>
                                    { this.createReactor('resDescriptor.headers.' + index, header.reactor) }
                                </li>)
                            })
                        }
                        </ul>
                        <h4>Body</h4>
                        <div>
                            <Checkbox label='Optional' toggle name="resDescriptor.body.optional" checked={mockCfg.resDescriptor.body.optional} onChange={this.handleChange} />
                            { this.createReactor('resDescriptor.body', mockCfg.resDescriptor.body.reactor) }
                        </div>
                    </div>
                </Form>

                <Btns applyAction={this.update} hideDiscard={false} discardAction={this.discard} />
            </div>
        )
    }
}

export default ApiMcCfgV