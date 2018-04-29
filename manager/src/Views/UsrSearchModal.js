import React, { Component } from 'react'
import _ from 'lodash'
import { Button, Popup,Modal, Grid, Header, Search } from 'semantic-ui-react'

class UsrSearchModal extends Component {
    constructor(props) {
        super(props)

        this.show = this.show.bind(this)
        this.close = this.close.bind(this)

        this.state = { open: false }
    }
    
    // componentWillMount() {
    //     this.resetComponent()
    //   }
    
    //   resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })
    
    //   handleResultSelect = (e, { result }) => this.setState({ value: result.title })
    
    //   handleSearchChange = (e, { value }) => {
    //     this.setState({ isLoading: true, value })
    
    //     setTimeout(() => {
    //       if (this.state.value.length < 1) return this.resetComponent()
    
    //       const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
    //       const isMatch = result => re.test(result.title)
    
    //       this.setState({
    //         isLoading: false,
    //         results: _.filter(source, isMatch)
    //       })
    //     }, 300)
    //   }

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

    render () {
        const { open, isLoading, value, results } = this.state
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
                <Modal.Header>Input a UserName</Modal.Header>
                <Modal.Content image>
                    {/* <Grid>
                        <Grid.Column width={8}>
                        <Search
                            loading={isLoading}
                            onResultSelect={this.handleResultSelect}
                            onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                            results={results}
                            value={value}
                            {...this.props}
                        />
                        </Grid.Column>
                        <Grid.Column width={8}>
                        <Header>State</Header>
                        <pre>{JSON.stringify(this.state, null, 2)}</pre>
                        <Header>Options</Header>
                        <pre>{JSON.stringify(source, null, 2)}</pre>
                        </Grid.Column>
                    </Grid> */}
                <Modal.Description>
                    <Header>Default Profile Image</Header>
                    <p>We've found the following gravatar image associated with your e-mail address.</p>
                    <p>Is it okay to use this photo?</p>
                </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                <Button color='black' onClick={this.close}>
                    Cancel
                </Button>
                <Button positive icon='share alternate' labelPosition='right' content="Share" onClick={this.close} />
                </Modal.Actions>
            </Modal>
      </div>)
    }

}

export default UsrSearchModal