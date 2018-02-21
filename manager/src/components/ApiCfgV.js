import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
//import '../styles/apiCfg.scss'
import { deepClone, updateByPath } from '../utils'
import { Header, Button, Label,
    Form, Input, TextArea, Checkbox, Dropdown } from 'semantic-ui-react'
import Btns from './BtnApplyDiscard'

class ApiCfgV extends Component {
    constructor(props) {
        super(props)

        this.update = this.update.bind(this)
        this.discard = this.discard.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.state = { apiCfg: props.apiCfg }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.apiCfg) {
            this.props.history.goBack()
        }        
        if (this.state.apiCfg.id === 0 && nextProps.apiCfg.id > 0) {
            this.props.history.push(`/api/details?appId=${this.state.query.appId}&appName=${this.state.query.appName}&id=${nextProps.apiCfg.id}`)
        } else {
            this.setState({ apiCfg: nextProps.apiCfg })
        }
    }

    componentWillMount() {
        let search = (this.props.location && this.props.location.search)
            ? this.props.location.search
            : window.location.search
        let query = queryString.parse(search)
        this.setState({ query: query })
        if (!this.props.register) {
            this.props.onMounted(search)
        }
    }

    handleChange(e, data) {
        let oPath = data.name
        let value = data.type === 'checkbox' ? data.checked : data.value
        let apiCfg = updateByPath(deepClone(this.state.apiCfg), oPath, value)
        this.setState({ apiCfg: apiCfg })
    }

    update(e) {
      e.target.disabled = true
      let apiCfg = this.state.apiCfg
      this.props.onUpdateClick(apiCfg)
    }

    discard(e) {
      e.target.disabled = true
      let apiCfg = this.state.apiCfg
      this.props.onDiscardClick(apiCfg, this.props.history)
    }

    render() {
        let apiCfg = this.state.apiCfg
        if (!apiCfg || !apiCfg.hasOwnProperty('name')) {
            return (<div>has no state</div>)
        }

        return (
            <div id="div_apiCfg">
                <Form id="fm_apiCfg">
                    <Input name='name' label='Name:' value={apiCfg.name} onChange={this.handleChange} />
                    <Header as='h4'>Description</Header>
                    <TextArea name="description" rows='4' value={apiCfg.description} onChange={this.handleChange} placeholder='descripe this api' />
                    
                    <Label>Method: </Label>
                    <Dropdown name='method' placeholder='Select a method' 
                        selection inline options={[{text:'GET', value:'GET'}, {text:'POST', value:'POST'}]} 
                        value={apiCfg.method} 
                        onChange={this.handleChange} />
                    <br/>
                    
                    <Input label='Path: ' name="path" value={apiCfg.path} onChange={this.handleChange} /><br/>
                    
                    <Checkbox label='Validate req' name="validate" toggle checked={apiCfg.validate} onChange={this.handleChange} />
                    
                    <Checkbox label="Forward req" name="forward" toggle checked={apiCfg.forward} onChange={this.handleChange} />
                    <br/>
                    
                    <Label>LogReq: </Label>
                    <Dropdown name='logReq' placeholder='Select a log level' 
                        selection inline options={[{text:'Req', value:1}, 
                            {text:'Res', value:2}]} 
                        value={apiCfg.logReq} 
                        onChange={this.handleChange} />
                
                    <input type="hidden" />
              </Form>

              <Btns applyAction={this.update} hideDiscard={this.props.register} discardAction={this.discard} />
            </div>
        )
    }
}

export default ApiCfgV