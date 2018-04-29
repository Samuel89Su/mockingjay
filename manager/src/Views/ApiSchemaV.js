'use strict'

import React, { Component } from 'react'
import { deepClone, updateByPath, delByPath, getPropertyByPath, parseRecursive, object2Array, array2Object } from '../utils'
import { Header, Button, Input, TextArea, Form, Checkbox, Dropdown, Label } from 'semantic-ui-react'
import queryString from 'query-string'
import Btns from './BtnApplyDiscard'
import RawSchemaEditor from './RawSchemaEditor'

class ApiSchemaV extends Component {
    constructor(props) {
        super(props)

        this.update = this.update.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.updateRequired = this.updateRequired.bind(this)
        this.addQueryOrHeader = this.addQueryOrHeader.bind(this)
        this.delProperty = this.delProperty.bind(this)
        this.preprocessSchema = this.preprocessSchema.bind(this)
        
        let schema = deepClone(props.apiSchema)
        schema = parseRecursive(schema)
        let newSchema = this.preprocessSchema(schema)
        this.state = { schema: newSchema, updateDisabled: true }
    }

    componentWillReceiveProps(nextProps) {
        let schema = deepClone(nextProps.apiSchema)
        schema = parseRecursive(schema)
        let newSchema = this.preprocessSchema(schema)
        this.setState({schema: newSchema})
    }

    componentWillMount() {
        let search = (this.props.location && this.props.location.search)
                        ? this.props.location.search
                        : window.location.search
        let query = queryString.parse(search)
        this.setState({ query: query })
        this.props.onMounted(search)
    }

    preprocessSchema (schema) {
        if (schema && schema.properties) {
            // convert body schema to string
            if (schema.properties.reqBody && typeof schema.properties.reqBody === 'object') {
                schema.properties.reqBody = JSON.stringify(schema.properties.reqBody)
            }
            if (schema.properties.resBody && typeof schema.properties.resBody === 'object') {
                schema.properties.resBody = JSON.stringify(schema.properties.resBody)
            }

            if (!schema.properties.query) {
                schema.properties.query ={}
            } else if (!schema.properties.query.properties) {
                schema.properties.query.properties = {}
            }
            // convert query, header schema to Array
            if (schema.properties.query && schema.properties.query.properties) {
                schema.properties.query.properties = object2Array(schema.properties.query.properties)
                if (schema.properties.query.required && schema.properties.query.required.length > 0) {
                    if (schema.properties.query.properties && schema.properties.query.properties.length > 0) {
                        schema.properties.query.properties.forEach(item => {
                            if (schema.properties.query.required.indexOf(item.key) > -1) {
                                item.value.required = true
                            } else {
                                item.value.required = true
                            }
                        });
                    }
                }
            }

            if (!schema.properties.reqHeaders) {
                schema.properties.reqHeaders ={}
            } else if (!schema.properties.reqHeaders.properties) {
                schema.properties.reqHeaders.properties = {}
            }
            // if (!schema.properties.reqHeaders.properties.hasOwnProperty('content-type')) {
            //     schema.properties.reqHeaders.properties['content-type'] = {type: 'string', regexp: 'application/json'}
            //     this.setState({updateDisabled: false})
            // }
            // if (schema.properties.reqHeaders.required.indexOf('content-type') === -1) {
            //     schema.properties.reqHeaders.required.push('content-type')
            // }
                schema.properties.reqHeaders.properties = object2Array(schema.properties.reqHeaders.properties)
                if (schema.properties.reqHeaders.required && schema.properties.reqHeaders.required.length > 0) {
                    if (schema.properties.reqHeaders.properties && schema.properties.reqHeaders.properties.length > 0) {
                        schema.properties.reqHeaders.properties.forEach(item => {
                            if (schema.properties.reqHeaders.required.indexOf(item.key) > -1) {
                                item.value.required = true
                            } else {
                                item.value.required = true
                            }
                        });
                    }
                }

                if (!schema.properties.resHeaders) {
                    schema.properties.resHeaders ={}
                } else if (!schema.properties.resHeaders.properties) {
                    schema.properties.resHeaders.properties = {}
                }
                // if (!schema.properties.resHeaders.properties.hasOwnProperty('content-type')) {
                //     schema.properties.resHeaders.properties['content-type'] = {type: 'string', regexp: 'application/json'}
                //     this.setState({updateDisabled: false})
                // }
                // if (schema.properties.resHeaders.required.indexOf('content-type') === -1) {
                //     schema.properties.resHeaders.required.push('content-type')
                // }
                schema.properties.resHeaders.properties = object2Array(schema.properties.resHeaders.properties)
                if (schema.properties.resHeaders.required && schema.properties.resHeaders.required.length > 0) {
                    if (schema.properties.resHeaders.properties && schema.properties.resHeaders.properties.length > 0) {
                        schema.properties.resHeaders.properties.forEach(item => {
                            if (schema.properties.resHeaders.required.indexOf(item.key) > -1) {
                                item.value.required = true
                            } else {
                                item.value.required = true
                            }
                        });
                    }
                }
        }

        return schema
    }

