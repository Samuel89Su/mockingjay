import React from 'react'
import Link from 'next/link'

export default () => (
    <div>
        <h1>You are in next, serve by koa2</h1>
        <ul>
            <li><Link href='b' as='a'><a>a</a></Link></li>
            <li><Link href='a' as='b'><a>b</a></Link></li>
        </ul>
    </div>
  
)