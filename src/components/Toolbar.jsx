var React = require('react')
  , palette = require('../utils/palette')
  , gjutils = require('../utils/gjutils')


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
        {this.props.text}
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
    var submenu = <ul>
      <li><RenameLayer onClick={this.props.renameLayer} config={this.props.config}/></li>
      <li><Edit onClick={this.props.editFeature} config={this.props.config}/></li>
      <li><SaveAs onClick={this.props.saveAs} config={this.props.config}/></li>
      <li><ZoomToLayer onClick={this.props.zoomToLayer} config={this.props.config}/></li>
    </ul>
    return (
      <ToolbarDropdown text={'Layer'} submenu={submenu} active={active}/>
    )
  }
})

var FeatureMenu = React.createClass({
  render: function() {
    var active = this.props.config.oneFeature || this.props.config.multiFeature
    var submenu = <ul>
        <li><SelectAll onClick={this.props.selectAll} config={this.props.config}/></li>
        <li><DeselectAll onClick={this.props.deselectAll} config={this.props.config}/></li>
        <li><Delete onClick={this.props.deleteFeature} config={this.props.config}/></li>
        <li><Simplify onClick={this.props.simplify} config={this.props.config}/></li>
        <li><Buffer onClick={this.props.buffer} config={this.props.config}/></li>
        <li><Flip onClick={this.props.flip} config={this.props.config}/></li>
        <li><Explode onClick={this.props.explode} config={this.props.config}/></li>
        <li><Merge onClick={this.props.merge} config={this.props.config}/></li>
        <li><HexGrid onClick={this.props.hexgrid} config={this.props.config}/></li>
      </ul>
    return (
      <ToolbarDropdown text={'Feature'} submenu={submenu} active={active}/>
    )
  }
})

var SelectMenu = React.createClass({
  render: function() {
    var active = this.props.config.oneLayer  || this.props.config.multiLayer
    var submenu = <ul>
      <li></li>
    </ul>
    return (
      <ToolbarDropdown text={'Select'} submenu={submenu} active={active}/>
    )
  }
})

var HelpMenu = React.createClass({
  render: function() {
    var active = true
    var submenu = <ul>
      <li></li>
    </ul>
    return (
      <ToolbarDropdown text={'Help'} submenu={submenu} active={active}/>
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

var SaveAs = React.createClass({
  render: function() {
    var active = this.props.config.oneLayer
    return (
      <ToolbarItem text={'Save'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var Edit = React.createClass({
  render: function() {
    var active = this.props.config.oneLayer
    return (
      <ToolbarItem text={'Edit'} onClick={this.props.onClick} active={active}/>
    )
  }
})

var SelectAll = React.createClass({
  render: function() {
    var active = this.props.config.oneLayer || this.props.config.multiLayer
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
      <ToolbarItem text={'ZoomToLayer'} onClick={this.props.onClick} active={active}/>
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
      multipoint: false,
      multipoly: false,
      multiline: false
    }
    var selected = _.where(this.props.layers, {selected: true})
    if (selected.length === 0) {
      config.nothing = true
    }
    if (selected.length === 1) {
      config.oneLayer = true
    }
    if (selected.length > 1) {
      config.multiLayer = true
    }
    var totalSelectedFeatures = 0
    this.props.layers.forEach(function(layer) {
      totalSelectedFeatures += gjutils.findSelectedCount(layer.geojson)
    })
    if (totalSelectedFeatures === 1) {
      config.oneFeature = true
    }
    if (totalSelectedFeatures > 1) {
      config.multiFeature = true
    }
    selected.forEach(function(layer) {
      layer.geojson.features.forEach(function(feature) {
        if (feature.selected) {
          if (feature.geometry.type === 'Point') {
            if (config.point) config.multipoint = true
            config.point = true
          } else if (feature.geometry.type === 'Polygon') {
            if (config.poly) config.multipoly = true
            config.poly = true
          } else if (feature.geometry.type === 'LineString') {
            if (config.line) config.multiline = true
            config.line = true
          }
        }
      })
    })
    return config
  },
  render: function() {
    var config = this.findActive()
    return (
      <div className="toolbar">
        <h1>uGIS</h1>
        <LayerMenu config={config}
          newLayer={this.props.newLayer}
          renameLayer={this.props.renameLayer}
          editFeature={this.props.editFeature}
          saveAs={this.props.saveAs}
          zoomToLayer={this.props.zoomToLayer}
        />
        <FeatureMenu config={config}
          selectAll={this.props.selectAll}
          deselectAll={this.props.deselectAll}
          deleteFeature={this.props.deleteFeature}
          simplify={this.props.simplify}
          buffer={this.props.buffer}
          flip={this.props.flip}
          explode={this.props.explode}
          merge={this.props.merge}
          hexgrid={this.props.hexgrid}
        />
        <SelectMenu config={config} />
        <HelpMenu config={config} />
      </div>
    )
  }
})

module.exports = Toolbar