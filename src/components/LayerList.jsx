var React = require('react')
  , palette = require('../utils/palette')

var Layer = React.createClass({
  getInitialState: function() {
    return {
      dragEnter: false
    }
  },
  onClick: function(e) {
    if (e.target.tagName === 'DIV' || e.target.tagName === 'SPAN') {
      this.props.layer.selected = !this.props.layer.selected
      if (!this.props.layer.selected) {
        this.props.layer.editing = false
        this.props.layer.editGeoJSON = false
        this.props.layer.viewAttributes = false
      }
      this.props.updateLayer(this.props.layer)
    }
  },
  onChange: function(e) {
    this.props.layer.enabled = !this.props.layer.enabled
    this.props.layer.selected = false
    this.props.updateLayer(this.props.layer)
  },
  onDragStart: function(e) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text', this.props.idx.toString())
  },
  onDragEnter: function(e) {
    this.setState({dragEnter: true})
    e.preventDefault()
  },
  onDragOver: function(e) {
    e.preventDefault()
  },
  onDragLeave: function() {
    this.setState({dragEnter: false})
  },
  onDrop: function(e) {
    this.setState({dragEnter: false})
    this.props.swapLayers(+e.dataTransfer.getData('text'), this.props.idx)
  },
  onDragEnd: function() {

  },
  render: function() {
    var layerStyle = {
      color: this.props.layer.selected ? 'white': palette.light,
      textDecoration: this.props.layer.selected ? 'underline': 'none',
      backgroundColor: this.state.dragEnter ? 'red' : palette.dark
    }
    return (
      <div className="layer" style={layerStyle} draggable="true"
        onClick={this.onClick}
        onDragStart={this.onDragStart}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDragEnd={this.onDragEnd}
        onDrop={this.onDrop}
      >
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
      return (<Layer layer={layer} swapLayers={self.props.swapLayers} updateLayer={self.props.updateLayer} key={idx} idx={idx}/>)
    })
    return (
      <div className="layer-list" style={layerListStyle}>
      {layers}
      </div>
    )
  }
})

module.exports = LayerList