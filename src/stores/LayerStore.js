/*
 * Layer Store
 */

var AppDispatcher = require('../dispatcher/AppDispatcher')
  , EventEmitter = require('events').EventEmitter
  , LayerConstants = require('../constants/LayerConstants')
  , assign = require('object-assign')
  , DefaultLayer = require('../utils/DefaultLayer')

var CHANGE_EVENT = 'change'

var _layers = {}

var undos = []

var UNDO_LENGTH = 10

/**
 * Create a Layer.
 */
function create() {
  var layer = DefaultLayer.generate()
  layer.order = Object.keys(_layers).length
  _layers[layer.id] = layer
}

/**
 * Update a Layer.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  addUndo(id, updates)
  _layers[id] = assign({}, _layers[id], updates)
}

/**
 * Update multiple Layers.
 * @param {object} updates An object literal with key of layer id and value of
 * update objects
 */
function updateList(updates) {
  for (var id in updates) {
    update(id, updates[id])
  }
}

/**
 * Update all of the Layers with the same object.
 *     the data to be updated.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.
 */
function updateAll(updates) {
  for (var id in _layers) {
    update(id, updates)
  }
}

/**
 * Import a layer.
 * @param  {object} geojson
 * @param {object} the layer name
 */
function importLayer(layer) {
  layer.order = Object.keys(_layers).length
  _layers[layer.id] = layer
}

/**
 * Delete a Layer.
 * @param  {string} id
 */
function destroy(id) {
  if (_layers[id].vector) {
    _layers[id].mapLayer.clearLayers()
  }
  _layers[id].mapLayer = false
  addUndo(id, _layers[id])
  delete _layers[id]
}

/**
 * Delete all the selected Layers.
 */
function destroySelected() {
  for (var id in _layers) {
    if (_layers[id].selected) {
      destroy(id)
    }
  }
}

/**
 * Reorder the Layers
 * @param  {number} the original layer position
 * @param  {number} the position to move the layer
 */
function reorder(from, to) {
  var orders = _.range(Object.keys(_layers).length)
  orders.splice(to, 0, orders.splice(from, 1)[0])

  var updates = {}
  orders.forEach(function(order, idx) {
    var layer = _.findWhere(_layers, {order: order})
    updates[layer.id] = {
      order: idx
    }
  })
  updateList(updates)

  for (var id in _layers) {
    if (_layers[id].vector) {
      _layers[id].mapLayer.clearLayers()
    }
    _layers[id].mapLayer = false
  }

}

function addUndo(id, updates) {
  var oldUpdates = {}
  if (_layers[id]) {
    for (var key in updates) {
      oldUpdates[key] = _layers[id][key]
    }
  } else {
    oldUpdates = updates
  }
  if (undos.length === UNDO_LENGTH) {
    undos.shift()
  }
  undos.push({id: id, updates: oldUpdates})
}

function undo() {
  var op = undos[undos.length - 1]
  if (_layers[op.id]) {
    if (_.has(op.updates, 'geojson')) {
      _layers[op.id].mapLayer.clearLayers()
      _layers[op.id].mapLayer = false
    }
    _layers[op.id] = assign({}, _layers[op.id], op.updates)
  } else {
    _layers[op.id] = op.updates
  }
  undos.pop()
}

var LayerStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of layers.
   * @return {object}
   */
  getAll: function() {
    return _layers
  },

  /**
   * Get all selected layers
   * @return {object}
   */
  getAllSelected: function() {
    var selected = {}
    for (var id in _layers) {
      if (_layers[id].selected) {
        selected[id] = _layers[id]
      }
    }
    return selected
  },

  getById: function(_id) {
    for (var id in _layers) {
      if (id === _id) return _layers[id]
    }
    return false
  },

  /**
   * Get all selected layers
   * @return {object}
   */
  getSelected: function() {
    return _.findWhere(_layers, {selected: true})
  },

  /**
   * Get all selected layers
   * @return {object}
   */
  getUndoLength: function() {
    return undos.length
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT)
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback)
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  }

})

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {
    case LayerConstants.LAYER_CREATE:
      create()
      LayerStore.emitChange()
      break

    case LayerConstants.LAYER_UPDATE:
      update(action.id, action.update)
      LayerStore.emitChange()
      break

    case LayerConstants.LAYER_UPDATE_LIST:
      updateList(action.updates)
      LayerStore.emitChange()
      break

    case LayerConstants.LAYER_IMPORT:
      importLayer(action.layer)
      LayerStore.emitChange()
      break

    case LayerConstants.LAYER_REORDER:
      reorder(action.from, action.to)
      LayerStore.emitChange()
      break

    case LayerConstants.LAYER_UNDO:
      undo()
      LayerStore.emitChange()
      break

    case LayerConstants.LAYER_DESTROY:
      destroy(action.id)
      LayerStore.emitChange()
      break

    case LayerConstants.LAYER_DESTROY_SELECTED:
      destroySelected()
      LayerStore.emitChange()
      break

    default:
      // no op
  }
})

module.exports = LayerStore