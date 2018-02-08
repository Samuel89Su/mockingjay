import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/appCfg.scss'
import { deepClone, updateByPath } from '../utils'

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

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.appCfg)
    }

    componentWillMount() {
        console.log(this.props.register)
        if (!this.props.register) {
            console.log(this.props.location.search)
            this.props.onMounted(this.props.location.search)
        }
    }

    handleChange(e) {
        let oPath = e.target.name
        let newState = updateByPath(deepClone(this.state), oPath, e.target.value)
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
        
        let discard = <div />
        if (!this.props.register) {
            discard = <button id="btn_discard" onClick={this.discard}>Discard</button>
        }

        return (
            <div id="div_appCfg">
                <h2>App config</h2>
                <Link to='/'>back to list</Link>
                <div>
                    <label>Name: </label>
                    <input name='name' value={appCfg.name} onChange={this.handleChange} />
                    <br/>
                    <h4>Description</h4>
                    <textarea name='desc' value={appCfg.desc} onChange={this.handleChange} />
                    <br/>
                    <div>
                        <text>Targets</text>
                        <button onClick={this.addTagert}>Add</button>
                    </div>
                    <label>Forward: </label>
                    <select name='apiForwardTarget' value="dev" value={appCfg.apiForwardTarget} onChange={this.handleChange} >
                        {
                            appCfg.targets.map((target) => {
                                return (<option key={target.name} value={target.name}>{target.name}</option>)
                            })
                        }
                    </select>
                    <br/>
                    <ul>
                        {
                            appCfg.targets.map((target, index) => {
                                return (<li className="tgt-div" key={target.name}>
                                            <div>
                                                <input name={'targets.' + index + '.name'}
                                                    value={target.name}
                                                    onChange={this.handleChange} />
                                                <button name={index} onClick={this.discardTarget}>Discard</button>
                                            </div>
                                            <input name={'targets.' + index + '.value'}
                                                value={target.value}
                                                onChange={this.handleChange} />
                                        </li>)
                            })
                        }
                    </ul>
                    
                    <br/>

                    <button onClick={this.update} >Apply</button>
                    {
                        discard
                    }
                    
                </div>
            </div>
        );
    }
}

export default appCfgV