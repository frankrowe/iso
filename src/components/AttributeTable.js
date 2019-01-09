import React from 'react';
import FixedDataTable from 'fixed-data-table';
import LayerActions from '../actions/LayerActions';

let Table = FixedDataTable.Table;
let Column = FixedDataTable.Column;
let Cell = FixedDataTable.Cell;

class PropertyCell extends React.Component {
  _getMyDataForIndex(idx, field) {
    return this.props.layer.geojson.features[idx].properties[field]
  }
  render() {
    return (
      <Cell {...this.props}>
        {this._getMyDataForIndex(this.props.rowIndex, this.props.field)}
      </Cell>
    )
  }
}

class IndexCell extends React.Component {
  render() {
    return (
      <Cell {...this.props}>
        {this.props.rowIndex}
      </Cell>
    )
  }
}

class AttributeTable extends React.Component {
  constructor(props) {
    super(props)

    this.onRowClick = this.onRowClick.bind(this)
    this.rowClassNameGetter = this.rowClassNameGetter.bind(this)
    this._onColumnResizeEndCallback = this._onColumnResizeEndCallback.bind(this)

    this.setTableWidth()

    //make equal size columns for all feature props
    let columnWidths = {
      index: 50
    };
    this.columnLabels = _.pluck(this.props.layer.geojson.features, 'properties')
    this.columnLabels = this.columnLabels.map(function(c) { return _.keys(c) })
    this.columnLabels = _.uniq(_.flatten(this.columnLabels))
    let columnWidth = (this.tableWidth - columnWidths.index)/this.columnLabels.length;
    this.columnLabels.forEach((label) => {
      columnWidths[label] = columnWidth
    })

    this.state = {
      columnWidths: columnWidths
    }
  }
  setTableWidth() {
    this.tableWidth = $('.work-space').innerWidth() - 2
  }
  _onColumnResizeEndCallback(newColumnWidth, columnKey) {
    let columnWidths = this.state.columnWidths;
    columnWidths[columnKey] = newColumnWidth
    this.setState({columnWidths: columnWidths})
  }
  rowClassNameGetter(rowIndex) {
    let feature = this.props.layer.geojson.features[rowIndex];
    return feature.selected ? 'selected' : null
  }
  onRowClick(e, rowIndex) {
    let feature = this.props.layer.geojson.features[rowIndex];
    feature.selected = !feature.selected
    LayerActions.update(this.props.layer.id, {geojson: this.props.layer.geojson})

  }
  makeColumns() {
    this.setTableWidth()
    this.columns = this.columnLabels.map((label, idx) => {
      return (
        <Column
         header={<Cell>{label}</Cell>}
         cell={<PropertyCell {...this.props} field={label} />}
         width={this.state.columnWidths[label]}
         isResizable={true}
         columnKey={label}
         key={idx+1} />
      )
    })
    this.columns.unshift(
      <Column
        header={<Cell>idx</Cell>}
        cell={<IndexCell {...this.props} />}
        width={this.state.columnWidths.index}
        isResizable={true}
        fixed={true}
        columnKey="index"
        key={0} />
    )
  }
  render() {
    this.makeColumns()
    return (
      <div className="attribute-table">
        <Table
          rowsCount={this.props.layer.geojson.features.length}
          rowHeight={30}
          headerHeight={30}
          width={this.tableWidth}
          maxHeight={300}
          onRowClick={this.onRowClick}
          onColumnResizeEndCallback={this._onColumnResizeEndCallback}
          isColumnResizing={false}
          rowClassNameGetter={this.rowClassNameGetter}>
          {this.columns}
        </Table>
      </div>
    )
  }
}

export default AttributeTable;
