import React, { Component } from 'react'
import queryString from 'query-string'
import '../styles/appRegister.scss'

class appCfgV extends Component {
    constructor(props) {
        super(props)
        
        this.update = this.update.bind(this)
    }

    componentDidMount() {
        let query = queryString.parse(this.props.location.search)
        this.props.onMounted(parseInt(query.appId))
    }

    update() {
      let appCfg = {}
      this.props.onUpdateClick(appCfg)
    }

    render() {
        let appCfg = this.props.appCfg

        let targetDivs = []
        for (const key in appCfg.targets) {
            if (appCfg.targets.hasOwnProperty(key)) {
                let target = appCfg.targets[key];
                targetDivs.push(<div key={key}><h5>{key}</h5><input value={target}/></div>)
            }
        }

        return (
            <div id="fm_appCfg">
                <label>Name: </label>
                <input id="ipt_name" value={appCfg.name} />
                <br/>
                <h4>Description</h4>
                <textarea id="ipt_desc" value={appCfg.desc} />
                <br/>
                <h4>Deployment</h4>
                <label>Forward: </label>
                <select id="ipt_forwardTarget" value="dev" value={appCfg.apiForwardTarget}>
                <option value="dev">dev</option>
                <option value="beta">beta</option>
                <option value="prod">prod</option>
                </select>
                <br/>
                {
                    targetDivs.map((elem, index) => {
                        return elem
                    })
                }
                
                <br/>

                <button id="btn_submit" onClick={()=> this.update() } >Apply</button>
                <button id="btn_discard" onClick="">Discard</button>
            </div>
        );
    }
}

export default appCfgV