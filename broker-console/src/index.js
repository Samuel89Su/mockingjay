'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import ControlPanel from './components/ControlPanel'
import Layout from './components/Layout'
import '../semantic/dist/semantic.min.css'

var wsPort = parseInt(location.port || 80) + 1;
var ws = new WebSocket(`ws://${location.hostname}:${wsPort}`);

ws.onopen = function () {
  ws.send('connected')
}

ws.onmessage = function (ev) {
  var data = JSON.parse(ev.data);
  if (data && typeof data === 'object' && !(data instanceof Array) && data.hasOwnProperty('status') && data['status'] !== 200) {
    console.error(data);
  }
  console.log(data);
}

ReactDOM.render(
    (<Layout>
        <ControlPanel />
    </Layout>),
      document.getElementById('root')
    )
