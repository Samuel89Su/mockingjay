'use strict'

import React, { Component } from 'react'
import { Button, Icon } from 'semantic-ui-react'
import '../styles/btn.scss'

class Btns extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<div className="container-btn">
                    <div className="pane-btn">
                        <Button className="btn-submit" size='massive'
                            disabled={this.props.applyDisabled}
                            onClick={this.props.applyAction} >
                            <Icon name = 'save' />Save
                        </Button>

                        {
                            this.props.showShare ?
                                (<Button className="btn-submit" size='massive'
                                    onClick={this.props.shareAction} >
                                    <Icon name = 'slideshare' />Share
                                </Button>)
                                : null
                        }
                        <br/>
                    </div>
                </div>)
    }
}

export default Btns