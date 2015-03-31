var React = require('react')
  , palette = require('./palette')

var itemStyle = {
  width: '30px',
  height: '30px',
  border: '1px solid #ddd',
  margin: '8px 0 0 9px',
  textAlign: 'center',
  lineHeight: '30px',
  float: 'left',
  backgroundColor: palette.dark,
  borderColor: palette.lightest
}

var ToolbarItem = React.createClass({
  render: function() {
    return (
      <div className="toolbar-item" style={itemStyle} onClick={this.props.onClick}>
        {this.props.text}
      </div>
    )
  }
})

var Simplify = React.createClass({
  render: function() {
    return (
      <ToolbarItem text={'S'} onClick={this.props.onClick}/>
    )
  }
})

var Buffer = React.createClass({
  render: function() {
    return (
      <ToolbarItem text={'B'} onClick={this.props.onClick}/>
    )
  }
})

var toolBarStyle = {
  borderColor: palette.lightest
}

var Toolbar = React.createClass({
  render: function() {
    return (
      <div className="toolbar" style={toolBarStyle}>
        <Simplify onClick={this.props.simplify}/>
        <Buffer onClick={this.props.buffer}/>
      </div>
    )
  }
})

module.exports = Toolbar