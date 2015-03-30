var React = require('react')

var Layer = React.createClass({
  render: function() {
    return (
      <div className="layer">{this.props.layer.name}</div>
    )
  }
})

var LayerList = React.createClass({
  render: function() {
    var layers = this.props.layers.map(function(layer, idx) {
      return (<Layer layer={layer} key={idx}/>)
    })
    return (
      <div className="layer-list">
      {layers}
      </div>
    )
  }
})

module.exports = LayerList