    handleChange (e, data) {
        if (this.state.updateDisabled) {
          this.setState({updateDisabled: false})
        }
        let oPath = data.name
        let value = data.type === 'checkbox' ? data.checked : data.value
        let schema = updateByPath(deepClone(this.state.schema), oPath, value)
        this.setState({schema: schema})
    }

    updateRequired (event, data) {
        if (this.state.updateDisabled) {
          this.setState({updateDisabled: false})
        }
        let paths = data.name.split('.')
        let schema = deepClone(this.state.schema)
        let required = schema
        for (let i = 0; i < paths.length - 1; i++) {
            const path = paths[i];
            required = required[path]
        }
        let checked = data.checked
        let key = paths.pop()
        if (checked) {
            if (required.indexOf(key) === -1) {
                required.push(key)
            }
        } else {
            let index = required.indexOf(key)
            if (index > -1) {
                required.splice(index, 1)
            }
        }

        this.setState({schema: schema})
    }

    updatePropertyKey (e, data) {
        if (this.state.updateDisabled) {
          this.setState({updateDisabled: false})
        }
        let oPath = data.name
        let property = getPropertyByPath(this.state.schema, oPath)
        let schema = delByPath(deepClone(this.state.schema), oPath)
        let key = oPath.split('.').pop()
        oPath = oPath.replace(key, data.value)
        schema = updateByPath(deepClone(schema), oPath, property)
        this.setState({schema: schema})
    }

    addQueryOrHeader (e, data) {
        if (this.state.updateDisabled) {
          this.setState({updateDisabled: false})
        }
        let oPath = data.name
        let value = { key: '', value: { type: 'string', regexp: '' } }
        let schema = deepClone(this.state.schema)
        let arr = getPropertyByPath(schema, oPath)
        arr.push(value)
        this.setState({schema: schema})
    }

    delProperty (e, data) {
        if (this.state.updateDisabled) {
          this.setState({updateDisabled: false})
        }
        let lastIndex = data.name.lastIndexOf('.')
        let path = data.name.substr(0, lastIndex)
        let index = parseInt(data.name.split('.').pop())
        let schema = deepClone(this.state.schema)
        let arr = getPropertyByPath(schema, path)
        let removed = arr.splice(index, 1)

        // check required
        lastIndex = path.lastIndexOf('.')
        path = path.substr(0, lastIndex) + '.required'
        let required = getPropertyByPath(schema, path)
        index = required.indexOf(removed[0].key)
        if (index > -1) {
            required.splice(index, 1)
        }

        this.setState({schema: schema})
    }

