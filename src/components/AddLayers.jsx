var React = require('react')
  , Tooltip = require('./Tooltip')
  , palette = require('../utils/palette')
  , readFile = require('../utils/readfile')
  , defaultLayer = require('../utils/DefaultLayer')
  , Modals = require('./Modals.jsx')

var LayerButton = React.createClass({
  getInitialState: function() {
    return {
      open: false
    }
  },
  onMouseEnter: function(e) {
    this.setState({open: true})
  },
  onMouseLeave: function(e) {
    this.setState({open: false})
  },
  render: function() {
    var tooltip
    if (this.state.open) {
      tooltip = <Tooltip text={this.props.tooltip} />
    }
    return (
        <div className="add-layer-item" ref="addLayer" onClick={this.props.onClick} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
          <img src={this.props.img} />
          {tooltip}
        </div>
    )
  }
})

var AddLayerButton = React.createClass({
  onClick: function(e) {
    var form = React.findDOMNode(this.refs.addFile)
    form.click()
  },
  onChange: function(e) {
    var self = this
    var form = React.findDOMNode(this.refs.addFile)
    var files = form.files
    if (!(files && files[0])) return;
    readFile.readAsText(files[0], function(err, text) {
      readFile.readFile(files[0], text, function(err, gj, warning) {
        if (gj && gj.features) {
          var newLayer = defaultLayer.generate()
          newLayer.geojson = gj
          newLayer.fileName = files[0].name
          newLayer.name = files[0].name.split('.')[0]
          newLayer.vector = true
          self.props.addLayer(newLayer)
        }
      })
    })
  },
  render: function() {
    var style = { display: 'none'}
    return (
      <div>
        <LayerButton img={"/img/MActionAddOgrLayer.png"} tooltip={'Import Vector Layer'} onClick={this.onClick}/>
        <input ref="addFile" type="file" name="addFile" style={style} onChange={this.onChange}/>
      </div>
    )
  }
})

var NewLayerButton = React.createClass({
  onClick: function(e) {
    var newLayer = defaultLayer.generate()
    newLayer.vector = true
    this.props.addLayer(newLayer)
  },
  render: function() {
    return (
      <LayerButton img={"/img/MActionNewVectorLayer.png"} tooltip={'New Vector Layer'} onClick={this.onClick}/>
    )
  }
})

var AddTileLayerButton = React.createClass({
  onClick: function(e) {
    var self = this
    vex.dialog.open({
      message: 'Enter tile layer URL',
      afterOpen: function($vexContent) {
        React.render(<Modals.TileLayer />, $vexContent.find('.vex-dialog-input').get(0))
      },
      callback: function(data) {
        console.log(data)
        if (data === false) {
          return console.log('Cancelled');
        }
        var newLayer = defaultLayer.generate()
        newLayer.tile = true
        newLayer.tileURL = data.url
        self.props.addLayer(newLayer)
      }
    })
  },
  render: function() {
    return (
      <LayerButton img={"/img/MActionAddRasterLayer.png"} tooltip={'New Tile Layer'} onClick={this.onClick}/>
    )
  }
})

var RemoveLayerButton = React.createClass({
  render: function() {
    return (
      <LayerButton img={"/img/MActionRemoveLayer.png"} tooltip={'Remove Layer'} onClick={this.props.removeLayers}/>
    )
  }
})

var AddLayers = React.createClass({
  render: function() {
    return (
      <div className="add-layers">
        <NewLayerButton addLayer={this.props.addLayer}/>
        <AddLayerButton addLayer={this.props.addLayer}/>
        <AddTileLayerButton addLayer={this.props.addLayer}/>
        <RemoveLayerButton removeLayers={this.props.removeLayers}/>
      </div>
    )
  }
})

module.exports = AddLayers