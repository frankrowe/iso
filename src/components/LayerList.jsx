var React = require('react')
  , Color = require("color")
  , palette = require('../utils/palette')
  , LayerActions = require('../actions/LayerActions')
  , vectorTools = require('../utils/vectorTools')
  , Modals = require('./Modals.jsx')

var Layer = React.createClass({
  getInitialState: function() {
    return {
      dragEnter: false
    }
  },
  onClick: function(e) {
    console.log(e.target.className);
    if (e.target.className === 'selector') {
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
  colorClick: function(e) {
    var self = this
    Modals.getStyle(this.props.layer.style, function(err, style) {
      var newStyle = vectorTools.updateStyle(self.props.layer, style)
      LayerActions.update(self.props.layer.id, {style: newStyle})
    })
  },
  onChange: function(e) {
    var update = {}
    update.enabled = !this.props.layer.enabled
    //if (!update.enabled) update.selected = false
    LayerActions.update(this.props.layer.id, update)
  },
  onDragStart: function(e) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text', this.props.layer.order.toString())
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
    LayerActions.reorder(+e.dataTransfer.getData('text'), this.props.layer.order)
  },
  onDragEnd: function() {

  },
  render: function() {
    var layerStyle = {
      color: this.props.layer.selected ? 'white': palette.light,
      textDecoration: this.props.layer.selected ? 'underline': 'none'
    }
    var backgroundColor = palette.dark
    if (this.state.dragEnter) {
      backgroundColor = 'red'
    }
    if (this.props.layer.selected) {
      //backgroundColor = '#e5e5e5'
    }
    layerStyle.backgroundColor = backgroundColor

    var swatchBackgroundColor = Color(this.props.layer.style.fillColor).rgb()
    swatchBackgroundColor.a = this.props.layer.style.fillOpacity
    swatchBackgroundColor = Color(swatchBackgroundColor).rgbString()

    var borderColor = Color(this.props.layer.style.color).rgb()
    borderColor.a = this.props.layer.style.opacity
    borderColor = Color(borderColor).rgbString()

    var swatchStyle = {
      backgroundColor: swatchBackgroundColor,
      borderColor: borderColor,
      borderWidth: this.props.layer.style.weight
    }

    if (this.props.layer.vector) {
      var swatch = <div className="swatch-wrap"><div className="color-swatch" style={swatchStyle} onClick={this.colorClick}></div></div>
    } else {
      var swatch = false
    }
    var selector = <img className="selector" onClick={this.onClick}
      src={this.props.layer.selected ? "img/selected.png" : "img/unselected.png"}/>
    return (
      <div className="layer" style={layerStyle} draggable="true"
        onDragStart={this.onDragStart}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDragEnd={this.onDragEnd}
        onDrop={this.onDrop}>
        <input type="checkbox" ref="checkbox" checked={this.props.layer.enabled} onChange={this.onChange} />
        <span className="layer-name">{this.props.layer.name}</span>
        {selector}
        {swatch}
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
      _layers.push(<Layer layer={layer} key={layer.id} idx={idx}/>)
    })
    return (
      <div className="layer-list" style={layerListStyle}>
      {_layers}
      </div>
    )
  }
})

module.exports = LayerList
