'use strict'

import React, { Component } from 'react'
import { object2Array, array2Object } from '../utils'
import { Header, Button, TextArea, Form, Modal, Label } from 'semantic-ui-react'
import beautify from 'js-beautify/js'

class RawSchemaEditor extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.submit = this.submit.bind(this)
        this.modalOpen = this.modalOpen.bind(this)
        this.onTextAreaBlur = this.onTextAreaBlur.bind(this)
        this.quickInsert = this.quickInsert.bind(this)
        this.buildQuickLabels = this.buildQuickLabels.bind(this)

        this.state = { open: false }
    }

    componentWillMount() {
        let schema = array2Object(this.props.schema)
        let formattedRaw = beautify(JSON.stringify(schema), { indent_size: 2, space_in_empty_paren: true })
        this.setState({ raw: formattedRaw })
    }

    componentWillReceiveProps(newProps) {
        let schema = array2Object(newProps.schema)
        let formattedRaw = beautify(JSON.stringify(schema), { indent_size: 2, space_in_empty_paren: true })
        this.setState({ raw: formattedRaw })
    }
    
    modalOpen(open) {
        if (!open) {
            let schema = array2Object(this.props.schema)
            let formattedRaw = beautify(JSON.stringify(schema), { indent_size: 2, space_in_empty_paren: true })
            this.setState({ raw: formattedRaw })
        }
        this.setState({ open: open })
    }

    handleChange(e, d) {
        this.setState({ raw: d.value })
    }

    onTextAreaBlur(e) {
        let pos = 0
        if (document.selection) {
            let selectRange = document.selection.createRange()
            selectRange.moveStart('character', -e.target.value.length)
            pos = selectRange.text.length
        } else if (e.target.selectionStart || e.target.selectionStart == '0') {
            pos = e.target.selectionStart
        }
        this.setState({ offset: pos, shadowRaw: e.target.value, expired: new Date().getTime() + 200 })

        let formattedRaw = beautify(e.target.value, { indent_size: 2, space_in_empty_paren: true })
        this.setState({ raw: formattedRaw })
    }

    quickInsert(e, d) {
        if (this.state.expired && new Date().getTime() < this.state.expired) {
            let pre = this.state.shadowRaw.substr(0, this.state.offset)
            let post = this.state.shadowRaw.substr(this.state.offset)
            let newRaw = pre + d.value + post
            let formattedRaw = beautify(newRaw, { indent_size: 2, space_in_empty_paren: true })
            this.setState({ raw: formattedRaw, expired: null, shadowRaw: null })
        }
    }

    submit(e) {
        let val = JSON.parse(this.state.raw)
        val = object2Array(val)
        let data = { name: this.props.name, value: val }
        this.props.handleChange(e, data)

        this.setState({ open: false, raw: '' })
    }

    buildQuickLabels() {
        const stringSet = this.props.shorts ? this.props.shorts : []
        return (<div>
            {
                stringSet.map((short, index)  => {
                    return <Label key={index} size='mini' value={short.value} onClick={this.quickInsert} >{short.key}</Label>
                })
            }
        </div>)
    }

    render() {
        return (
            <Modal size='small' open={this.state.open}
                trigger={<Button size='mini' onClick={() => this.modalOpen(true)}>Raw</Button>}
                onClose={() => this.modalOpen(false)}>
                <Header content='Schema'/>
                <Modal.Content>
                    {
                        this.buildQuickLabels()
                    }
                    
                    <Form>
                        <TextArea rows='13' value={this.state.raw} onChange={this.handleChange} onBlur={this.onTextAreaBlur} autoHeight />
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