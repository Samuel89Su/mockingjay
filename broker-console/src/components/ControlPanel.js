import React, { Component } from 'react'
import { fetchRemote } from '../middlewares/remoteFetch'
import InventoryAPI from '../middlewares/InventoryAPI'
import { Header, Button, Input, Checkbox, Dropdown } from 'semantic-ui-react'
import '../styles/btn.scss'

class ControlPanel extends Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.handleChange = this.handleChange.bind(this)
    this.addRoute = this.addRoute.bind(this)
    this.removeRoute = this.removeRoute.bind(this)
    this.clickUpdateBtn = this.clickUpdateBtn.bind(this)
  }

  componentWillMount() {
    fetchRemote(InventoryAPI.fetchUserCfg)
      .then(
        (config) => {
            // router process
            if (config && config.router && Object.keys(config.router).length > 0) {
                let dummyRouter = config.router
                delete config.router
                config.router = []
                for (const key in dummyRouter) {
                    if (dummyRouter.hasOwnProperty(key)) {
                        const route = dummyRouter[key];
                        config.router.push({
                            path: key,
                            target: route
                        })
                    }
                }
            }

          this.setState({
              proxyCfg: config,
              updateDisabled: true
          })
        },
        (err) => {
          alert(err)
        })
  }

  clickUpdateBtn() {
    // router process
    let dummy = Object.assign({}, this.state.proxyCfg)
    if (dummy && dummy.router && dummy.router.length > 0) {
        let dummyRouter = dummy.router
        delete dummy.router
        dummy.router = {}
        for (let i = 0; i < dummyRouter.length; i++) {
            const route = dummyRouter[i];
            dummy.router[route.path] = route.target
        }
    }

    // xmlReqTarget process
    if (!dummy.xmlHttRequestTarget) {
        delete dummy.xmlHttRequestTarget
    }

    let api = InventoryAPI.updateUserCfg
    let fetchOpts = Object.assign({}, api)
    let payload = JSON.stringify(dummy)
    fetchRemote(fetchOpts, payload)
      .then(
        (config) => {
            // router process
            if (config && config.router && Object.keys(config.router).length > 0) {
                let dummyRouter = config.router
                delete config.router
                config.router = []
                for (const key in dummyRouter) {
                    if (dummyRouter.hasOwnProperty(key)) {
                        const route = dummyRouter[key];
                        config.router.push({
                            path: key,
                            target: route
                        })
                    }
                }
            }

          this.setState({
              proxyCfg: config,
              updateDisabled: true
          })
        },
        (err) => {
          alert(err)
        })
  }

  handleChange(e, d) {
      let dummy = Object.assign({}, this.state.proxyCfg)
      if (d.name.indexOf('oute') === -1 || d.name.startsWith('f')) {
          dummy[d.name] = d.value
      } else if (d.name.indexOf('router') > -1) {
          let segs = d.name.split('.')
          dummy.router[d['data-index']][segs[1]] = d.value
      } else if (d.name.indexOf('regExpRoutes') > -1) {
        let segs = d.name.split('.')
        dummy.regExpRoutes[d['data-index']][segs[1]] = d.value
      }
      this.setState({ proxyCfg: dummy, updateDisabled: false })
  }

  removeRoute(e, d) {
    let dummy = Object.assign({}, this.state.proxyCfg)
    let index = d['data-index']
    if (d.name.indexOf('router') > -1) {
        dummy.router.splice(index, 1)
    } else if (d.name.indexOf('regExpRoutes') > -1) {
      dummy.regExpRoutes.splice(index, 1)
    }
    this.setState({ proxyCfg: dummy, updateDisabled: false})
  }

  addRoute(e, d) {
    let dummy = Object.assign({}, this.state.proxyCfg)
    if (d.name.indexOf('router') > -1) {
        if (dummy.router[dummy.router.length-1].path && dummy.router[dummy.router.length-1].target) {
            dummy.router.push({path:'',target:''})
        }
    } else if (d.name.indexOf('regExpRoutes') > -1) {
        if (dummy.regExpRoutes[dummy.regExpRoutes.length-1].regExp && dummy.regExpRoutes[dummy.regExpRoutes.length-1].target) {
            dummy.regExpRoutes.push({regExp:'',target:''})
        }
    }
    this.setState({ proxyCfg: dummy })
  }

  render() {
      if (!this.state.proxyCfg) {
          return <div/>
      }
    return (
        <div>
            <Input label='context:' value={this.state.proxyCfg.context} name='context' onChange={this.handleChange} /><br/>
            <Input label='target:' value={this.state.proxyCfg.target} name='target' onChange={this.handleChange} /><br/>
            <Checkbox label='changeOrigin' toggle
                checked={this.state.proxyCfg.changeOrigin} name='changeOrigin' onChange={this.handleChange} /><br/>
            <Checkbox label='fiddleAspRoute' toggle
                checked={this.state.proxyCfg.fiddleAspRoute} name='fiddleAspRoute' onChange={this.handleChange} /><br/>
            <Input label='xmlHttRequestTarget:' value={this.state.proxyCfg.xmlHttRequestTarget} name='xmlHttRequestTarget' onChange={this.handleChange} /><br/>
            <Header as='h3'>router</Header>
            {
                this.state.proxyCfg.router.map((route, index)=>{
                    return (<div key={index}>
                        <Input label='path:' value={route.path} name='router.path' data-index={index} onChange={this.handleChange} />
                        <Input label='target:' value={route.target} name='router.target' data-index={index} onChange={this.handleChange} />
                        <Button name='router' onClick={this.removeRoute} data-index={index} style={{backgroundColor:'red'}}>Remove</Button>
                        </div>)
                })
            }
            <Button name='router' onClick={ this.addRoute } style={{backgroundColor:'green'}}>Add</Button>

            <Header as='h3'>regExpRouter</Header>
            {
                this.state.proxyCfg.regExpRoutes.map((route, index)=>{
                    return (<div key={index}>
                        <Input label='regExp:' value={route.regExp} name='regExpRoutes.regExp' data-index={index} onChange={this.handleChange} />
                        <Input label='target:' value={route.target} name='regExpRoutes.target' data-index={index} onChange={this.handleChange} />
                        <Button name='regExpRoutes' onClick={this.removeRoute} data-index={index} style={{backgroundColor:'red'}}>Remove</Button>
                        </div>)
                })
            }
            <Button name='regExpRoutes' onClick={ this.addRoute } style={{backgroundColor:'green'}}>Add</Button>

            <div className="container-btn">
                    <div className="pane-btn">
                        <Button className="btn-submit" size='massive' disabled={this.state.updateDisabled} onClick={this.clickUpdateBtn}>应用</Button>
                        <br/>
                    </div>
                </div>
        </div>
    )
    }
  }

  export default ControlPanel
