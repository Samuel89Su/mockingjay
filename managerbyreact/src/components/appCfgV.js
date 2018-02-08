import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/appCfg.scss'
import deepClone from '../utils/deepClone'

class appCfgV extends Component {
    constructor(props) {
        super(props)

        this.update = this.update.bind(this)
        this.discard = this.discard.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.addTagert = this.addTagert.bind(this)
        this.discardTarget = this.discardTarget.bind(this)

        this.state = props.appCfg
    }

    // componentWillReceiveProps(nextProps) {
    //     this.setState(nextProps.appCfg)
    // }

    componentWillMount() {
        if (!this.props.register) {
            this.props.onMounted(this.props.location.search)
        }
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

    addTagert() {
        let newState = deepClone(this.state)
        // newState.targets.new = ''
        this.setState(newState)
    }

    discardTarget(e) {
        let newState = deepClone(this.state)
        delete newState.targets[e.target.name]
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

        let targets = []
        for (const key in appCfg.targets) {
            if (appCfg.targets.hasOwnProperty(key)) {
                let target = appCfg.targets[key];
                targets.push({name: key, value: target})
                
            }
        }
        let discard = <div />
        if (!this.props.register) {
            discard = <button id="btn_discard" onClick={this.discard}>Discard</button>
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
                    <div>
                        <text>Targets</text>
                        <button onClick={this.addTagert}>Add</button>
                    </div>
                    <label>Forward: </label>
                    <select id="ipt_forwardTarget" name='apiForwardTarget' value="dev" value={appCfg.apiForwardTarget} onChange={this.handleChange} >
                        {
                            targets.map((target) => {
                                return (<option key={target.name} value={target.name}>{target.name}</option>)
                            })
                        }
                    </select>
                    <br/>
                    <ul>
                        {
                            targets.map((target) => {
                                return (<li className="tgt-div" key={target.name}>
                                        <div>
                                            <text>{target.name}</text>
                                            <button name={target.name} onClick={this.discardTarget}>Discard</button>
                                        </div>
                                        <input name={'targets.' + target.name}
                                            value={target.value}
                                            onChange={this.handleChange} />
                                        </li>)
                            })
                        }
                    </ul>
                    
                    <br/>

                    <button id="btn_submit" onClick={this.update} >Apply</button>
                    {
                        discard
                    }
                    
                </form>
            </div>
        );
    }
}

export default appCfgV