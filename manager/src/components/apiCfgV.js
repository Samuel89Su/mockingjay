import React, { Component } from 'react'
import { Link } from 'react-router-dom'
//import '../styles/apiCfg.scss'
import { deepClone, updateByPath } from '../utils'
import { Header, Button, Label,
    Form, Input, TextArea, Checkbox, Dropdown } from 'semantic-ui-react'
import Btns from './btn-apply-discard'

class apiCfgV extends Component {
    constructor(props) {
        super(props)

        this.update = this.update.bind(this)
        this.discard = this.discard.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.state = props.apiCfg
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.apiCfg) {
            this.props.history.goBack()
        }
        this.setState(nextProps.apiCfg)
    }

    componentWillMount() {
        if (!this.props.register) {
            this.props.onMounted(this.props.location.search)
        }
    }

    handleChange(e, data) {
        let oPath = data.name
        let value = data.type === 'checkbox' ? data.checked : data.value
        let newState = updateByPath(deepClone(this.state), oPath, value)
        this.setState(newState)
    }

    update(e) {
      e.target.disabled = true
      let apiCfg = this.state
      this.props.onUpdateClick(apiCfg)
    }

    discard(e) {
      e.target.disabled = true
      let apiCfg = this.state
      this.props.onDiscardClick(apiCfg, this.props.history)
    }

    render() {
        let apiCfg = this.state
        if (!apiCfg || !apiCfg.hasOwnProperty('name')) {
            return (<div>has no state</div>)
        }

        return (
            <div id="div_apiCfg">
                <Header as='h2'>Api config</Header>
                <div>
                    <Button onClick={()=>this.props.history.push(`/app/apilist?${this.props.appQuery}`)} >Back to list</Button>
                </div>
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

export default apiCfgV