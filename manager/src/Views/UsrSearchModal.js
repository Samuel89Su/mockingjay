import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Button, Popup, Modal, List, Label, Search } from 'semantic-ui-react'
import UserList from '../Views/UserLst'
import InventoryAPI from '../middlewares/InventoryAPI'
import { fetchRemote } from '../middlewares/remoteFetch'

const userResultRenderer = (user) => {
    return <Label content={user.name} />
}

userResultRenderer.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string
}

class UsrSearchModal extends Component {
    constructor(props) {
        super(props)

        this.show = this.show.bind(this)
        this.close = this.close.bind(this)
        this.confirm = this.confirm.bind(this)

        this.state = { open: false, result: [], userName: '', userList: [] }
    }
    
    componentWillMount() {
        this.resetComponent()
      }
    
      resetComponent = () => this.setState({ isLoading: false, results: [], userName: '' })
    
      handleResultSelect = (e, { result }) => {
          for (let i = 0; i < this.state.userList.length; i++) {
              const user = this.state.userList[i];
              if (user.id === result.id) {
                  this.resetComponent()
                  return
              }
          }
          let dummyList = this.state.userList
          dummyList.push(result)
          this.setState({ userList: dummyList, isLoading: false, results: [], userName: '' })

      }
    
      handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, userName: value })
    
        setTimeout(() => {
          if (this.state.userName.length < 1) return this.resetComponent()
            let payload = JSON.stringify({userName: this.state.userName})
            let fetchOpts = Object.assign({}, InventoryAPI.searchUser)
            fetchRemote(fetchOpts, payload)
              .then(
                data => {
                    let dummyState = { isLoading: false }
                    if (data && data instanceof Array && data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            let user = data[i];
                            user.key = user.id
                        }
                        dummyState.results = data
                    }
                    this.setState(dummyState)
                },
                error => (error) => {})
        }, 300)
      }

    componentWillReceiveProps (nextProps) {
        const { open } = nextProps
        this.setState({ open })
    }

    show () {
        this.setState({ open: true })
    }
    close() {
        this.setState({ open: false })
    }
    confirm() {
        if (this.state.userList && this.state.userList instanceof Array && this.state.userList.length > 0) {
            let payload = JSON.stringify({ appId: this.props.appId, users: this.state.userList })
            let fetchOpts = Object.assign({}, InventoryAPI.grantUser)
            fetchRemote(fetchOpts, payload)
              .then(
                (data) => {
                    this.close()
                },
                (err) => {
                    this.close()
                })
        }
    }

    render () {
        const { open, isLoading, userName, results } = this.state
        return (<div>
            <Popup trigger={<Button onClick={this.show}>None</Button>}>
                <Popup.Header>Heads up!</Popup.Header>
                <Popup.Content>
                By default, a Modal closes when escape is pressed or when the dimmer is
                clicked. Setting the dimmer to "None" (dimmer={'{'}false{'}'}) means that there is no
                dimmer to click so clicking outside won't close the Modal. To close on
                outside click when there's no dimmer, you can pass the "closeOnDocumentClick" prop.
                </Popup.Content>
            </Popup>

            <Modal open={open} onClose={this.close}>
                <Modal.Header>
                    <Search
                            loading={isLoading}
                            onResultSelect={this.handleResultSelect}
                            onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                            results={results}
                            value={userName}
                            showNoResults={false}
                            {...this.props}
                            resultRenderer={userResultRenderer}
                        />
                    </Modal.Header>
                <Modal.Content>
                    <div>
                        <UserList users={this.state.userList}/>
                    </div>
                </Modal.Content>
                <Modal.Actions>
                <Button color='black' onClick={this.close}>
                    Cancel
                </Button>
                <Button positive icon='share alternate' labelPosition='right' content="Share" onClick={this.confirm} />
                </Modal.Actions>
            </Modal>
      </div>)
    }

}

export default UsrSearchModal