import React, { Component } from 'react'
import { Dropdown, Label, Input, Button, Divider } from 'semantic-ui-react'
import PropTypes from 'prop-types'

/**
 * 可选数据类型
 */
const TYPES = [
    { key: 'Number', text: 'Number', value: 'number' },
    { key: 'String', text: 'String', value: 'string' },
    { key: 'Array', text: 'Array', value: 'array' },
    { key: 'Object', text: 'Object', value: 'object' }
  ]

/**
 * 树节点
 */
const atom = {
    // String
    key: '',
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

// 树形结构数据编辑器
export default class AtomEditor extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            ...(props.value)
        }

        this.name = this.props.name

        this.onTypeChange = this.onTypeChange.bind(this)
        this.onChangeDesc = this.onChangeDesc.bind(this)
        this.onRequiredChange = this.onRequiredChange.bind(this)
        this.addProperty = this.addProperty.bind(this)
        this.delProperty = this.delProperty.bind(this)
        this.onChildrenValueChanged = this.onChildrenValueChanged.bind(this)
        this.onPropertyKeyChange = this.onPropertyKeyChange.bind(this)
        this.onValueChange = this.onValueChange.bind(this)
    }

    onValueChange(newState) {
        if (this.props.root) {
            this.setState(newState)
        }
        else if (this.props.onChangeCallBack && typeof this.props.onChangeCallBack === 'function' ) {
            this.props.onChangeCallBack(newState, this.props.name, this.props.index)
        }
    }

    /**
     * 子节点数据类型更新后回调
     * 更新 required 下拉数据原
     * @param {*} key 
     * @param {*} childState 
     */
    onChildrenValueChanged(childState, name, index) {
        let newState = this.state

        if (this.props.root) {
            if (index == undefined || isNaN(index)) {
                newState[name] = childState
                this.setState(newState)
            } else if (name) {
                newState[name][index] = childState
                this.setState(newState)
            }
        } else {
            if (!childState && newState[name] && newState[name] instanceof Array && newState[name].length > index) {
                newState[name].splice(index, 1)
            }

            if (this.props.onChangeCallBack && typeof this.props.onChangeCallBack === 'function' ) {
                this.props.onChangeCallBack(newState, this.props.name, this.props.index)
            }
        }
    }

    /**
     * 修改数据类型
     * @param {*} evt 
     * @param {*} data 
     */
    onTypeChange(evt, data) {
        // validate
        let type = data.value
        // 不允许同时选择 array object
        // if ((type[type.length -1] === 'object' && type.indexOf('array') > -1)
        //     || (type[type.length -1] === 'array' && type.indexOf('object') > -1)) {
        //     let obselete = type[type.length -1] === 'object' ? 'array' : 'object'
        //     let index = type.indexOf(obselete)
        //     type.splice(index, 1)
        // }

        let newState = this.state
        newState.type = type
        // this.setState(newState)

        this.onValueChange(newState)
    }

    /**
     * 修改描述
     * @param {*} evt 
     * @param {*} data 
     */
    onChangeDesc(evt, data) {
        let newState = this.state
        newState.description = data.value
        // this.setState(newState)

        this.onValueChange(newState)
    }

    /**
     * 修改 required
     * @param {*} evt 
     * @param {*} data 
     */
    onRequiredChange(evt, data) {
        let newState = this.state
        newState.required = data.value
        // this.setState(newState)

        this.onValueChange(data.value)
    }

    /**
     * 添加 property
     * @param {*} evt 
     * @param {*} data 
     */
    addProperty() {
        let properties = this.state.properties
        let newProp = Object.assign({}, atom)
        if (!properties || properties.length === 0) {
            properties.push(newProp)
        } else {
            let lastProperty = properties[properties.length -1]
            if (lastProperty.key && lastProperty.value.type) {
                properties.push(newProp)
            }
        }

        let newState = this.state
        newState.properties = properties
        // this.setState(newState)

        this.onValueChange(newState)
    }

    delProperty() {
        let newState = null

        this.onValueChange(newState)
    }

    /**
     * 更新 property key
     * 触发子节点渲染
     * @param {*} evt 
     * @param {*} data 
     */
    onPropertyKeyChange(evt, data) {
        let newState = this.state
        newState.key = data.value
        // this.setState(newState)

        this.onValueChange(newState)
    }

    render() {
        let requiredOpts = []
        if (this.state.properties && this.state.properties.length > 0) {
            this.state.properties.forEach(property => {
                requiredOpts.push({key:property.key, text:property.key, value:property.key})
            })
        }

        let disabledType = this.props.name === 'items' ? this.props.disabled : !(!this.props.disabled && this.props.value.key !== '')
        let disabledDesc = !(!disabledType && this.state.type)
        let disabledRequired = !(!this.props.disabled && this.state.properties && this.state.properties.length > 0)

        return(
            <div>
                {
                    this.props.value.key != null && this.props.name !== 'items'
                    ? (<div><Input value={this.state.key} disabled={this.props.disabled} onChange={this.onPropertyKeyChange} />
                        <Button color='red' disabled={this.props.disabled} onClick={this.delProperty}>DEL</Button></div>)
                    : null
                }
                
                <Label size='big'>type: </Label>
                {/* 数据类型 */}
                <Dropdown placeholder='types' selection inline
                    // multiple
                    disabled={disabledType}
                    value={this.state.type}
                    options={TYPES}
                    onChange={this.onTypeChange} />
                <br/>
                {/* 描述 */}
                <Input label='deacription' value={this.state.description||''} disabled={disabledDesc} onChange={this.onChangeDesc} />
                <br/>
                {
                    (!this.state.type) ? null :
                        (<Divider horizontal>
                            {
                                this.state.type.indexOf('object') > -1 ?
                                    'properties'
                                    : (this.state.type.indexOf('array') > -1 ?
                                        'items'
                                        : null)
                            }
                        </Divider>)
                }
                {
                    !this.state.type ? null :
                        this.state.type.indexOf('object') > -1 ?
                            (<ul>
                                {
                                    this.state.properties.length > 0 ?
                                    this.state.properties.map((property, index) => {
                                        return (
                                        <li key={index}>
                                            <AtomEditor name='properties' index={index} disabled={!!disabledDesc} value={property} onChangeCallBack={this.onChildrenValueChanged} ></AtomEditor>
                                        </li>)
                                    })
                                    : null
                                }
                                <li key='btn_add'>
                                    <Button onClick={this.addProperty} disabled={!(!disabledDesc && this.state.description)}>ADD</Button>
                                </li>
                            </ul>)
                                : (this.state.type.indexOf('array') > -1 ?
                                    (<ul><li key='items'><AtomEditor name='items' disabled={this.props.disabled} value={Object.assign({}, atom)} onChangeCallBack={this.onChildrenValueChanged}/></li></ul>)
                                        : null)
                }
                {/* required */}
                {
                    this.state.type !== 'object' ?
                    null :
                    (<div>
                        <Label>required: </Label>
                        <Dropdown placeholder='required' multiple selection inline
                            disabled={disabledRequired}
                            value={this.state.required}
                            options={requiredOpts}
                            onChange={this.onRequiredChange} />
                    </div>)
                }
                
                
            </div>)
    }
}


/**
 * PropTypes
 */
AtomEditor.PropTypes = {
    onChangeCallBack: PropTypes.func
}