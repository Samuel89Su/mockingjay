import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// import '../styles/appCfg.scss'
import { deepClone, updateByPath } from '../utils'
import { Header, Button, Input, Label, TextArea, Form, Dropdown } from 'semantic-ui-react'
import Btns from './BtnApplyDiscard'

class AppCfgV extends Component {
    constructor(props) {
        super(props)

        this.update = this.update.bind(this)
        this.discard = this.discard.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.addTagert = this.addTagert.bind(this)
        this.discardTarget = this.discardTarget.bind(this)

        this.state = props.appCfg
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.appCfg)
    }

    componentWillMount() {
        if (!this.props.register) {
            this.props.onMounted(this.props.location.search)
        }
    }

    handleChange(e, data) {
        let oPath = data.name
        let newState = updateByPath(deepClone(this.state), oPath, data.value)
        this.setState(newState)
    }

    addTagert() {
        let newState = deepClone(this.state)
        newState.targets.push({
            name: new Date().valueOf().toString(),
            value: ''
        })
        this.setState(newState)
    }

    discardTarget(e) {
        let newState = deepClone(this.state)
        var index = parseInt(e.target.name)
        newState.targets.splice(index,1)
        this.setState(newState)
    }

    update(e) {
      e.target.disabled = true
      let appCfg = this.state
      this.props.onUpdateClick(appCfg)
      e.target.disabled = false
    }

    discard(e) {
      e.target.disabled = true
      let appCfg = this.state
      this.props.onDiscardClick(appCfg)
    }

    render() {
        let appCfg = this.state
        if (!appCfg || !appCfg.hasOwnProperty('name')) {
            return (<div>has no state</div>)
        }

        let targerOpts = []
        appCfg.targets.forEach(target => {
            targerOpts.push({text:target.name, value: target.name })
        })

        return (
            <div id="div_appCfg">
                <Header as='h2'>App details</Header>
                <div>
                    <Button onClick={()=>this.props.history.push('/')} >Back to list</Button>
                </div>
                <Form id="fm_appCfg">
                    <Input name='name' label='Name:' value={appCfg.name} onChange={this.handleChange} />
                    <Header as='h4'>Description</Header>
                    <TextArea name='desc' rows='5' value={appCfg.desc} onChange={this.handleChange} placeholder='descripe this application' />
                    <Header as='h4'>Targets</Header>
                    <Button onClick={this.addTagert}>Add</Button><br/>
                    <Label size='large'>Forward: </Label>
                    <Dropdown name='apiForwardTarget' placeholder='Select a target' 
                        selection inline options={targerOpts} 
                        value={appCfg.apiForwardTarget} 
                        onChange={this.handleChange} />
                    
                    <br/>
                    <ul>
                        {
                            appCfg.targets.map((target, index) => {
                                return (<li key={target.name}>
                                            <Input name={'targets.' + index + '.name'}
                                                label='Name:'
                                                value={target.name}
                                                onChange={this.handleChange} />
                                            <Input name={'targets.' + index + '.value'}
                                                label='Value:'
                                                value={target.value}
                                                onChange={this.handleChange} />
                                            <Button name={index} onClick={this.discardTarget} style={{margin: '0 0 0 80px'}}>Discard</Button>
                                        </li>)
                            })
                        }
                    </ul>
                    
                    <br/>
                    <input type="hidden"/>
                </Form>

                <Btns applyAction={this.update} hideDiscard={this.props.register} discardAction={this.discard} />
                
            </div>
        )
    }
}

export default AppCfgV