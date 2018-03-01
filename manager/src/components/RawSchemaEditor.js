'use strict'

import React, { Component } from 'react'
import { object2Array, array2Object } from '../utils'
import { Header, Button, TextArea, Form, Modal } from 'semantic-ui-react'

class RawSchemaEditor extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.submit = this.submit.bind(this)
        this.modalOpen = this.modalOpen.bind(this)

        this.state = { open: false }
    }

    componentWillMount() {
        let schema = array2Object(this.props.schema)
        this.setState({ raw: JSON.stringify(schema) })
    }

    componentWillReceiveProps(newProps) {
        let schema = array2Object(newProps.schema)
        this.setState({ raw: JSON.stringify(schema) })
    }
    
    modalOpen(open) {
        this.setState({ open: open })
    }

    handleChange(e, d) {
        this.setState({ raw: d.value })
    }

    submit(e) {
        let val = JSON.parse(this.state.raw)
        val = object2Array(val)
        let data = { name: this.props.name, value: val }
        this.props.handleChange(e, data)

        this.setState({ open: false, raw: '' })
    }

    render() {
        return (
            <Modal size='small' open={this.state.open}
                trigger={<Button size='mini' onClick={() => this.modalOpen(true)}>Raw</Button>}
                onClose={() => this.modalOpen(false)}>
                <Header content='Schema'/>
                <Modal.Content>
                    <Form>
                        <TextArea rows='13' value={this.state.raw} onChange={this.handleChange} />
                        <input type='hidden' />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button basic color='red' onClick={() => this.modalOpen(false)}>Cancel</Button>
                    <Button basic color='blue' onClick={this.submit} >OK</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default RawSchemaEditor