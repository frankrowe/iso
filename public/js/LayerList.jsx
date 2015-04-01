var React = require('react')
  , palette = require('./palette')

var layerStyle = {
  padding: 10,
  borderBottom: '1px solid ' + palette.lightest
}

var Layer = React.createClass({
  onClick: function(e) {
    if (e.target.tagName === 'DIV' || e.target.tagName === 'SPAN') {
      this.props.layer.selected = !this.props.layer.selected
      this.props.onSelect(this.props.layer)
    }
  },
  onChange: function(e) {
    this.props.layer.enabled = !this.props.layer.enabled
    this.props.onEnable(this.props.layer)
  },
  render: function() {
    layerStyle.backgroundColor = this.props.layer.selected ? palette.lightest : palette.dark
    return (
      <div className="layer ugis-btn" style={layerStyle} onClick={this.onClick}>
      <input type="checkbox" ref="checkbox" checked={this.props.layer.enabled} onChange={this.onChange} />
      <span className="layer-name">{this.props.layer.name}</span>
      </div>
    )
  }
})

var layerListStyle = {
  borderColor: palette.lightest
}

var LayerList = React.createClass({
  render: function() {
    var self = this
    var layers = this.props.layers.map(function(layer, idx) {
      return (<Layer layer={layer} onSelect={self.props.onSelect} onEnable={self.props.onEnable} key={idx}/>)
    })
    return (
      <div className="layer-list" style={layerListStyle}>
      {layers}
      </div>
    )
  }
})

module.exports = LayerList