    update (e) {
        this.setState({updateDisabled: true})
        let schema = this.state.schema

        // convert query, header
        if (schema && schema.properties) {
            if (schema.properties.query && schema.properties.query.properties) {
                schema.properties.query.required = []
                schema.properties.query.properties.forEach(item => {
                    if (item && item.value && item.value.required) {
                        schema.properties.query.required.push(item.key)
                        delete item.value.required
                    }
                });
                schema.properties.query.properties = array2Object(schema.properties.query.properties)
            } else {
                schema.properties.query = { type: 'object', properties: {}, required: []}
            }
            if (schema.properties.reqHeaders && schema.properties.reqHeaders.properties) {
                schema.properties.reqHeaders.required = []
                schema.properties.reqHeaders.properties.forEach(item => {
                    if (item && item.value && item.value.required) {
                        schema.properties.reqHeaders.required.push(item.key)
                        delete item.value.required
                    }
                });
                schema.properties.reqHeaders.properties = array2Object(schema.properties.reqHeaders.properties)
            } else {
                schema.properties.reqHeaders = { type: 'object', properties: {}, required: []}
            }
            if (schema.properties.resHeaders && schema.properties.resHeaders.properties) {
                schema.properties.resHeaders.required = []
                schema.properties.resHeaders.properties.forEach(item => {
                    if (item && item.value && item.value.required) {
                        schema.properties.resHeaders.required.push(item.key)
                        delete item.value.required
                    }
                });
                schema.properties.resHeaders.properties = array2Object(schema.properties.resHeaders.properties)
            } else {
                schema.properties.resHeaders = { type: 'object', properties: {}, required: []}
            }
        }

        let dummy = { appId: this.props.apiCfg.appId, id:this.props.apiCfg.id, schema: schema }
        this.props.onUpdateClick(dummy)
    }

