import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/apiSchema.scss'
import deepClone from '../utils/deepClone'

class apiSchemaV extends Component {
    constructor(props) {
        super(props)

        this.update = this.update.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.state = {}
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.apiSchema)
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
      let apiSchema = this.state
      this.props.onUpdateClick(apiSchema)
    }

    render() {
        let apiSchema = this.state
        if (!apiSchema || !apiSchema.hasOwnProperty('type')) {
            return (<div>has no state</div>)
        }

        return (
            <div id="div_apiSchema">
                <h4>Api Schema</h4>
                <Link to='/app/apilist?appId=1'>back to list</Link>
                <div id="pn_schema">
                    <h3>General</h3>
                    <div>
                    <span id="sp_method">{this.props.apiCfg.method}</span>
                    <span id="sp_path">{this.props.apiCfg.path}</span><br/>
                    </div>

                    <h3>Request</h3>
                    <h4>Query</h4>
                    <div id="dv_scm_query">
                    <textarea id="ipt_query" value={apiSchema.properties.query} onChange={this.handleChange} />
                    </div>
                    
                    <h4>Headers</h4>
                    <div id="dv_scm_req_header">
                    <textarea id="ipt_req_header" value={apiSchema.properties.reqHeaders} onChange={this.handleChange} />
                    </div>
                    
                    <h4>Body</h4>
                    <div id="dv_scm_req_body">
                    <textarea id="ipt_req_body" value={apiSchema.properties.reqBody} onChange={this.handleChange} />
                    </div>

                    <h3>Response</h3>    
                    <h4>Headers</h4>
                    <div id="dv_scm_res_header">
                    <textarea id="ipt_res_header" value={apiSchema.properties.resHeaders} onChange={this.handleChange} />
                    </div>
                    
                    <h4>Body</h4>
                    <div id="dv_scm_res_body">
                    <textarea id="ipt_res_body" value={apiSchema.properties.resBody} onChange={this.handleChange} />
                    </div>

                    <button id="btn_submit" onClick={this.update}>Apply</button>

                </div>
            </div>
        );
    }
}

export default apiSchemaV