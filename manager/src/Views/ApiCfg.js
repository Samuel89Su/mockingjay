'use strict'

import React, { Component } from 'react'
import queryString from 'query-string'
import { deepClone, updateByPath } from '../utils'
import { Header, Label, Form, Input, TextArea, Checkbox, Dropdown } from 'semantic-ui-react'
import Btns from './BtnApplyDiscard'

class ApiCfg extends Component {
    constructor(props) {
        super(props)

        this.update = this.update.bind(this)
        this.discard = this.discard.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.state = { apiCfg: props.apiCfg, updateDisabled: true }
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

        if (!this.props.appCfg || !this.props.appCfg.name) {
            this.props.fetchApp(search)
        }
    }

    handleChange(e, data) {
        if (this.state.updateDisabled) {
          this.setState({updateDisabled: false})
        }
        let oPath = data.name
        let value = data.type === 'checkbox' ? data.checked : data.value
        let apiCfg = updateByPath(deepClone(this.state.apiCfg), oPath, value)
        this.setState({ apiCfg: apiCfg })
    }

    update(e) {
      this.setState({updateDisabled: true})
      let apiCfg = this.state.apiCfg
      apiCfg.appId = parseInt(this.state.query.appId)
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

        let targetUrl = ''
        let targets = []
        if (this.props.appCfg && this.props.appCfg.targets && this.props.appCfg.targets.length > 0) {
            for (let i = 0; i < this.props.appCfg.targets.length; i++) {
                const target = this.props.appCfg.targets[i];
                targets.push({text: target.name, value: target.name})
                if (apiCfg.forwardTarget === target.name) {
                    targetUrl = target.value
                }
            }
        }

        return (
            <div id="div_apiCfg">
                <Form id="fm_apiCfg">
                    <Input name='name' label='名称:' value={apiCfg.name} onChange={this.handleChange} className='margin-bottom' />
                    <Header as='h4'>描述</Header>
                    <TextArea name="description" rows='4' value={apiCfg.description} onChange={this.handleChange} placeholder='descripe this api' autoHeight className='margin-bottom' />
                    
                    <Label className='margin-bottom'>Method: </Label>
                    <Dropdown name='method' placeholder='Select a method' className='margin-bottom'
                        selection inline options={[{text:'GET', value:'GET'}, {text:'POST', value:'POST'}]}
                        value={apiCfg.method}
                        onChange={this.handleChange} />
                    <br/>
                    
                    <Input label='Path: ' name="path" value={apiCfg.path} onChange={this.handleChange} className='input-row margin-bottom' /><br/>
                    
                    <Checkbox label='验证数据' name="validate" toggle checked={apiCfg.validate} onChange={this.handleChange} className='margin-bottom' /><br/>
                    
                    <Checkbox label="代理" name="forward" toggle checked={apiCfg.forward} onChange={this.handleChange} className='margin-bottom' />
                    <Dropdown name='forwardTarget' placeholder='Select a target'
                        className='dropdown-proxy margin-bottom'
                        selection inline
                        options={targets}
                        value={apiCfg.forwardTarget}
                        onChange={this.handleChange} />
                    <Label>{targetUrl}</Label>
                    <br/>
                    
                    <Label className='margin-bottom' >Logging: </Label>
                    <Dropdown name='logReq' placeholder='Select a log level'
                        selection inline
                        options={[{text:'Req', value:1}, {text:'Res', value:2}]}
                        value={apiCfg.logReq}
                        onChange={this.handleChange} />
                
                    <input type="hidden" />
              </Form>

              <Btns applyAction={this.update} applyDisabled={this.state.updateDisabled && !!this.state.updateDisabled} 
                hideDiscard={this.props.register} discardAction={this.discard} />
            </div>
        )
    }
}

export default ApiCfg