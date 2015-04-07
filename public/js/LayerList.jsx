var React = require('react')
  , palette = require('./palette')

var Layer = React.createClass({
  onClick: function(e) {
    if (e.target.tagName === 'DIV' || e.target.tagName === 'SPAN') {
      this.props.layer.selected = !this.props.layer.selected
      this.props.updateLayer(this.props.layer)
    }
  },
  onChange: function(e) {
    this.props.layer.enabled = !this.props.layer.enabled
    this.props.updateLayer(this.props.layer)
  },
  render: function() {
    var layerStyle = {
      color: this.props.layer.selected ? palette.green : 'white'
    }
    return (
      <div className="layer" style={layerStyle} onClick={this.onClick}>
      <input type="checkbox" ref="checkbox" checked={this.props.layer.enabled} onChange={this.onChange} />
      <span className="layer-name">{this.props.layer.name}</span>
      </div>
    )
  }
})

var LayerList = React.createClass({
  render: function() {
    var self = this
    var layerListStyle = {
      width: (this.props.layers.length > 0) ? 200 : 0
    }
    var layers = this.props.layers.map(function(layer, idx) {
      return (<Layer layer={layer} updateLayer={self.props.updateLayer} key={idx}/>)
    })
    return (
      <div className="layer-list" style={layerListStyle}>
      {layers}
      </div>
    )
  }
})

module.exports = LayerList