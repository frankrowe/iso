var React = require('react')
  , palette = require('../utils/palette')
  , LayerActions = require('../actions/LayerActions')

var Layer = React.createClass({
  getInitialState: function() {
    return {
      dragEnter: false
    }
  },
  onClick: function(e) {
    if (e.target.tagName === 'DIV' || e.target.tagName === 'SPAN') {
      var update = {}
      update.selected = !this.props.layer.selected
      if (!update.selected) {
        update.editing = false
        update.editGeoJSON = false
        update.viewAttributes = false
      }
      LayerActions.update(this.props.layer.id, update)
    }
  },
  onChange: function(e) {
    var update = {}
    update.enabled = !this.props.layer.enabled
    if (!update.enabled) update.selected = false
    LayerActions.update(this.props.layer.id, update)
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
    LayerActions.reorder(+e.dataTransfer.getData('text'), this.props.idx)
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
      width: (Object.keys(this.props.layers).length > 0) ? 200 : 0
    }
    var _layers = []
    var layers = _.values(this.props.layers)
    layers = _.sortBy(layers, 'order')
    layers.forEach(function(layer, idx) {
      _layers.push(<Layer layer={layer} key={layer.id} idx={idx} />)
    })
    return (
      <div className="layer-list" style={layerListStyle}>
      {_layers}
      </div>
    )
  }
})

module.exports = LayerList