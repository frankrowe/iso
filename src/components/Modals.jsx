var React = require('react')
  , pkg = require('../../package.json')

var Modals = {

  About: React.createClass({
    render: function() {
      return (
        <div>
          <p>About uGIS</p>
          <p>uGIS is a web based, GeoJSON + Javascript GIS engine.</p>
          <p>Version {pkg.version}</p>
        </div>
      )
    }
  }),

  ViewGeoJSON: React.createClass({
    render: function() {
      return (
        <div>
          <textarea defaultValue={JSON.stringify(this.props.layer.geojson)} />
        </div>
      )
    }
  }),

  AttributeTable: React.createClass({
    render: function() {
      var columns = _.pluck(this.props.layer.geojson.features, 'properties')
      columns = columns.map(function(c) { return _.keys(c) })
      columns = _.uniq(_.flatten(columns))
      console.log(columns)
      var th = columns.map(function(c) {
        return <th>{c}</th>
      })
      var rows = this.props.layer.geojson.features.map(function(f) {
        var fields = columns.map(function(c) {
          return <td>{f.properties[c]}</td>
        })
        return <tr>{fields}</tr>
      })
      return (
        <div>
          <table>
          <tr>{th}</tr>
          {rows}
          </table>
        </div>
      )
    }
  }),

  getTolerance: function(next) {

    var Simplify = React.createClass({
      render: function() {
        return (
          <input name="tolerance" type="text" defaultValue="0.1" />
        )
      }
    })
    vex.dialog.open({
      message: 'Select tolerance.',
      afterOpen: function($vexContent) {
        React.render(<Simplify />, $vexContent.find('.vex-dialog-input').get(0))
      },
      callback: function(data) {
        if (data === false) {
          return console.log('Cancelled');
        }
        //TODO make sure tolerance is 0 - 1
        var err = false
        next(err, +data.tolerance)
      }
    })
  },

  getDistance: function(next) {

    var Buffer = React.createClass({
      render: function() {
        return (
          <div>
          <input name="distance" type="text" defaultValue="0.1" />
            <select name="units" defaultValue="miles">
              <option value="miles">Miles</option>
              <option value="feet">feet</option>
              <option value="kilometers">kilometers</option>
              <option value="meters">meters</option>
              <option value="degrees">degrees</option>
            </select>
          </div>
        )
      }
    })
    vex.dialog.open({
      message: 'Select distance.',
      afterOpen: function($vexContent) {
        React.render(<Buffer />, $vexContent.find('.vex-dialog-input').get(0))
      },
      callback: function(data) {
        console.log(data)
        if (data === false) {
          return console.log('Cancelled');
        }
        //TODO make sure distance is number
        data.distance = +data.distance
        var err = false
        next(err, data)
      }
    })
  },

  getName: function(layername, next) {

    var Modal = React.createClass({
      render: function() {
        return (
          <input name="layername" type="text" defaultValue={this.props.layername} />
        )
      }
    })

    var dialog = vex.dialog.open({
      message: 'Enter New Layer Name',
      afterOpen: function($vexContent) {
        React.render(<Modal layername={layername}/>, $vexContent.find('.vex-dialog-input').get(0))
      },
      callback: function(data) {
        if (data === false) {
          return console.log('Cancelled')
        }
        var err = false
        next(err, data.layername)
      }
    })

  },

  getStyle: function(style, next) {
    var Modal = React.createClass({
      render: function() {
        return (
          <div className={'style-form'}>
            <p>fill color:</p>
            <input name="fillColor" type="color" defaultValue={this.props.style.fillColor} />
            <p>color:</p>
            <input name="color" type="color" defaultValue={this.props.style.color} />
            <p>radius:</p>
            <input name="radius" type="text" defaultValue={this.props.style.radius} />
            <p>weight:</p>
            <input name="weight" type="text" defaultValue={this.props.style.weight} />
            <p>opacity:</p>
            <input name="opacity" type="text" defaultValue={this.props.style.opacity} />
            <p>fillOpacity:</p>
            <input name="fillOpacity" type="text" defaultValue={this.props.style.fillOpacity} />
          </div>
        )
      }
    })

    var dialog = vex.dialog.open({
      message: 'Update Layer Style',
      afterOpen: function($vexContent) {
        React.render(<Modal style={style}/>, $vexContent.find('.vex-dialog-input').get(0))
      },
      callback: function(data) {
        if (data === false) {
          return console.log('Cancelled')
        }
        var err = false
        next(err, data)
      }
    })

  },

  getTileURL: function(next) {

    var TileLayer = React.createClass({
      render: function() {
        return (
          <div>
            <p>{'(http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg)'}</p>
            <input name="url" type="text" defaultValue="" />
          </div>
        )
      }
    })

    vex.dialog.open({
      message: 'Enter TileLayer URL',
      afterOpen: function($vexContent) {
        React.render(<TileLayer />, $vexContent.find('.vex-dialog-input').get(0))
      },
      callback: function(data) {
        if (data === false) {
          return console.log('Cancelled');
        }
        next(false, data.url)
      }
    })
  }
}

module.exports = Modals