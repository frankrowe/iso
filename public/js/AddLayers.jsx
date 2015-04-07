var React = require('react')
  , palette = require('./palette')
  , readFile = require('./lib/readfile')
  , hexagon = require('./hexagon.js')
  , defaultLayer = require('./lib/DefaultLayer')

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
          newLayer.id = Math.random().toString(36).slice(2)
          self.props.addLayer(newLayer)
        }
      })
    })
  },
  componentDidMount: function() {
    // console.log($(React.findDOMNode(this.refs.addLayer)).length)
    // $(React.findDOMNode(this.refs.addLayer)).css('color', 'red')
    // $(React.findDOMNode(this.refs.addLayer)).tooltip({
    //   placement: 'right',
    //   html: 'Add a new layer'
    // })
  },
  render: function() {
    var style = { display: 'none'}
    return (
      <div>
        <div className="add-layer-item add" ref="addLayer" onClick={this.onClick}>+</div>
        <input ref="addFile" type="file" name="addFile" style={style} onChange={this.onChange}/>
      </div>
    )
  }
})

var RemoveLayerButton = React.createClass({
  render: function() {
    return (
      <div className="add-layer-item" onClick={this.props.removeLayers}>
        -
      </div>
    )
  }
})

var AddLayers = React.createClass({
  render: function() {
    return (
      <div className="add-layers">
        <AddLayerButton addLayer={this.props.addLayer}/>
        <RemoveLayerButton removeLayers={this.props.removeLayers}/>
      </div>
    )
  }
})

module.exports = AddLayers