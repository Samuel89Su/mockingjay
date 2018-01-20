import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/appCfg.scss'

class appCfgV extends Component {
    constructor(props) {
        super(props)

        this.update = this.update.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.setState({})
    }

    componentDidMount() {
        this.props.onMounted(this.props.location.search)
    }

    handleChange(e) {
        let oPath = e.target.name
        let pathSegs = oPath.split('.')
        let partialState = {}
        let dummy = partialState
        for (let i = 0; i < pathSegs.length; i++) {
            const path = pathSegs[i];
            let index = e.target.index
            if (path === 'Array') {
            } else {
                dummy[path] = e.target.value
            }
        }

        this.setState(partialState)
    }

    update(e) {
      e.target.disabled = true
      let appCfg = {}
      this.props.onUpdateClick(appCfg)
    }

    render() {
        let appCfg = this.props.appCfg

        let targetDivs = []
        for (const key in appCfg.targets) {
            if (appCfg.targets.hasOwnProperty(key)) {
                let target = appCfg.targets[key];
                targetDivs.push(<li className="tgt-div" key={key}><h5>{key}</h5><input name={'targets.' + key} value={target} onChange={this.handleChange} /></li>)
            }
        }

        return (
            <div id="div_appCfg">
                <h2>App config</h2>
                <Link to='/'>back to list</Link>
                <form id="fm_appCfg">
                    <label>Name: </label>
                    <input id="ipt_name" name='name' value={appCfg.name} onChange={this.handleChange} />
                    <br/>
                    <h4>Description</h4>
                    <textarea id="ipt_desc" name='desc' value={appCfg.desc} onChange={this.handleChange} />
                    <br/>
                    <h4>Targets</h4>
                    <label>Forward: </label>
                    <select id="ipt_forwardTarget" name='apiForwardTarget' value="dev" value={appCfg.apiForwardTarget} onChange={this.handleChange} >
                    <option value="dev">dev</option>
                    <option value="beta">beta</option>
                    <option value="prod">prod</option>
                    </select>
                    <br/>
                    <ul>
                    {
                        targetDivs.map((elem, index) => {
                            return elem
                        })
                    }
                    </ul>
                    
                    <br/>

                    <button id="btn_submit" onClick={this.update} >Apply</button>
                    <button id="btn_discard" onClick="">Discard</button>
                </form>
            </div>
        );
    }
}

export default appCfgV