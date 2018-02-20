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
                        <Button className="btn-submit" size='massive' onClick={this.props.applyAction} >Apply</Button>
                        <br/>
                        <div>{
                            !this.props.hideDiscard
                            ? (<Button className="btn-discard"size='massive' onClick={this.props.discardAction}>Discard</Button>)
                            : <span />
                        }
                        </div>
                    </div>
                </div>)
    }
}

export default Btns