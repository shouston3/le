import React, { Component } from 'react'
import { Link } from 'react-router'
require('../../public/style.css')

export default class Settings extends Component {
  render () {
    return (
      <div>
        <h1 style={{textAlign: 'center'}}>Settings</h1>
        <Link to='/' style={styles}><h3>Home</h3></Link>
      </div>
    )
  }
}

const styles = {
  textDecoration: 'none',
  color: 'black',
  textAlign: 'center'
}
