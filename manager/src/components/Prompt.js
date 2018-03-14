'use strict'

import React, { Component } from 'react'
import { Modal, Button, Input } from 'semantic-ui-react'

class Prompt extends Component {
    constructor (props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.click = this.click.bind(this)
        this.open = this.open.bind(this)

        this.state = { text: '', modalOpen: false }
    }

    open () {
        this.setState({ modalOpen: true })
    }

    handleChange (e, data) {
        this.setState({ text: data.value })
    }

    click (e, data) {
        this.setState({ modalOpen: false, text: '' })
        this.props.onClose(data.name === 'true', this.state.text)
    }

    render () {
        return (
        <Modal trigger={<Button content={this.props.text} onClick={ this.open } />}
            size='mini'
            open={this.state.modalOpen}
            onClose={() => this.click({ name: 'false' })}>
            <Modal.Content>
                <Input label='Key:' value={ this.state.text } onChange={ this.handleChange } />
            </Modal.Content>
            <Modal.Actions>
                <Button name='false' color='red' onClick={this.click}>Cancel</Button>
                <Button name='true' color='green' onClick={this.click}>OK</Button>
            </Modal.Actions>
        </Modal>)
    }

}

export default Prompt
