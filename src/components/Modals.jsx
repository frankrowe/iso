var React = require('react')
  , pkg = require('../../package.json')

var Modals = {

  Layername: React.createClass({
    render: function() {
      return (
        <input name="layername" type="text" defaultValue={this.props.layername} />
      )
    }
  }),

  Buffer: React.createClass({
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
  }),

  Simplify: React.createClass({
    render: function() {
      return (
        <input name="tolerance" type="text" defaultValue="0.1" />
      )
    }
  }),

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

  TileLayer: React.createClass({
    render: function() {
      return (
        <div>
          <p>{'(http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg)'}</p>
          <input name="url" type="text" defaultValue="" />
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
  })
}

module.exports = Modals