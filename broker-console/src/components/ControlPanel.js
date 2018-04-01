import React, { Component } from 'react'
import { fetchRemote } from '../middlewares/remoteFetch'
import InventoryAPI from '../middlewares/InventoryAPI'
import { Header, Button, Input, Checkbox, Dropdown, Label } from 'semantic-ui-react'
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
      if (d.type === 'checkbox') {
          d.value = d.checked
      }
      let dummy = Object.assign({}, this.state.proxyCfg)
      if (d.name === 'context') {
          let value = e.target.value
          let index = d['data-index']
          if (value.endsWith(',')) {
            dummy.context.push('')
          } else if (!value) {
            dummy.context.splice(index, 1)
          } else {
            dummy.context[index] = value
          }
      } else if (d.name.indexOf('oute') === -1 || d.name.startsWith('f')) {
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
            <Header as='h3'>General</Header>
            <Input labelPosition='right' name='context'>
                <Label>context: </Label>
                <Label basic size='mini'>[</Label>
                {
                    this.state.proxyCfg.context.map((ctx, index)=>{
                        if (index < this.state.proxyCfg.context.length - 1) {
                            return (<div className='div-inline'>
                                        <Input className='ipt-inline' key={index} data-index={index} value={ctx} onChange={(e)=>this.handleChange(e, {'name':'context','data-index':index})}/>
                                        <Label basic size='mini'>,</Label>
                                    </div>)
                        } else {
                            return (<Input key={index} data-index={index} value={ctx} onChange={(e)=>this.handleChange(e, {'name':'context','data-index':index})} />)
                        }
                    })
                }
                <Label basic size='mini'>]</Label>
            </Input><br/>
            <Input label='target:' value={this.state.proxyCfg.target} name='target' onChange={this.handleChange} className='input-row' /><br/>
            <Checkbox label='fiddleAspRoute' toggle className='ck-row'
                checked={this.state.proxyCfg.fiddleAspRoute} name='fiddleAspRoute' onChange={this.handleChange} /><br/>
            <Input label='xmlHttRequestTarget:' value={this.state.proxyCfg.xmlHttRequestTarget} name='xmlHttRequestTarget' onChange={this.handleChange} className='input-row' /><br/>
            <Header as='h3'>Router</Header>
            {
                this.state.proxyCfg.router.map((route, index)=>{
                    return (<div key={index}>
                        <Input label='path:' value={route.path} name='router.path' data-index={index} onChange={this.handleChange} className='input-row-half' />
                        <Input label='target:' value={route.target} name='router.target' data-index={index} onChange={this.handleChange} className='input-row-half' />
                        <Button name='router' onClick={this.removeRoute} data-index={index} style={{backgroundColor:'red'}}>Remove</Button>
                        </div>)
                })
            }
            <Button name='router' onClick={ this.addRoute } style={{backgroundColor:'green'}}>Add</Button>

            <Header as='h3'>RegExpRouter</Header>
            {
                this.state.proxyCfg.regExpRoutes.map((route, index)=>{
                    return (<div key={index}>
                        <Input label='regExp:' value={route.regExp} name='regExpRoutes.regExp' data-index={index} onChange={this.handleChange} className='input-row-half' />
                        <Input label='target:' value={route.target} name='regExpRoutes.target' data-index={index} onChange={this.handleChange} className='input-row-half' />
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
