import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import '../styles/btn.scss'

class Btns extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<div className="container-btn">
                    <div className="pane-btn">
                        <Button className="btn-submit" size='massive' disabled={this.props.applyDisabled} onClick={this.props.applyAction} >Update</Button>
                        <br/>
                    </div>
                </div>)
    }
}

export default Btns