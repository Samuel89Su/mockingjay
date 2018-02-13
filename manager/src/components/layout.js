import React, { Component } from 'react'
import '../styles/layout.scss'

class Layout extends Component {
    render() {
        return (
            <div>
                <div className='layout-header'>
                    <h1>Mockingjay</h1>
                </div>
                <div>
                    { this.props.children }
                </div>
            </div>
        )
    }
}

export default Layout