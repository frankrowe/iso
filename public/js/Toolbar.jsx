var React = require('react')
  , palette = require('./palette')

var itemStyle = {
  height: '30px',
  border: '1px solid #ddd',
  margin: '8px 0 0 9px',
  padding: '0 5px',
  textAlign: 'center',
  lineHeight: '30px',
  float: 'left',
  backgroundColor: palette.dark,
  borderColor: palette.lightest
}

var ToolbarItem = React.createClass({
  render: function() {
    return (
      <div className="toolbar-item ugis-btn" style={itemStyle} onClick={this.props.onClick}>
        {this.props.text}
      </div>
    )
  }
})

var SelectAll = React.createClass({
  render: function() {
    return (
      <ToolbarItem text={'Select All'} onClick={this.props.onClick}/>
    )
  }
})

var DeselectAll = React.createClass({
  render: function() {
    return (
      <ToolbarItem text={'Deselect All'} onClick={this.props.onClick}/>
    )
  }
})

var Delete = React.createClass({
  render: function() {
    return (
      <ToolbarItem text={'Delete'} onClick={this.props.onClick}/>
    )
  }
})

var SaveAs = React.createClass({
  render: function() {
    return (
      <ToolbarItem text={'Save'} onClick={this.props.onClick}/>
    )
  }
})

var Simplify = React.createClass({
  render: function() {
    return (
      <ToolbarItem text={'Simplify'} onClick={this.props.onClick}/>
    )
  }
})

var Buffer = React.createClass({
  render: function() {
    return (
      <ToolbarItem text={'Buffer'} onClick={this.props.onClick}/>
    )
  }
})

var Flip = React.createClass({
  render: function() {
    return (
      <ToolbarItem text={'Flip'} onClick={this.props.onClick}/>
    )
  }
})

var Kinks = React.createClass({
  render: function() {
    return (
      <ToolbarItem text={'Kinks'} onClick={this.props.onClick}/>
    )
  }
})

var Explode = React.createClass({
  render: function() {
    return (
      <ToolbarItem text={'Explode'} onClick={this.props.onClick}/>
    )
  }
})

var HexGrid = React.createClass({
  render: function() {
    return (
      <ToolbarItem text={'Hex Grid'} onClick={this.props.onClick}/>
    )
  }
})

var Quantile = React.createClass({
  render: function() {
    return (
      <ToolbarItem text={'Quantile'} onClick={this.props.onClick}/>
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
        <SelectAll onClick={this.props.selectAll}/>
        <DeselectAll onClick={this.props.deselectAll}/>
        <SaveAs onClick={this.props.saveAs}/>
        <Delete onClick={this.props.deleteFeature}/>
        <Simplify onClick={this.props.simplify}/>
        <Buffer onClick={this.props.buffer}/>
        <Flip onClick={this.props.flip}/>
        <Explode onClick={this.props.explode}/>
        <HexGrid onClick={this.props.hexgrid}/>
        {/*<Quantile onClick={this.props.quantile}/>*/}
      </div>
    )
  }
})

module.exports = Toolbar