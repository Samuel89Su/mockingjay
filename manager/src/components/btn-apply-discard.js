import React, { Component } from 'react'
import '../styles/btn.scss'

class Btns extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<div className="container-btn">
                    <div className="pane-btn">
                        <button className="btn-submit" onClick={this.props.applyAction} >Apply</button>
                        <div>{
                            !this.props.hideDiscard
                            ? (<button className="btn-discard" onClick={this.props.discardAction}>Discard</button>)
                            : <span />
                        }
                        </div>
                    </div>
                </div>)
    }
}

export default Btns