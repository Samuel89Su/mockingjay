import React, { Component } from 'react'
import { fetchRemote } from '../middlewares/remoteFetch'
import InventoryAPI from '../middlewares/InventoryAPI'
import { Header, Label, Form, Input, TextArea, Checkbox, Dropdown } from 'semantic-ui-react'
import beautify from 'js-beautify/js'

class ControlPanel extends Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.handleChange = this.handleChange.bind(this)
    this.onTextAreaBlur = this.onTextAreaBlur.bind(this)
  }

  componentWillMount() {
    fetchRemote(InventoryAPI.fetchProxyCfg)
      .then(
        (config) => {
          let rawString = JSON.stringify(config)
          let prettyString = beautify(rawString, { indent_size: 2, space_in_empty_paren: true })
          this.setState({
              proxyCfg: config,
              rawConfig: prettyString
          })
          console.log(config)
        },
        (err) => {
          alert(err)
        })
  }

  handleChange(e, d) {
      this.setState({ rawConfig: d.value })
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
      this.setState({ rawConfig: formattedRaw })
  }

  render() {
    return (
        <TextArea rows='13' autoHeight
          value={this.state.rawConfig||''}
          onChange={this.handleChange}
          onBlur={this.onTextAreaBlur}
          style={{width: '100%'}} />
    )
    }
  }

  export default ControlPanel
