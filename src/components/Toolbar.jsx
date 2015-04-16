var React = require('react')
  , palette = require('../utils/palette')
  , gjutils = require('../utils/gjutils')
  , Modals = require('./Modals.jsx')


var ToolbarItem = React.createClass({
  getDefaultProps: function() {
    return {
      active: false
    }
  },
  onClick: function() {
    if (this.props.active) {
      this.props.onClick()
    }
  },
  render: function() {
    var style = {}
    var className = 'toolbar-item'
    if (this.props.active) className += ' active'
    return (
      <div className={className} style={style} onClick={this.onClick}>
        <span className="label">{this.props.text}</span>
        <span className='icon'>{this.props.icon}</span>
      </div>
    )
  }
})

var ToolbarDropdown = React.createClass({
  getInitialState: function() {
    return {
      open: false
    }
  },
  onMouseEnter: function(e) {
    if (this.props.active) {
      this.setState({open: true})
    }
  },
  onMouseLeave: function(e) {
    if (this.props.active) {
      this.setState({open: false})
    }
  },
  subMenuClick: function(e) {
    this.setState({open: false})
  },
  render: function() {
    var className = 'toolbar-item',
      submenu = ''
    if (this.props.active) {
      className += ' active'
    }
    if (this.state.open) {
      className += ' open'
      submenu = this.props.submenu
    }
    return (
      <div className="toolbar-dropdown" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <div className={className}>
          {this.props.text} 
          <i className="fa fa-angle-down"></i>
        </div>
        <div className="submenu" onClick={this.subMenuClick}>{submenu}</div>
      </div>
    )
  }
})

var LayerMenu = React.createClass({
  render: function() {
    var active = this.props.config.oneLayer  || this.props.config.multiLayer
    var submenu = [
      <Undo onClick={this.props.vectorTools.undo.bind(this.props.vectorTools)} config={this.props.config}/>,
      <RenameLayer onClick={this.props.vectorTools.renameLayer.bind(this.props.vectorTools)} config={this.props.config}/>,
      <SaveAs onClick={this.props.vectorTools.saveAs.bind(this.props.vectorTools)} config={this.props.config}/>,
      <ZoomToLayer onClick={this.props.vectorTools.zoomToLayer.bind(this.props.vectorTools)} config={this.props.config}/>
      ]
    return (
      <ToolbarDropdown text={'Layer'} submenu={submenu} active={active}/>
    )
  }
})

var ViewMenu = React.createClass({
  render: function() {
    var active = this.props.config.oneLayer  || this.props.config.multiLayer
    if (this.props.config.oneLayer && this.props.config.oneLayer.viewAttributes) {
      var attributeTable = <CloseAttributes onClick={this.props.vectorTools.closeAttributes.bind(this.props.vectorTools)} config={this.props.config}/>
    } else {
      var attributeTable = <ViewAttributes onClick={this.props.vectorTools.viewAttributes.bind(this.props.vectorTools)} config={this.props.config}/>
    }
    var submenu = [
      attributeTable,
      <ViewGeoJSON onClick={this.props.vectorTools.viewGeoJSON.bind(this.props.vectorTools)} config={this.props.config}/>,
      <Edit onClick={this.props.vectorTools.editFeature.bind(this.props.vectorTools)} config={this.props.config}/>
      ]
    return (
      <ToolbarDropdown text={'View'} submenu={submenu} active={active}/>
    )
  }
})

var FeatureMenu = React.createClass({
  render: function() {
    var active = this.props.config.oneFeature || this.props.config.multiFeature
    var submenu = [
      <Area onClick={this.props.vectorTools.area.bind(this.props.vectorTools)} config={this.props.config}/>,
      <Distance onClick={this.props.vectorTools.distance.bind(this.props.vectorTools)} config={this.props.config}/>,
      <Bearing onClick={this.props.vectorTools.bearing.bind(this.props.vectorTools)} config={this.props.config}/>,
      <Length onClick={this.props.vectorTools.lineLength.bind(this.props.vectorTools)} config={this.props.config}/>,
      <Delete onClick={this.props.vectorTools.deleteFeature.bind(this.props.vectorTools)} config={this.props.config}/>,
      <Simplify onClick={this.props.vectorTools.simplify.bind(this.props.vectorTools)} config={this.props.config}/>,
      <Buffer onClick={this.props.vectorTools.buffer.bind(this.props.vectorTools)} config={this.props.config}/>,
      <Flip onClick={this.props.vectorTools.flip.bind(this.props.vectorTools)} config={this.props.config}/>,
      <Explode onClick={this.props.vectorTools.explode.bind(this.props.vectorTools)} config={this.props.config}/>,
      <Merge onClick={this.props.vectorTools.merge.bind(this.props.vectorTools)} config={this.props.config}/>,
      <Erase onClick={this.props.vectorTools.erase.bind(this.props.vectorTools)} config={this.props.config}/>,
      <Intersect onClick={this.props.vectorTools.intersect.bind(this.props.vectorTools)} config={this.props.config}/>
    ]
    return (
      <ToolbarDropdown text={'Feature'} submenu={submenu} active={active}/>
    )
  }
})

