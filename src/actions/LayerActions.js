var AppDispatcher = require('../dispatcher/AppDispatcher')
  , LayerConstants = require('../constants/LayerConstants')

var LayerActions = {

  create: function() {
    AppDispatcher.dispatch({
      actionType: LayerConstants.LAYER_CREATE
    })
  },

  importLayer: function(layer) {
    AppDispatcher.dispatch({
      actionType: LayerConstants.LAYER_IMPORT,
      layer: layer
    })
  },

  destroySelected: function() {
    AppDispatcher.dispatch({
      actionType: LayerConstants.LAYER_DESTROY_SELECTED
    })
  },

  destroy: function(id) {
    AppDispatcher.dispatch({
      actionType: LayerConstants.LAYER_DESTROY,
      id: id
    })
  },

  reorder: function(from, to) {
    AppDispatcher.dispatch({
      actionType: LayerConstants.LAYER_REORDER,
      from: from,
      to: to
    })
  },

  undo: function(from, to) {
    AppDispatcher.dispatch({
      actionType: LayerConstants.LAYER_UNDO
    })
  },

  /**
   * @param  {string} id The ID of the Layer
   * @param  {object} An object literal containing only the data to be
   *     updated. 
   */
  update: function(id, update) {
    AppDispatcher.dispatch({
      actionType: LayerConstants.LAYER_UPDATE,
      id: id,
      update: update
    })
  },

  /**
   * @param  {object} An object literal containing only the data to be
   *     updated
   */
  updateList: function(updates) {
    AppDispatcher.dispatch({
      actionType: LayerConstants.LAYER_UPDATE_LIST,
      updates: updates
    })
  },

}

module.exports = LayerActions