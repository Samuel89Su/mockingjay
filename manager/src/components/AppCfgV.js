import React, { Component } from 'react'
import '../styles/appCfg.scss'
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

        this.state = { appCfg: props.appCfg }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.appCfg.id === 0 && nextProps.appCfg.id > 0) {
            this.props.history.push(`/app/details?appId=${nextProps.appCfg.id}&appName=${nextProps.appCfg.name}`)
        } else {
            this.setState({ appCfg: nextProps.appCfg })
        }
    }

    componentWillMount() {
        if (!this.props.register) {
            let search = (this.props.location && this.props.location.search)
                            ? this.props.location.search
                            : window.location.search
            this.setState({ search: search })
            this.props.onMounted(search)
        }
    }

    handleChange(e, data) {
        let oPath = data.name
        let appCfg = updateByPath(deepClone(this.state.appCfg), oPath, data.value)
        this.setState({ appCfg: appCfg })
    }

    addTagert() {
        let appCfg = deepClone(this.state.appCfg)
        appCfg.targets.push({
            name: new Date().valueOf().toString(),
            value: ''
        })
        this.setState({ appCfg: appCfg })
    }

    discardTarget(e) {
        let appCfg = deepClone(this.state.appCfg)
        var index = parseInt(e.target.name)
        appCfg.targets.splice(index,1)
        this.setState({ appCfg: appCfg })
    }

    update(e) {
      e.target.disabled = true
      let appCfg = this.state.appCfg
      this.props.onUpdateClick(appCfg)
      e.target.disabled = false
    }

    discard(e) {
      e.target.disabled = true
      let appCfg = this.state.appCfg
      this.props.onDiscardClick(appCfg)
    }

    render() {
        let appCfg = this.state.appCfg
        if (!appCfg || !appCfg.hasOwnProperty('name')) {
            return (<div>has no state</div>)
        }

        let targerOpts = []
        appCfg.targets.forEach(target => {
            if (target && target.name) {
                targerOpts.push({text:target.name, value: target.name })
            }
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
                        selection inline
                        options={targerOpts}
                        value={appCfg.apiForwardTarget}
                        onChange={this.handleChange} />
                    
                    <br/>
                    <ul>
                        {
                            appCfg.targets.map((target, index) => {
                                if (target && target.name) {
                                    return (<li key={target.name}>
                                        <Input name={'targets.' + index + '.name'}
                                            label='Name:'
                                            value={target.name}
                                            onChange={this.handleChange}/>
                                        <Input name={'targets.' + index + '.value'}
                                            label='Value:'
                                            value={target.value}
                                            onChange={this.handleChange} />
                                        <span className='sp-inline-form'/>
                                        <Button name={index} onClick={this.discardTarget}>Discard</Button>
                                    </li>)
                                }                                
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