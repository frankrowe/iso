var React = require('react')
  , FixedDataTable = require('fixed-data-table')

var Table = FixedDataTable.Table
var Column = FixedDataTable.Column

var AttributeTable = React.createClass({
  rowGetter: function(rowIndex) {
    return this.rowValues[rowIndex]
  },
  rowClassNameGetter: function(rowIndex) {
    var feature = this.layer.geojson.features[rowIndex]
    return feature.selected ? 'selected' : null
  },
  onRowClick: function(e, rowIndex) {
    var feature = this.layer.geojson.features[rowIndex]
    feature.selected = !feature.selected
    this.props.updateLayer(this.layer)
  },
  render: function() {
    var self = this
    var style = {}
      , tableWidth = $('.work-space').innerWidth() - 4
      , tableHeight = 200
      , indexColumnWidth = 30
    this.layer = false
    this.props.layers.forEach(function(l) {
      if (l.viewAttributes) {
        self.layer = l
      }
    })
    if (!this.layer) {
      style.display = 'none'
      return (
        <div className="attribute-table" style={style}></div>
      )
    } else {
      var columnLabels = _.pluck(this.layer.geojson.features, 'properties')
      columnLabels = columnLabels.map(function(c) { return _.keys(c) })
      columnLabels = _.uniq(_.flatten(columnLabels))
      var columnWidth = (tableWidth - indexColumnWidth)/columnLabels.length
      var columns = columnLabels.map(function(label, idx) {
        return <Column
          label={label}
          width={columnWidth}
          dataKey={idx+1}
          key={idx+1} />
      })
      columns.unshift(
        <Column
          label={''}
          width={indexColumnWidth}
          dataKey={0}
          key={0} />
      )

      this.rowValues = this.layer.geojson.features.map(function(f, idx) {
        var row = _.values(f.properties)
        row.unshift(idx)
        return row
      })
      return (
        <div className="attribute-table" style={style}>
          <Table
              rowHeight={20}
              rowGetter={this.rowGetter}
              rowClassNameGetter={this.rowClassNameGetter}
              onRowClick={this.onRowClick}
              rowsCount={this.layer.geojson.features.length}
              width={tableWidth}
              maxHeight={tableHeight}
              headerHeight={20}>
              {columns}
            </Table>
        </div>
      )
    }
  }
})

module.exports = AttributeTable