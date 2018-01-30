import React, { Component } from 'react'

class PageHeader extends Component {
    render() {
        return (
            <div className='page-header'>
                <h1>Api Inventory</h1>
            </div>
        );
    }
}

const Layout = (props) => (
    <div>
        <PageHeader />
        {props.children}
    </div>
  )
  
  export default Layout