import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/apiSchema.scss'
import { deepClone, updateByPath, delByPath, getPropertyByPath, parseRecursive } from '../utils'
import { Header, Button, Input, Label, TextArea, Form, Dropdown, Checkbox } from 'semantic-ui-react'
import Btns from './BtnApplyDiscard'

class ApiSchemaV extends Component {
    constructor(props) {
        super(props)

        this.update = this.update.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.updateRequired = this.updateRequired.bind(this)
        this.updatePropertyKey = this.updatePropertyKey.bind(this)
        this.addProperty = this.addProperty.bind(this)
        this.delProperty = this.delProperty.bind(this)

        this.state = {}
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.apiSchema && nextProps.apiSchema.properties
            && nextProps.apiSchema.properties.reqBody
            && typeof nextProps.apiSchema.properties.reqBody === 'object') {
            nextProps.apiSchema.properties.reqBody = JSON.stringify(nextProps.apiSchema.properties.reqBody)
        }
        if (nextProps.apiSchema && nextProps.apiSchema.properties
            && nextProps.apiSchema.properties.resBody
            && typeof nextProps.apiSchema.properties.resBody === 'object') {
            nextProps.apiSchema.properties.resBody = JSON.stringify(nextProps.apiSchema.properties.resBody)
        }
        this.setState(nextProps.apiSchema)
    }

    componentWillMount() {
        this.props.onMounted(this.props.location.search)
    }

    handleChange (e, data) {
        let oPath = data.name
        let newState = updateByPath(deepClone(this.state), oPath, data.value)
        this.setState(newState)
    }

    updateRequired (event, data) {
        let paths = data.name.split('.')
        let dummy = deepClone(this.state)
        let required = dummy
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

        this.setState(dummy)
    }

    updatePropertyKey (e, data) {
        let oPath = data.name
        let property = getPropertyByPath(this.state, oPath)
        let newState = delByPath(deepClone(this.state), oPath)
        let key = oPath.split('.').pop()
        oPath = oPath.replace(key, data.value)
        newState = updateByPath(deepClone(newState), oPath, property)
        this.setState(newState)
    }

    addProperty (e, data) {
        let timestamp = (new Date().getTime() - Date.parse('2018')).toString()
        let oPath = data.name + '.' + timestamp
        let value = { type: 'string', pattern: '' }
        let newState = updateByPath(deepClone(this.state), oPath, value)
        this.setState(newState)
    }

    delProperty (e, data) {
        let oPath = data.name
        let newState = delByPath(deepClone(this.state), oPath)
        this.setState(newState)
    }

    update (e) {
      e.target.disabled = true
      let apiSchema = this.state
      let dummy = { appId: this.props.apiCfg.appId, id:this.props.apiCfg.id, schema: apiSchema }
      this.props.onUpdateClick(dummy)
    }

    render() {
        let apiSchema = this.state
        if (!apiSchema || !apiSchema.hasOwnProperty('type')) {
            return (<div>has no state</div>)
        }

        return (
            <div id="div_apiSchema">
                <Header as='h2'>Schema</Header>
                <div>
                    <Button onClick={()=>this.props.history.push(`/app/apilist?${this.props.appQuery}`)} >Back to list</Button>
                </div>
                <Header as='h3'>General</Header>
                <div>
                    <span id="sp_method">{this.props.apiCfg.method}</span>
                    <span id="sp_path">{this.props.apiCfg.path}</span><br/>
                </div>
                <Form>
                    <Header as='h3'>Request</Header>
                    <Header as='h4'>Query</Header>
                    <Button name='properties.query.properties' onClick={this.addProperty}>Add</Button>
                    <ul>
                    {
                        Object.keys(apiSchema.properties.query.properties).map((key, index) => {
                            return (<li key={key}>
                                        <Input name={`properties.query.properties.${key}`}
                                            label='Key:'
                                            value={key}
                                            onChange={this.updatePropertyKey} />
                                        <Input name={`properties.query.properties.${key}.pattern`}
                                            label='Pattern:'
                                            value={apiSchema.properties.query.properties[key].pattern}
                                            onChange={this.handleChange} />
                                        <span className='sp-inline-form'/>
                                        <Checkbox label='Required' name={`properties.query.required.${key}`} toggle 
                                            checked={apiSchema.properties.query.required.indexOf(key) > -1} 
                                            onChange={this.updateRequired} />
                                        <Button name={`properties.query.properties.${key}`} onClick={this.delProperty}>Discard</Button>
                                    </li>)
                        })
                    }
                    </ul>
                    
                    <Header as='h4'>Headers</Header>
                    <Button name='properties.reqHeaders.properties' onClick={this.addProperty}>Add</Button>
                    <ul>
                    {
                        Object.keys(apiSchema.properties.reqHeaders.properties).map((key, index) => {
                            return (<li key={key}>
                                        <Input name={`properties.reqHeaders.properties.${key}`}
                                            label='Key:'
                                            value={key}
                                            onChange={this.updatePropertyKey} />
                                        <Input name={`properties.reqHeaders.properties.${key}.pattern`}
                                            label='Pattern:'
                                            value={apiSchema.properties.reqHeaders.properties[key].pattern}
                                            onChange={this.handleChange} />
                                        <span className='sp-inline-form'/>
                                        <Checkbox label='Required' name={`properties.reqHeaders.required.${key}`} toggle 
                                            checked={apiSchema.properties.reqHeaders.required.indexOf(key) > -1} 
                                            onChange={this.updateRequired} />
                                        <Button name={`properties.reqHeaders.properties.${key}`} onClick={this.delProperty}>Discard</Button>
                                    </li>)
                        })
                    }
                    </ul>
                    
                    <Header as='h4'>Body</Header>
                    <TextArea rows='5' name="properties.reqBody" value={apiSchema.properties.reqBody} onChange={this.handleChange} />

                    <Header as='h3'>Response</Header>
                    <Header as='h4'>Headers</Header>
                    <Button name='properties.resHeaders.properties' onClick={this.addProperty}>Add</Button>
                    <ul>
                    {
                        Object.keys(apiSchema.properties.resHeaders.properties).map((key, index) => {
                            return (<li key={key}>
                                        <Input name={`properties.resHeaders.properties.${key}`}
                                            label='Key:'
                                            value={key}
                                            onChange={this.updatePropertyKey} />
                                        <Input name={`properties.resHeaders.properties.${key}.pattern`}
                                            label='Pattern:'
                                            value={apiSchema.properties.resHeaders.properties[key].pattern}
                                            onChange={this.handleChange} />
                                        <span className='sp-inline-form'/>
                                        <Checkbox label='Required' name={`properties.resHeaders.required.${key}`} toggle 
                                            checked={apiSchema.properties.resHeaders.required.indexOf(key) > -1} 
                                            onChange={this.updateRequired} />
                                        <Button name={`properties.resHeaders.properties.${key}`} onClick={this.delProperty}>Discard</Button>
                                    </li>)
                        })
                    }
                    </ul>
                    
                    <Header as='h4'>Body</Header>
                    <TextArea rows='5' name="properties.resBody" value={apiSchema.properties.resBody} onChange={this.handleChange} />

                    <input type="hidden"/>
                </Form>

                <Btns applyAction={this.update} hideDiscard={true} />
            </div>
        )
    }
}

export default ApiSchemaV