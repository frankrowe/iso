/*
 * Layer Store
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var LayerConstants = require('../constants/LayerConstants');
var assign = require('object-assign');
var DefaultLayer = require('../utils/DefaultLayer')

var CHANGE_EVENT = 'change';

var _layers = {};

var undos = []

var UNDO_LENGTH = 10
/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */
function create() {
  var layer = DefaultLayer.generate()
  layer.order = Object.keys(_layers).length + 1
  _layers[layer.id] = layer
}

/**
 * Update a TODO item.
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
    //_layers[id] = assign({}, _layers[id], updates[id])
  }
}

/**
 * Update all of the TODO items with the same object.
 *     the data to be updated.  Used to mark all TODOs as completed.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.
 */
function updateAll(updates) {
  for (var id in _layers) {
    update(id, updates);
  }
}

/**
 * Import a layer.
 * @param  {object} geojson
 * @param {object} the layer name
 */
function importLayer(layer) {
  layer.order = Object.keys(_layers).length + 1
  _layers[layer.id] = layer
}

/**
 * Delete a TODO item.
 * @param  {string} id
 */
function destroy(id) {
  _layers[id].mapLayer.clearLayers()
  delete _layers[id];
}

/**
 * Delete all the completed TODO items.
 */
function destroySelected() {
  for (var id in _layers) {
    if (_layers[id].selected) {
      destroy(id);
    }
  }
}

function reorder(from, to) {
  var orderHash = {}
  for (var id in _layers) {
    orderHash[_layers[id].order] = _layers[id]
  }
  var orders = _.pluck(_layers, 'order')
  orders.splice(to, 0, orders.splice(from, 1)[0])
  orders.forEach(function(order, idx) {
    orderHash[order].order = idx + 1
  })
  for (var id in _layers) {
    if (_layers[id].vector) {
      _layers[id].mapLayer.clearLayers()
    }
    _layers[id].mapLayer = false
  }
}

function addUndo(id, updates) {
  var oldUpdates = {}
  for (var key in updates) {
    oldUpdates[key] = _layers[id][key]
  }
  if (undos.length === UNDO_LENGTH) {
    undos.shift()
  }
  undos.push({id: id, updates: oldUpdates})
}

function undo() {
  var op = undos[undos.length - 1]
  console.log(op)
  if (_.has(op.updates, 'geojson')) {
    _layers[op.id].mapLayer.clearLayers()
    _layers[op.id].mapLayer = false
  }
  _layers[op.id] = assign({}, _layers[op.id], op.updates)
  undos.pop()
}

var LayerStore = assign({}, EventEmitter.prototype, {

  /**
   * Tests whether all the remaining TODO items are marked as completed.
   * @return {boolean}
   */
  areAllComplete: function() {
    for (var id in _layers) {
      if (!_layers[id].complete) {
        return false;
      }
    }
    return true;
  },

  /**
   * Get the entire collection of layers.
   * @return {object}
   */
  getAll: function() {
    return _layers;
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
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    case LayerConstants.LAYER_CREATE:
      create();
      LayerStore.emitChange();
      break;

    case LayerConstants.LAYER_UPDATE:
      update(action.id, action.update);
      LayerStore.emitChange();
      break;

    case LayerConstants.LAYER_UPDATE_LIST:
      updateList(action.updates);
      LayerStore.emitChange();
      break;

    case LayerConstants.LAYER_IMPORT:
      importLayer(action.layer);
      LayerStore.emitChange();
      break;

    case LayerConstants.LAYER_REORDER:
      reorder(action.from, action.to);
      LayerStore.emitChange();
      break;

    case LayerConstants.LAYER_UNDO:
      undo();
      LayerStore.emitChange();
      break;

    case LayerConstants.TODO_TOGGLE_COMPLETE_ALL:
      if (LayerStore.areAllComplete()) {
        updateAll({complete: false});
      } else {
        updateAll({complete: true});
      }
      LayerStore.emitChange();
      break;

    case LayerConstants.TODO_UNDO_COMPLETE:
      update(action.id, {complete: false});
      LayerStore.emitChange();
      break;

    case LayerConstants.TODO_COMPLETE:
      update(action.id, {complete: true});
      LayerStore.emitChange();
      break;

    case LayerConstants.TODO_UPDATE_TEXT:
      text = action.text.trim();
      if (text !== '') {
        update(action.id, {text: text});
        LayerStore.emitChange();
      }
      break;

    case LayerConstants.LAYER_DESTROY:
      destroy(action.id);
      LayerStore.emitChange();
      break;

    case LayerConstants.LAYER_DESTROY_SELECTED:
      destroySelected();
      LayerStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = LayerStore;