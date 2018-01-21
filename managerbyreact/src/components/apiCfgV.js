import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/apiCfg.scss'
import deepClone from '../utils/deepClone'

class apiCfgV extends Component {
    constructor(props) {
        super(props)

        this.update = this.update.bind(this)
        this.discard = this.discard.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.state = {}
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.apiCfg) {
            this.props.history.goBack()
        }
        this.setState(nextProps.apiCfg)
    }

    componentDidMount() {
        this.props.onMounted(this.props.location.search)
    }

    handleChange(e) {
        let oPath = e.target.name
        let pathSegs = oPath.split('.')
        let newState = deepClone(this.state)
        let dummy = newState
        for (let i = 0; i < pathSegs.length; i++) {
            const path = pathSegs[i];
            if (i === pathSegs.length - 1) {
                dummy[path] = e.target.value
            } else {
                dummy = dummy[path]
            }
        }

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
                <h2>Api config</h2>
                <Link to='/app/apilist?appId=1'>back to list</Link>
                <form id="fm_apiCfg">
                    <label htmlFor="ipt_name">Name: </label>
                    <input id="ipt_name" name="name" value={apiCfg.name} onChange={this.handleChange} /><br/>
                
                    <h4>Description</h4>
                    <textarea id="ipt_description" name="description" value={apiCfg.description} onChange={this.handleChange} /><br/>
                    
                    <label htmlFor="ipt_method">Method: </label>
                    <select id="ipt_method" name="method" value={apiCfg.method} onChange={this.handleChange}>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    </select><br/>
                    
                    <label htmlFor="ipt_path">Path: </label>
                    <input id="ipt_path" name="path" value={apiCfg.path} onChange={this.handleChange} /><br/>
                    
                    <label htmlFor="ipt_validate">Validate: </label>
                    <input type="checkbox" id="ipt_validate" value={apiCfg.validate} onChange={this.handleChange} /><br/>
                    
                    <label htmlFor="ipt_forward">Forward: </label>
                    <input type="checkbox" id="ipt_forward" name="forward" value={apiCfg.forward} onChange={this.handleChange} /><br/>
                    
                    <label htmlFor="ipt_logReq">LogReq: </label>
                    <input id="ipt_logReq" name="logReq" value={apiCfg.logReq} onChange={this.handleChange} /><br/>
                
                    <button id="btn_submit" onClick={this.update}>Apply</button>
                    <button id="btn_discard" onClick={this.discard}>Discard</button>
              </form>
            </div>
        );
    }
}

export default apiCfgV