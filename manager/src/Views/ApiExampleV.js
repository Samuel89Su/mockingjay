'use strict'

import React, { Component } from 'react'
import { deepClone, updateByPath, getPropertyByPath, parseRecursive, object2Array, array2Object } from '../utils'
import { Header, Button, Input, TextArea, Form, Dropdown, Label } from 'semantic-ui-react'
import Btns from './BtnApplyDiscard'
import queryString from 'query-string'
import RawSchemaEditor from './RawSchemaEditor'
import beautify from 'js-beautify/js'

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
        this.state = { example: example, updateDisabled: true }
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
        if (this.state.updateDisabled) {
          this.setState({updateDisabled: false})
        }
        let oPath = data.name
        let value = data.type === 'checkbox' ? data.checked : data.value
        let example = updateByPath(deepClone(this.state.example), oPath, value)
        this.setState({example: example})
    }

    addQueryOrHeader (e, data) {
        if (this.state.updateDisabled) {
          this.setState({updateDisabled: false})
        }
        let oPath = data.name
        let value = { key: '', value: '' }
        let example = deepClone(this.state.example)
        let arr = getPropertyByPath(example, oPath)
        arr.push(value)
        this.setState({example: example})
    }

    delProperty (e, data) {
        if (this.state.updateDisabled) {
          this.setState({updateDisabled: false})
        }
        let lastIndex = data.name.lastIndexOf('.')
        let path = data.name.substr(0, lastIndex)
        let index = parseInt(data.name.split('.').pop())
        let example = deepClone(this.state.example)
        let arr = getPropertyByPath(example, path)
        arr.splice(index, 1)

        this.setState({example: example})
    }

    update (e) {
        this.setState({updateDisabled: true})
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

        let reqContentTypeIndex = -1
        try {
            let dummy = example.reqHeader
            for (let i = 0; i < dummy.length; i++) {
                const header = dummy[i];
                if (header.key === 'content-type') {
                    reqContentTypeIndex = i
                }
            }
            if (reqContentTypeIndex === -1) {
                example.reqHeader.push({key:'content-type',value:''})
                reqContentTypeIndex = example.reqHeader.length - 1
            }
        } catch (error) {}
        
        let resContentTypeIndex = -1
        try {
            let dummy = example.resHeader
            for (let i = 0; i < dummy.length; i++) {
                const header = dummy[i];
                if (header.key === 'content-type') {
                    resContentTypeIndex = i
                }
            }
            if (resContentTypeIndex === -1) {
                example.resHeader.push({key:'content-type',value:''})
                resContentTypeIndex = example.resHeader.length - 1
            }
        } catch (error) {}
        
        if (example) {
            if (example.reqBody) {
                if(typeof example.reqBody === 'object') {
                    example.reqBody = JSON.stringify(example.reqBody)
                }
                if (typeof example.reqBody === 'string') {
                    example.reqBody = beautify(example.reqBody, { indent_size: 2, space_in_empty_paren: true })
                }
            }
            if (example.resBody) {
                if (typeof example.resBody === 'object') {
                    example.resBody = JSON.stringify(example.resBody)
                }
                if (typeof example.reqBody === 'string') {
                    example.resBody = beautify(example.resBody, { indent_size: 2, space_in_empty_paren: true })
                }
            }
        }

        const shorts = [{ key: 'key:value', value: '"":"",'}]

        return (
            <div id="div_apiExample">
                <Form>
                    <Header as='h3'>Request</Header>
                    <Header as='h4'>Query</Header>
                    <ul>
                    {
                        (example && example.query && example.query instanceof Array) ?
                            example.query.map((item, index) => {
                                return (<li key={index}>
                                            <Input name={`query.${index}.key`}
                                                label='Key:' size='mini'
                                                value={item.key}
                                                onChange={this.handleChange} />
                                            <Input name={`query.${index}.value`}
                                                label='Value:' size='mini'
                                                value={item.value}
                                                onChange={this.handleChange} />
                                            <span className='sp-inline-form'/>
                                            <Button name={`query.${index}`} onClick={this.delProperty}>Remove</Button>
                                        </li>)
                            })
                        : <div />
                    }
                    </ul>
                    <Button name='query' size='mini' onClick={ this.addQueryOrHeader }>Add</Button>
                    <RawSchemaEditor name='query' schema={example.query} handleChange={this.handleChange} shorts={shorts} />
                    
                    <Header as='h4'>Headers</Header>
                    <ul>
                    {
                        (example && example.reqHeader && example.reqHeader instanceof Array) ?
                            example.reqHeader.map((item, index) => {
                                if (index !== reqContentTypeIndex) {
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
                                } else {
                                    return (<li key='contentType'>
                                    <Label size='large'>Content-Type: </Label>
                                    <Dropdown name={`reqHeader.${index}.value`}
                                        placeholder='pick a type'
                                        selection inline size='mini'
                                        options={[{text:'',value:''},{text:'form-urlencoded',value:'application/x-www-form-urlencoded'},{text:'json',value:'application/json'},{text:'text',value:'text/plain'}]}
                                        value={item.value} onChange={this.handleChange}/>
                                    </li>)
                                }
                            })
                            : <div />
                    }
                    </ul>
                    <Button name='reqHeader' size='mini' onClick={ this.addQueryOrHeader }>Add</Button>
                    <RawSchemaEditor name='query' schema={example.reqHeader} handleChange={this.handleChange} />
                    
                    <Header as='h4'>Body</Header>
                    <TextArea rows='5' autoHeight name="reqBody" value={example.reqBody} onChange={this.handleChange} />
                    <Header as='h3'>Response</Header>
                    <Header as='h4'>Headers</Header>
                    <ul>
                    {
                        (example && example.resHeader && example.resHeader instanceof Array) ?
                            example.resHeader.map((item, index) => {
                                if (index !== resContentTypeIndex) {
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
                                } else {
                                    return (<li key='contentType'>
                                    <Label size='large'>Content-Type: </Label>
                                    <Dropdown name={`resHeader.${index}.value`}
                                        placeholder='pick a type'
                                        selection inline size='mini'
                                        options={[{text:'',value:''},{text:'form-urlencoded',value:'application/x-www-form-urlencoded'},{text:'json',value:'application/json'},{text:'text',value:'text/plain'}]}
                                        value={item.value} onChange={this.handleChange}/>
                                </li>)
                                }
                            })
                            : <div />
                    }
                    </ul>
                    <Button name='resHeader' size='mini' onClick={ this.addQueryOrHeader }>Add</Button>
                    <RawSchemaEditor name='query' schema={example.resHeader} handleChange={this.handleChange} shorts={shorts} />
                    
                    <Header as='h4'>Body</Header>
                    <TextArea rows='5' autoHeight name="resBody" value={example.resBody} onChange={this.handleChange} />

                    <input type="hidden"/>
                </Form>

                <Btns applyAction={this.update} applyDisabled={this.state.updateDisabled && Boolean(this.state.updateDisabled)} hideDiscard={true} />
            </div>
        )
    }
}

export default ApiExampleV