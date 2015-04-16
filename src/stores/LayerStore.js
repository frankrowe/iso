/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var LayerConstants = require('../constants/LayerConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _layers = {};

/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */
function create() {
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _layers[id] = {
    id: id,
    name: 'New Layer',
    fileName: '',
    //checkbox
    enabled: true,
    //layer selected in layer list
    selected: true,
    //causes map to zoom to this layer
    zoomTo: true,
    //true when layer is currently being edited
    editing: false,
    vector: true,
    geojson: {
      "type": "FeatureCollection",
      "features": []
    }
  }
}

/**
 * Update a TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  _layers[id] = assign({}, _layers[id], updates);
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
 * Delete a TODO item.
 * @param  {string} id
 */
function destroy(id) {
  delete _layers[id];
}

/**
 * Delete all the completed TODO items.
 */
function destroyCompleted() {
  for (var id in _layers) {
    if (_layers[id].complete) {
      destroy(id);
    }
  }
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
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function() {
    console.log(_layers)
    return _layers;
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
    case LayerConstants.TODO_CREATE:
      //text = action.text.trim();
      //if (text !== '') {
        create();
        LayerStore.emitChange();
      //}
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

    case LayerConstants.TODO_DESTROY:
      destroy(action.id);
      LayerStore.emitChange();
      break;

    case LayerConstants.TODO_DESTROY_COMPLETED:
      destroyCompleted();
      LayerStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = LayerStore;