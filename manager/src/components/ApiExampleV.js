'use strict'

import React, { Component } from 'react'
import '../styles/apiSchema.scss'
import { deepClone, updateByPath, getPropertyByPath, parseRecursive, object2Array, array2Object } from '../utils'
import { Header, Button, Input, TextArea, Form } from 'semantic-ui-react'
import Btns from './BtnApplyDiscard'
import queryString from 'query-string'

class ApiExampleV extends Component {
    constructor(props) {
        super(props)
        this.update = this.update.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.addQueryOrHeader = this.addQueryOrHeader.bind(this)
        this.delProperty = this.delProperty.bind(this)
        this.preprocessExample = this.preprocessExample.bind(this)
        
        let example = deepClone(props.apiExample)
        example = this.preprocessExample(example)
        this.state = { example: example }
    }

    componentWillReceiveProps(nextProps) {
        let example = deepClone(nextProps.apiExample)
        example = parseRecursive(example)
        example = this.preprocessExample(example)
        this.setState({example: example})
    }

    componentWillMount() {
        let search = (this.props.location && this.props.location.search)
                        ? this.props.location.search
                        : window.location.search
        let query = queryString.parse(search)
        this.setState({ query: query })
        this.props.onMounted(search)
    }

    preprocessExample (example) {
        if (example) {
            // convert query, header to Array
            if (example.query) {
                example.query = object2Array(example.query)
            }
            if (example.reqHeader && example.reqHeader) {
                example.reqHeader = object2Array(example.reqHeader)
            }
            if (example.resHeader && example.resHeader) {
                example.resHeader = object2Array(example.resHeader)
            }
        }

        return example
    }

    handleChange (e, data) {
        let oPath = data.name
        let value = data.type === 'checkbox' ? data.checked : data.value
        let example = updateByPath(deepClone(this.state.example), oPath, value)
        this.setState({example: example})
    }

    addQueryOrHeader (e, data) {
        let oPath = data.name
        let value = { key: '', value: '' }
        let example = deepClone(this.state.example)
        let arr = getPropertyByPath(example, oPath)
        arr.push(value)
        this.setState({example: example})
    }

    delProperty (e, data) {
        let lastIndex = data.name.lastIndexOf('.')
        let path = data.name.substr(0, lastIndex)
        let index = parseInt(data.name.split('.').pop())
        let example = deepClone(this.state.example)
        let arr = getPropertyByPath(example, path)
        arr.splice(index, 1)

        this.setState({example: example})
    }

    update (e) {
        e.target.disabled = true
        let example = this.state.example

        // convert query, header
        if (example) {
            if (example.query) {
                example.query = array2Object(example.query)
            } else {
                example.query = {}
            }
            if (example.reqHeader && example.reqHeader) {
                example.reqHeader = array2Object(example.reqHeader)
            } else {
                example.reqHeader = {}
            }
            if (example.resHeader && example.resHeader) {
                example.resHeader = array2Object(example.resHeader)
            } else {
                example.resHeader = {}
            }
        }

        let dummy = { appId: this.props.apiCfg.appId, id:this.props.apiCfg.id, example: example }
        this.props.onUpdateClick(dummy)
    }

    render() {
        let example = this.state.example
        if (!example || !example.hasOwnProperty('query')) {
            return (<div>has no state</div>)
        }

        return (
            <div id="div_apiExample">
                <Form>
                    <Header as='h3'>Request</Header>
                    <Header as='h4'>Query</Header>
                    <Button name='query' onClick={ this.addQueryOrHeader }>Add</Button>
                    <ul>
                    {
                        (example && example.query && example.query instanceof Array) ?
                            example.query.map((item, index) => {
                                return (<li key={index}>
                                            <Input name={`query.${index}.key`}
                                                label='Key:'
                                                value={item.key}
                                                onChange={this.handleChange} />
                                            <Input name={`query.${index}.value`}
                                                label='Value:'
                                                value={item.value}
                                                onChange={this.handleChange} />
                                            <span className='sp-inline-form'/>
                                            <Button name={`query.${index}`} onClick={this.delProperty}>Remove</Button>
                                        </li>)
                            })
                        : <div />
                    }
                    </ul>
                    
                    <Header as='h4'>Headers</Header>
                    <Button name='reqHeader' onClick={ this.addQueryOrHeader }>Add</Button>
                    <ul>
                    {
                        (example && example.reqHeader && example.reqHeader instanceof Array) ?
                            example.reqHeader.map((item, index) => {
                                return (<li key={index}>
                                            <Input name={`reqHeader.${index}.key`}
                                                label='Key:'
                                                value={item.key}
                                                onChange={this.handleChange} />
                                            <Input name={`reqHeader.${index}.value`}
                                                label='Value:'
                                                value={item.value}
                                                onChange={this.handleChange} />
                                            <span className='sp-inline-form'/>
                                            <Button name={`reqHeader.${index}`} onClick={this.delProperty}>Remove</Button>
                                        </li>)
                            })
                            : <div />
                    }
                    </ul>
                    
                    <Header as='h4'>Body</Header>
                    <TextArea rows='5' name="reqBody" value={example.reqBody} onChange={this.handleChange} />
                    <Header as='h3'>Response</Header>
                    <Header as='h4'>Headers</Header>
                    <Button name='resHeader' onClick={ this.addQueryOrHeader }>Add</Button>
                    <ul>
                    {
                        (example && example.resHeader && example.resHeader instanceof Array) ?
                            example.resHeader.map((item, index) => {
                                return (<li key={index}>
                                            <Input name={`resHeader.${index}.key`}
                                                label='Key:'
                                                value={item.key}
                                                onChange={this.handleChange} />
                                            <Input name={`resHeader.${index}.value`}
                                                label='Value:'
                                                value={item.value}
                                                onChange={this.handleChange} />
                                            <span className='sp-inline-form'/>
                                            <Button name={`resHeader.${index}`} onClick={this.delProperty}>Remove</Button>
                                        </li>)
                            })
                            : <div />
                    }
                    </ul>
                    
                    <Header as='h4'>Body</Header>
                    <TextArea rows='5' name="resBody" value={example.resBody} onChange={this.handleChange} />

                    <input type="hidden"/>
                </Form>

                <Btns applyAction={this.update} hideDiscard={true} />
            </div>
        )
    }
}

export default ApiExampleV