    render() {
        let apiSchema = this.state.schema
        if (!apiSchema || !apiSchema.hasOwnProperty('type')) {
            return (<div>has no state</div>)
        }

        const shorts = [{ key: 'type:string', value: '"type":"string"'}, { key: 'type:number', value: '"type":"number"' }, { key: 'regexp', value: '"regexp":' }, { key: 'required', value: '"required":'}]
       
        let reqContentTypeIndex = -1
        try {
            let dummy = apiSchema.properties.reqHeaders.properties
            for (let i = 0; i < dummy.length; i++) {
                const header = dummy[i];
                if (header.key === 'content-type') {
                    reqContentTypeIndex = i
                    break
                }
            }
            if (reqContentTypeIndex === -1) {
                dummy.push({key: 'content-type', value: {type:'string',regexp:''}})
                reqContentTypeIndex = dummy.length - 1
            }
        } catch (error) {}
        
        let resContentTypeIndex = -1
        try {
            let dummy = apiSchema.properties.resHeaders.properties
            for (let i = 0; i < dummy.length; i++) {
                const header = dummy[i];
                if (header.key === 'content-type') {
                    resContentTypeIndex = i
                    break
                }
            }
            if (resContentTypeIndex === -1) {
                dummy.push({key: 'content-type', value: {type:'string',regexp:''}})
                resContentTypeIndex = dummy.length - 1
            }
        } catch (error) {}

        return (
            <div className="div-schema">
                <Form>
                    <Header as='h3'>Request</Header>
                    <Header as='h4'>Query</Header>
                    <text>使用正则表达式进行数据验证</text>
                    <ul>
                    {
                            apiSchema.properties.query.properties.map((item, index) => {
                                return (<li key={index}>
                                            <Input name={`properties.query.properties.${index}.key`}
                                                label='Key:' size='mini'
                                                value={item.key}
                                                onChange={this.handleChange} />
                                            <Input name={`properties.query.properties.${index}.value.regexp`}
                                                label='RegExp:' size='mini'
                                                value={item.value.regexp}
                                                onChange={this.handleChange} />
                                            <span className='sp-inline-form'/>
                                            <Checkbox label='Required' name={`properties.query.properties.${index}.value.required`}
                                                toggle size='mini'
                                                checked={item.value.required}
                                                onChange={this.handleChange} />
                                            <Button name={`properties.query.properties.${index}`} size='mini' onClick={this.delProperty}>Remove</Button>
                                        </li>)
                            })
                    }
                    </ul>
                    <Button name='properties.query.properties' size='mini' onClick={ this.addQueryOrHeader }>Add</Button>
                    <RawSchemaEditor name='properties.query.properties' schema={apiSchema.properties.query.properties} handleChange={this.handleChange} shorts={shorts} />

                    <Header as='h4'>Headers</Header>
                    <text>使用正则表达式进行数据验证</text>
                    <ul>
                        
                    {
                        apiSchema.properties.reqHeaders.properties.map((item, index) => {
                                if (index !== reqContentTypeIndex) {
                                    return (<li key={index}>
                                        <Input name={`properties.reqHeaders.properties.${index}.key`}
                                            label='Key:' size='mini'
                                            value={item.key}
                                            onChange={this.handleChange} />
                                        <Input name={`properties.reqHeaders.properties.${index}.value.regexp`}
                                            label='RegExp:' size='mini'
                                            value={item.value.regexp}
                                            onChange={this.handleChange} />
                                        <span className='sp-inline-form'/>
                                        <Checkbox label='Required' name={`properties.reqHeaders.properties.${index}.value.required`}
                                            toggle size='mini'
                                            checked={item.value.required}
                                            onChange={this.handleChange} />
                                        <Button name={`properties.reqHeaders.properties.${index}`} size='mini' onClick={this.delProperty}>Remove</Button>
                                    </li>)
                                } else {
                                    return (<li key='contentType'>
                                    <Label size='large'>Content-Type: </Label>
                                    <Dropdown name={`properties.reqHeaders.properties.${index}.value.regexp`}
                                        placeholder='pick a type'
                                        selection inline size='mini'
                                        options={[{text:'',value:''},{text:'form-urlencoded',value:'application/x-www-form-urlencoded'},{text:'json',value:'application/json'},{text:'text',value:'text/plain'}]}
                                        value={item.value.regexp} onChange={this.handleChange}/>
                                </li>)
                                }
                            })
                    }
                    </ul>
                    <Button name='properties.reqHeaders.properties' size='mini' onClick={ this.addQueryOrHeader }>Add</Button>
                    <RawSchemaEditor name='properties.reqHeaders.properties' schema={apiSchema.properties.reqHeaders.properties} handleChange={this.handleChange} shorts={shorts} />

                    <Header as='h4'>Body Schema</Header>
                    <text>使用Json Schema进行数据验证</text><br/>
                    <TextArea rows='5' name="properties.reqBody" value={apiSchema.properties.reqBody} onChange={this.handleChange} autoHeight />
                    <Header as='h3'>Response</Header>
                    <Header as='h4'>Headers</Header>
                    <text>使用正则表达式进行数据验证</text>
                    <ul>
                    {
                            apiSchema.properties.resHeaders.properties.map((item, index) => {
                                if (index !== resContentTypeIndex) {
                                    return (<li key={index}>
                                        <Input name={`properties.resHeaders.properties.${index}.key`}
                                            label='Key:' size='mini'
                                            value={item.key}
                                            onChange={this.handleChange} />
                                        <Input name={`properties.resHeaders.properties.${index}.value.regexp`}
                                            label='RegExp:' size='mini'
                                            value={item.value.regexp}
                                            onChange={this.handleChange} />
                                        <span className='sp-inline-form'/>
                                        <Checkbox label='Required' name={`properties.resHeaders.properties.${index}.value.required`}
                                            toggle size='mini'
                                            checked={item.value.required}
                                            onChange={this.handleChange} />
                                        <Button name={`properties.resHeaders.properties.${index}`} size='mini' onClick={this.delProperty}>Remove</Button>
                                    </li>)
                                } else {
                                    return (<li key='contentType'>
                                    <Label size='large'>Content-Type: </Label>
                                    <Dropdown name={`properties.resHeaders.properties.${index}.value.regexp`}
                                        placeholder='pick a type'
                                        selection inline size='mini'
                                        options={[{text:'',value:''},{text:'form-urlencoded',value:'application/x-www-form-urlencoded'},{text:'json',value:'application/json'},{text:'text',value:'text/plain'}]}
                                        value={item.value.regexp} onChange={this.handleChange}/>
                                </li>)
                                }
                            })
                    }
                    </ul>
                    <Button name='properties.resHeaders.properties' size='mini' onClick={ this.addQueryOrHeader }>Add</Button>
                    <RawSchemaEditor name='properties.resHeaders.properties' schema={apiSchema.properties.resHeaders.properties} handleChange={this.handleChange} shorts={shorts} />

                    <Header as='h4'>Body Schema</Header>
                    <text>使用Json Schema进行数据验证</text><br/>
                    <TextArea rows='5' name="properties.resBody" value={apiSchema.properties.resBody} onChange={this.handleChange} autoHeight />

                    <input type="hidden"/>
                </Form>

                <Btns applyAction={this.update} applyDisabled={this.state.updateDisabled && Boolean(this.state.updateDisabled)} hideDiscard={true} />
            </div>
        )
    }
}

export default ApiSchemaV