var SelectMenu = React.createClass({
  render: function() {
    var active = this.props.config.oneLayer  || this.props.config.multiLayer
    var submenu = [
      <SelectAll onClick={this.props.vectorTools.selectAll.bind(this.props.vectorTools)} config={this.props.config}/>,
      <DeselectAll onClick={this.props.vectorTools.deselectAll.bind(this.props.vectorTools)} config={this.props.config}/>
    ]
    return (
      <ToolbarDropdown text={'Select'} submenu={submenu} active={active}/>
    )
  }
})

var HelpMenu = React.createClass({
  render: function() {
    var active = true
    var submenu = [
      <About />
    ]
    return (
      <ToolbarDropdown text={'Help'} submenu={submenu} active={active}/>
    )
  }
})

var About = React.createClass({
  onClick: function() {
    vex.dialog.alert(React.renderToString(<Modals.About />))
  },
  render: function() {
    var active = true
    return (
      <ToolbarItem text={'About uGIS'} onClick={this.onClick} active={active}/>
    )
  }
})

var Undo = React.createClass({
  render: function() {
    var active = true
    return (
      <ToolbarItem text={'Undo'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var RenameLayer = React.createClass({
  render: function() {
    var active = this.props.config.oneLayer
    return (
      <ToolbarItem text={'Rename Layer'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var ViewAttributes = React.createClass({
  render: function() {
    var active = this.props.config.oneLayer
    return (
      <ToolbarItem text={'Attribute Table'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var CloseAttributes = React.createClass({
  render: function() {
    var active = this.props.config.oneLayer
    return (
      <ToolbarItem text={'Attribute Table'} icon={<i className="fa fa-check"></i>} onClick={this.props.onClick} active={active}/>
    )
  }
})

var ViewGeoJSON = React.createClass({
  render: function() {
    var active = this.props.config.oneLayer && this.props.config.vector
    var icon = false
    if (this.props.config.oneLayer && this.props.config.oneLayer.editGeoJSON) {
      icon = <i className="fa fa-check"></i>
    }
    return (
      <ToolbarItem text={'GeoJSON Editor'} icon={icon} onClick={this.props.onClick} active={active}/>
    )
  }
})

var SaveAs = React.createClass({
  render: function() {
    var active = this.props.config.oneLayer && this.props.config.vector
    return (
      <ToolbarItem text={'Save'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var Edit = React.createClass({
  render: function() {
    var active = this.props.config.oneLayer && this.props.config.vector
    var icon = false
    if (this.props.config.oneLayer && this.props.config.oneLayer.editing) {
      var icon = <i className="fa fa-check"></i>
    }
    return (
      <ToolbarItem text={'Editing Toolbar'} onClick={this.props.onClick} icon={icon} active={active}/>
    )
  }
})

var SelectAll = React.createClass({
  render: function() {
    var active = (this.props.config.oneLayer || this.props.config.multiLayer)  && this.props.config.vector
    return (
      <ToolbarItem text={'Select All'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var DeselectAll = React.createClass({
  render: function() {
    var active = this.props.config.oneFeature || this.props.config.multiFeature
    return (
      <ToolbarItem text={'Deselect All'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var Area = React.createClass({
  render: function() {
    var active = this.props.config.oneFeature || this.props.config.multiFeature
    return (
      <ToolbarItem text={'Area'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var Bearing = React.createClass({
  render: function() {
    var active = this.props.config.numPoints == 2
    return (
      <ToolbarItem text={'Bearing'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var Distance = React.createClass({
  render: function() {
    var active = this.props.config.numPoints == 2
    return (
      <ToolbarItem text={'Distance'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var Length = React.createClass({
  render: function() {
    var active = this.props.config.numLines > 0
    return (
      <ToolbarItem text={'Line Length'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var Delete = React.createClass({
  render: function() {
    var active = this.props.config.oneFeature || this.props.config.multiFeature
    return (
      <ToolbarItem text={'Delete'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var Simplify = React.createClass({
  render: function() {
    var active = this.props.config.line || this.props.config.poly
    return (
      <ToolbarItem text={'Simplify'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var Buffer = React.createClass({
  render: function() {
    var active = this.props.config.oneFeature || this.props.config.multiFeature
    return (
      <ToolbarItem text={'Buffer'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var Flip = React.createClass({
  render: function() {
    var active = this.props.config.oneFeature || this.props.config.multiFeature
    return (
      <ToolbarItem text={'Flip'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var Kinks = React.createClass({
  render: function() {
    var active = this.props.config.oneFeature || this.props.config.multiFeature
    return (
      <ToolbarItem text={'Kinks'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var Explode = React.createClass({
  render: function() {
    var active = this.props.config.oneFeature || this.props.config.multiFeature
    return (
      <ToolbarItem text={'Explode'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var Combine = React.createClass({
  render: function() {
    var active = this.props.config.oneFeature || this.props.config.multiFeature
    return (
      <ToolbarItem text={'Combine'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var Merge = React.createClass({
  render: function() {
    var active = this.props.config.multiFeature && this.props.config.oneLayer
    return (
      <ToolbarItem text={'Merge'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var Erase = React.createClass({
  render: function() {
    var active = this.props.config.numPolys === 2
    return (
      <ToolbarItem text={'Erase'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var Intersect = React.createClass({
  render: function() {
    var active = this.props.config.numPolys === 2
    return (
      <ToolbarItem text={'Intersect'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var HexGrid = React.createClass({
  render: function() {
    var active = this.props.config.oneLayer || this.props.config.multiLayer
    return (
      <ToolbarItem text={'Hex Grid'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var Quantile = React.createClass({
  render: function() {
    var active = this.props.config.oneFeature || this.props.config.multiFeature
    return (
      <ToolbarItem text={'Quantile'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var ZoomToLayer = React.createClass({
  render: function() {
    var active = this.props.config.oneLayer || this.props.config.multiLayer
    return (
      <ToolbarItem text={'Zoom To Layer'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var Toolbar = React.createClass({
  findActive: function() {
    var config = {
      nothing: true,
      oneLayer: false,
      multiLayer: false,
      noFeature: true,
      oneFeature: false,
      multiFeature: false,
      point: false,
      poly: false,
      line: false,
      numPoints: 0,
      numPolys: 0,
      numLines: 0,
      multipoint: false,
      multipoly: false,
      multiline: false,
      vector: false,
      tile: true
    }
    var selected = _.where(this.props.layers, {selected: true})
    var selectedFeatures = []
    selected.forEach(function(layer) {
      layer.geojson.features.forEach(function(feature) {
        if (feature.selected) {
          selectedFeatures.push(feature)
          if (feature.geometry.type === 'Point') {
            config.numPoints += 1
            if (config.point) config.multipoint = true
            config.point = true
          } else if (feature.geometry.type === 'Polygon') {
            config.numPolys += 1
            if (config.poly) config.multipoly = true
            config.poly = true
          } else if (feature.geometry.type === 'LineString') {
            config.numLines += 1
            if (config.line) config.multiline = true
            config.line = true
          }
        }
      })
    })
    if (selected.length === 0) {
      config.nothing = true
    }
    if (selected.length === 1) {
      config.oneLayer = selected[0]
    }
    if (selected.length > 1) {
      config.multiLayer = true
    }
    var totalSelectedFeatures = 0
    this.props.layers.forEach(function(layer) {
      totalSelectedFeatures += gjutils.findSelectedCount(layer.geojson)
      if (layer.selected) {
        if (layer.vector) {
          config.vector = true
        }
        if (layer.tile) {
          config.tile = true
        }
      }
    })
    if (totalSelectedFeatures === 1) {
      config.oneFeature = true
    }
    if (totalSelectedFeatures > 1) {
      config.multiFeature = true
    }
    return config
  },
  render: function() {
    //var config = this.findActive()
    return (
      <div className="toolbar">
        <h1>uGIS</h1>
      </div>
    )
    // return (
    //   <div className="toolbar">
    //     <h1>uGIS</h1>
    //     <LayerMenu config={config}
    //       vectorTools={this.props.vectorTools}
    //     />
    //     <ViewMenu config={config}
    //       vectorTools={this.props.vectorTools}
    //     />
    //     <FeatureMenu config={config}
    //       vectorTools={this.props.vectorTools}
    //     />
    //     <SelectMenu config={config}
    //       vectorTools={this.props.vectorTools}
    //     />
    //     <HelpMenu config={config} />
    //   </div>
    // )
  }
})

module.exports = Toolbar