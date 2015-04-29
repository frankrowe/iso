var React = require('react')
  , vectorTools = require('../utils/VectorTools')
  , pkg = require('../../package.json')

var LIMIT = 10000

function validateBBOX(bbox) {
  if (_.compact(bbox).length !== 4) {
    return 'Bounding box must be xLow, yLow, xHigh, yHigh'
  }
  return false
}

var Modals = {

  About: React.createClass({
    render: function() {
      return (
        <div>
          <h2>ugis</h2>
          <p>ugis is a lightweight, web based, GeoJSON + Javascript GIS engine.</p>
          <p>Formats currently supported:
            <ul>
              <li>Loading: GeoJSON, KML</li>
              <li>Saving: GeoJSON, KML, CSV, WKT, Shapefile</li>
            </ul>
          </p>
          <p>ugis is open source: <a href="https://github.com/frankrowe/ugis">github.com/frankrowe/ugis</a></p>
          <p>ugis is built on open source components, including:
            <ul>
              <li><a href="http://leafletjs.com/" target="_blank">Leaflet</a></li>
              <li><a href="http://turfjs.org/" target="_blank">Turf</a></li>
              <li><a href="https://facebook.github.io/react/index.html" target="_blank">React</a></li>
              <li><a href="https://codemirror.net/" target="_blank">CodeMirror</a></li>
              <li><a href="https://github.com/mapbox/geojsonhint" target="_blank">geojsonhint</a></li>
              <li><a href="https://github.com/mapbox/csv2geojson" target="_blank">csv2geojson</a></li>
              <li><a href="https://github.com/mapbox/togeojson" target="_blank">togeojson</a></li>
              <li><a href="https://github.com/mapbox/shp-write" target="_blank">shp-write</a></li>
              <li><a href="https://github.com/HubSpot/vex" target="_blank">vex</a></li>
              <li><a href="https://github.com/qgis/QGIS" target="_blank">QGIS (icons)</a></li>
            </ul>
          </p>
          <p>Version <b>{pkg.version}</b></p>
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

    var el

    var Modal = React.createClass({
      render: function() {
        return (
          <div>
          <input name="tolerance" type="text" defaultValue={this.props.tolerance} />
          <p className="error">{this.props.error}</p>
          </div>
        )
      }
    })

    vex.dialog.open({
      message: 'Select tolerance.',
      afterOpen: function($vexContent) {
        el = $vexContent.find('.vex-dialog-input').get(0)
        React.render(<Modal tolerance={'0.1'} />, el)
      },
      onSubmit: function(e) {
        e.preventDefault()
        e.stopPropagation()

        var error = false
        var $vexContent = $(this).parent()

        var tolerance = +this.tolerance.value
        if (isNaN(tolerance)) {
          error = 'Tolerance must be a number.'
        } else if (tolerance <= 0) {
          error = 'Tolerance must be greater than zero.'
        }

        if (error) {
          React.render(<Modal error={error} tolerance={this.tolerance.value} />, el)
        } else {
          vex.close($vexContent.data().vex.id)
          var data = {
            tolerance: tolerance
          }
          next(false, data)
        }
      }
    })
  },

  getDistance: function(next) {

    var el

    var Modal = React.createClass({
      render: function() {
        return (
          <div>
          <input name="distance" type="text" defaultValue={this.props.distance} />
          <select name="units" defaultValue={this.props.units}>
            <option value="miles">Miles</option>
            <option value="feet">feet</option>
            <option value="kilometers">kilometers</option>
            <option value="meters">meters</option>
            <option value="degrees">degrees</option>
          </select>
          <p className="error">{this.props.error}</p>
          </div>
        )
      }
    })
    vex.dialog.open({
      message: 'Select distance.',
      afterOpen: function($vexContent) {
        el = $vexContent.find('.vex-dialog-input').get(0)
        React.render(<Modal distance={'1'} units={'miles'} />, el)
      },
      onSubmit: function(e) {
        e.preventDefault()
        e.stopPropagation()

        var error = false
        var $vexContent = $(this).parent()

        var distance = +this.distance.value
        if (isNaN(distance)) {
          error = 'Distance must be a number.'
        } else if (distance <= 0) {
          error = 'Distance must be greater than zero.'
        }

        if (error) {
          React.render(<Modal error={error} distance={this.distance.value} units={this.units.value}/>, el)
        } else {
          vex.close($vexContent.data().vex.id)
          var data = {
            distance: distance,
            units: this.units.value
          }
          next(false, data)
        }
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

  getRandom: function(next) {

    var el
    var Modal = React.createClass({
      render: function() {
        return (
          <div>
            <p>Count:</p>
            <input name="count" type="text" defaultValue={this.props.count} />
            <p>Bounding Box (xLow, yLow, xHigh, yHigh):</p>
            <input name="bbox" type="text" defaultValue={this.props.bbox} />
            <p className="error">{this.props.error}</p>
          </div>
        )
      }
    })

    var dialog = vex.dialog.open({
      message: 'Create Random Features',
      afterOpen: function($vexContent) {
        el = $vexContent.find('.vex-dialog-input').get(0)
        React.render(<Modal count={'10'} bbox={'-180, -90, 180, 90'}/>, el)
      },
      onSubmit: function(e) {
        e.preventDefault()
        e.stopPropagation()

        var $vexContent = $(this).parent()
        var error = false

        var bbox = this.bbox.value
        bbox = bbox.split(',')
        bbox = bbox.map(Number)
        error = validateBBOX(bbox)

        var count = +this.count.value
        if (isNaN(count)) {
          error = 'That\'s not a number...'
        } else if (count > LIMIT) {
          error = <span>Are you <i>trying</i> to crash me?</span>
        } else if (count <= 0) {
          error = 'Count should be more than zero.'
        }

        if (error) {
          React.render(<Modal error={error} count={this.count.value} bbox={this.bbox.value}/>, el)
        } else {
          vex.close($vexContent.data().vex.id)
          var data = {
            bbox: bbox,
            count: count
          }
          next(false, data)
        }
      }
    })

  },

  getGrid: function(type, next) {

    var LIMIT = 10000
    var el
    var defaults = {
      hex: {
        cellWidth: 50
      },
      point: {
        cellWidth: 50
      },
      square: {
        cellWidth: 50
      },
      triangle: {
        cellWidth: 50
      }
    }
    var Modal = React.createClass({
      render: function() {
        return (
          <div>
            <p>Bounding Box (xLow, yLow, xHigh, yHigh):</p>
            <input name="bbox" type="text" defaultValue={this.props.bbox} />
            <p>Cell Width:</p>
            <input name="cellWidth" type="text" defaultValue={this.props.cellWidth} />
            <select name="units" defaultValue={this.props.units}>
              <option value="miles">Miles</option>
              <option value="kilometers">kilometers</option>
            </select>
            <p className="error">{this.props.error}</p>
          </div>
        )
      }
    })

    var dialog = vex.dialog.open({
      message: 'Create Random Features',
      afterOpen: function($vexContent) {
        el = $vexContent.find('.vex-dialog-input').get(0)
        React.render(<Modal cellWidth={defaults[type].cellWidth} bbox={'-96,31,-84,40'} units={'miles'}/>, el)
      },
      onSubmit: function(e) {
        e.preventDefault()
        e.stopPropagation()

        var $vexContent = $(this).parent()
        var error = false

        var bbox = this.bbox.value
        bbox = bbox.split(',')
        bbox = bbox.map(Number)
        error = validateBBOX(bbox)

        var cellWidth = this.cellWidth.value
        if (cellWidth <= 0) {
          error = 'Cell Width must be greater than zero.'
        }
        var data = {
          bbox: bbox,
          cellWidth: cellWidth,
          units: this.units.value
        }
        var grid = vectorTools.createGrid(type, data)
        if (grid.features.length > LIMIT) {
          error = 'Too many features. Increase cell width or decrease bbox size.'
        }
        if (error) {
          React.render(<Modal error={error} cellWidth={this.cellWidth.value} bbox={this.bbox.value} units={this.units.value}/>, el)
        } else {
          vex.close($vexContent.data().vex.id)
          next(false, grid)
        }
      }
    })

  },

  getTileURL: function(next) {

    var TileLayer = React.createClass({
      render: function() {
        return (
          <div>
            <p>{'(http://tile.stamen.com/toner/{z}/{x}/{y}.jpg)'}</p>
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