import React from 'react'

class LangDirButton extends React.Component {
  render () {
    return (
      <div style={styles}>{this.props.text}</div>
    )
  }
}

LangDirButton.propTypes = {
  text: React.PropTypes.string
}

LangDirButton.defaultProps = {
  text: 'RANDOM'
}

const styles = {
  textAlign: 'center',
  fontFamily: 'monospace',
  fontSize: '24px',
  backgroundColor: 'green',
  width: '90%',
  height: '6vh',
  padding: '3%',
  borderRadius: '20%',
  float: 'left',
  display: 'inline'
}

export default LangDirButton
