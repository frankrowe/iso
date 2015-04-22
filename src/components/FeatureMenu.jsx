var React = require('react')
  , Modals = require('./Modals.jsx')
  , ToolbarItem = require('./ToolbarItem.jsx')
  , ToolbarSubmenu = require('./ToolbarSubmenu.jsx')
  , ToolbarDropdown = require('./ToolbarDropdown.jsx')
  , LayerActions = require('../actions/LayerActions')
  , LayerStore = require('../stores/LayerStore')
  , vectorTools = require('../utils/vectorTools')

var Area = React.createClass({
  onClick: function() {
    vectorTools.area(LayerStore.getAllSelected())
  },
  render: function() {
    var active = this.props.config.numPolys > 0
    return (
      <ToolbarItem text={'Area'} onClick={this.onClick} active={active}/>
    )
  }
})

var Bearing = React.createClass({
  onClick: function() {
    vectorTools.bearing(LayerStore.getAllSelected())
  },
  render: function() {
    var active = this.props.config.numPoints == 2
    return (
      <ToolbarItem text={'Bearing'} onClick={this.onClick} active={active}/>
    )
  }
})

var Distance = React.createClass({
  onClick: function() {
    vectorTools.distance(LayerStore.getAllSelected())
  },
  render: function() {
    var active = this.props.config.numPoints == 2
    return (
      <ToolbarItem text={'Distance'} onClick={this.onClick} active={active}/>
    )
  }
})

var Length = React.createClass({
  onClick: function() {
    vectorTools.lineLength(LayerStore.getAllSelected())
  },
  render: function() {
    var active = this.props.config.numLines > 0
    return (
      <ToolbarItem text={'Line Length'} onClick={this.onClick} active={active}/>
    )
  }
})

var Delete = React.createClass({
  onClick: function() {
    vectorTools.deleteFeature(LayerStore.getAllSelected())
  },
  render: function() {
    var active = this.props.config.oneFeature || this.props.config.multiFeature
    return (
      <ToolbarItem text={'Delete'} onClick={this.onClick} active={active}/>
    )
  }
})

var Simplify = React.createClass({
  onClick: function() {
    vectorTools.simplify(LayerStore.getAllSelected())
  },
  render: function() {
    var active = this.props.config.line || this.props.config.poly
    return (
      <ToolbarItem text={'Simplify'} onClick={this.onClick} active={active}/>
    )
  }
})

var Buffer = React.createClass({
  onClick: function() {
    vectorTools.buffer(LayerStore.getAllSelected())
  },
  render: function() {
    var active = this.props.config.oneFeature || this.props.config.multiFeature
    return (
      <ToolbarItem text={'Buffer'} onClick={this.onClick} active={active}/>
    )
  }
})

var Flip = React.createClass({
  onClick: function() {
    vectorTools.flip(LayerStore.getAllSelected())
  },
  render: function() {
    var active = this.props.config.oneFeature || this.props.config.multiFeature
    return (
      <ToolbarItem text={'Flip'} onClick={this.onClick} active={active}/>
    )
  }
})

var Kinks = React.createClass({
  onClick: function() {
    vectorTools.kinks(LayerStore.getAllSelected())
  },
  render: function() {
    var active = this.props.config.oneFeature || this.props.config.multiFeature
    return (
      <ToolbarItem text={'Kinks'} onClick={this.onClick} active={active}/>
    )
  }
})

var Explode = React.createClass({
  onClick: function() {
    vectorTools.explode(LayerStore.getAllSelected())
  },
  render: function() {
    var active = this.props.config.oneFeature || this.props.config.multiFeature
    return (
      <ToolbarItem text={'Explode'} onClick={this.onClick} active={active}/>
    )
  }
})

var Combine = React.createClass({
  onClick: function() {
    vectorTools.combine(LayerStore.getAllSelected())
  },
  render: function() {
    var active = this.props.config.oneFeature || this.props.config.multiFeature
    return (
      <ToolbarItem text={'Combine'} onClick={this.onClick} active={active}/>
    )
  }
})

var Merge = React.createClass({
  onClick: function() {
    vectorTools.merge(LayerStore.getAllSelected())
  },
  render: function() {
    var active = this.props.config.multiFeature && this.props.config.oneLayer
    return (
      <ToolbarItem text={'Merge'} onClick={this.onClick} active={active}/>
    )
  }
})

var Erase = React.createClass({
  onClick: function() {
    vectorTools.erase(LayerStore.getAllSelected())
  },
  render: function() {
    var active = this.props.config.numPolys === 2
    return (
      <ToolbarItem text={'Erase'} onClick={this.onClick} active={active}/>
    )
  }
})

var Intersect = React.createClass({
  onClick: function() {
    vectorTools.intersect(LayerStore.getAllSelected())
  },
  render: function() {
    var active = this.props.config.numPolys === 2
    return (
      <ToolbarItem text={'Intersect'} onClick={this.onClick} active={active}/>
    )
  }
})

var HexGrid = React.createClass({
  onClick: function() {
    vectorTools.hexgrid(LayerStore.getAllSelected())
  },
  render: function() {
    var active = this.props.config.oneLayer || this.props.config.multiLayer
    return (
      <ToolbarItem text={'Hex Grid'} onClick={this.onClick} active={active}/>
    )
  }
})

var Quantile = React.createClass({
  onClick: function() {
    vectorTools.quantile(LayerStore.getAllSelected())
  },
  render: function() {
    var active = this.props.config.oneFeature || this.props.config.multiFeature
    return (
      <ToolbarItem text={'Quantile'} onClick={this.onClick} active={active}/>
    )
  }
})

var Transformation = React.createClass({
  render: function() {
    var active = true
    var submenu = [
      <Simplify {...this.props} key={'simplify'}/>,
      <Buffer {...this.props} key={'buffer'}/>,
      <Flip {...this.props} key={'flip'}/>,
      <Explode {...this.props} key={'explode'}/>,
      <Merge {...this.props} key={'merge'}/>,
      <Erase {...this.props} key={'erase'}/>,
      <Intersect {...this.props} key={'intersect'}/>
    ]
    return (
      <ToolbarSubmenu text={'Transformation'} submenu={submenu} active={active}/>
    )
  }
})

var Measurement = React.createClass({
  render: function() {
    var active = true
    var submenu = [
      <Area {...this.props} key={'area'}/>,
      <Distance {...this.props} key={'distance'}/>,
      <Bearing {...this.props} key={'bearing'}/>,
      <Length {...this.props} key={'lineLength'}/>
    ]
    return (
      <ToolbarSubmenu text={'Measurement'} submenu={submenu} active={active}/>
    )
  }
})

var FeatureMenu = React.createClass({
  render: function() {
    var active = true
    var submenu = [
      <Delete {...this.props} key={'deleteFeature'}/>,
      <Measurement {...this.props} key={'Measurement'}/>,
      <Transformation {...this.props} key={'Transformation'}/>
    ]
    return (
      <ToolbarDropdown text={'Feature'} submenu={submenu} active={active}/>
    )
  }
})

module.exports = FeatureMenu