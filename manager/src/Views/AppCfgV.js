'use strict'

import React, { Component } from 'react'
import '../styles/appCfg.scss'
import { deepClone, updateByPath } from '../utils'
import { Header, Button, Input, Label, TextArea, Form, Dropdown } from 'semantic-ui-react'
import Btns from './BtnApplyDiscard'
import UsrSearchModal from './UsrSearchModal'

class AppCfgV extends Component {
    constructor(props) {
        super(props)

        this.update = this.update.bind(this)
        this.discard = this.discard.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.addTagert = this.addTagert.bind(this)
        this.discardTarget = this.discardTarget.bind(this)
        this.showShareModal = this.showShareModal.bind(this)

        this.state = { appCfg: props.appCfg, updateDisabled: true }
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
            this.props.onMounted(search)
        }
    }

    handleChange(e, data) {
        if (this.state.updateDisabled) {
          this.setState({updateDisabled: false})
        }
        let oPath = data.name
        let appCfg = updateByPath(deepClone(this.state.appCfg), oPath, data.value)
        this.setState({ appCfg: appCfg })
    }

    addTagert() {
        if (this.state.updateDisabled) {
          this.setState({updateDisabled: false})
        }
        let appCfg = deepClone(this.state.appCfg)
        appCfg.targets.push({
            name: new Date().valueOf().toString(),
            value: ''
        })
        this.setState({ appCfg: appCfg })
    }

    discardTarget(e) {
        if (this.state.updateDisabled) {
          this.setState({updateDisabled: false})
        }
        let appCfg = deepClone(this.state.appCfg)
        var index = parseInt(e.target.name)
        appCfg.targets.splice(index,1)
        this.setState({ appCfg: appCfg })
    }

    update(e) {
      this.setState({updateDisabled: true})
      let appCfg = this.state.appCfg
      this.props.onUpdateClick(appCfg)
      e.target.disabled = false
    }

    discard(e) {
      e.target.disabled = true
      let appCfg = this.state.appCfg
      this.props.onDiscardClick(appCfg)
    }

    showShareModal () {
        this.setState({ openShareModal: true })
    }

    render() {
        let appCfg = this.state.appCfg
        if (!appCfg || !appCfg.hasOwnProperty('name')) {
            return (<div>has no state</div>)
        }

        let targerOpts = []
        if (appCfg.targets && appCfg.targets.length > 0) {
            appCfg.targets.forEach(target => {
                if (target && target.name) {
                    targerOpts.push({text:target.name, value: target.name })
                }
            })
        }

        return (
            <div id="div_appCfg">
                <Header as='h2'>详情</Header>
                <div>
                    <Button onClick={()=>this.props.history.push('/')} >返回应用列表</Button>
                </div>
                <Form id="fm_appCfg">
                    <Input name='name' label='名称:' value={appCfg.name} disabled={!this.props.register} onChange={this.handleChange} />
                    <Header as='h4'>描述</Header>
                    <TextArea name='desc' rows='5' value={appCfg.desc} onChange={this.handleChange} placeholder='descripe this application' autoHeight />
                    <Header as='h4'>代理</Header>
                    <Button onClick={this.addTagert}>添加</Button><br/>
                    <Label size='large'>代理到: </Label>
                    <Dropdown name='apiForwardTarget' placeholder='Select a target'
                        selection inline
                        options={targerOpts}
                        value={appCfg.apiForwardTarget}
                        onChange={this.handleChange} />
                    
                    <br/>
                    <ul>
                        {
                            (appCfg.targets && appCfg.targets.length > 0) ? appCfg.targets.map((target, index) => {
                                if (target && target.name) {
                                    return (<li key={target.name}>
                                        <Input name={'targets.' + index + '.name'}
                                            label='名称:'
                                            value={target.name}
                                            onChange={this.handleChange}/>
                                        <Input name={'targets.' + index + '.value'}
                                            label='BaseUrl:'
                                            value={target.value}
                                            onChange={this.handleChange} />
                                        <span className='sp-inline-form'/>
                                        <Button name={index} onClick={this.discardTarget}>删除</Button>
                                    </li>)
                                }
                            })
                            : null
                        }
                    </ul>
                    
                    <br/>
                    <input type="hidden"/>
                </Form>

                <UsrSearchModal open={this.state.openShareModal}/>

                <Btns applyAction={this.update} applyDisabled={this.state.updateDisabled && !!this.state.updateDisabled}
                    showShare shareAction={this.showShareModal} />
                
            </div>
        )
    }
}

export default AppCfgV