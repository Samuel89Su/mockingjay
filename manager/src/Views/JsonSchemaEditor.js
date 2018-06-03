import React, { Component } from 'react'
import AtomEditor from '../Components/AtomEditor'

const atom = {
    key: null,
    // Array<String>
    type: 'string',
    // String
    description: null,
    // Array<Object{key, value}>, value is another atom
    properties: [],
    // Object, another atom
    items: {},
    // Array<String>
    required: []
  }

export default class JsonSchemaEditor extends Component {
    constructor(props) {
        super(props)

        this.state = Object.assign({}, atom)

        this.onChildrenValueChanged = this.onChildrenValueChanged.bind(this)
    }

    onChildrenValueChanged(childState, name, index) {
        if (!name && !index) {
            this.setState(childState)
            return
        }

        let newState = this.state
        if (!index) {
            newState[name] = childState
        } else {
            newState[name][index] = childState
        }
        this.setState(newState)
    }

    render() {
        return (<AtomEditor root value={this.state}/>)
    }
}