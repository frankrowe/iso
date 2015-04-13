var React = require('react')

var Layername = React.createClass({
  render: function() {
    return (
      <input name="layername" type="text" defaultValue={this.props.layername} />
    )
  }
})

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

var Simplify = React.createClass({
  render: function() {
    return (
      <input name="tolerance" type="text" defaultValue="0.1" />
    )
  }
})

module.exports = {
  Buffer: Buffer,
  Layername: Layername,
  Simplify: Simplify
}