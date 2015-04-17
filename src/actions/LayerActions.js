var AppDispatcher = require('../dispatcher/AppDispatcher');
var LayerConstants = require('../constants/LayerConstants');

var LayerActions = {

  /**
   * @param  {string} text
   */
  create: function() {
    AppDispatcher.dispatch({
      actionType: LayerConstants.LAYER_CREATE
    });
  },

  importLayer: function(layer) {
    AppDispatcher.dispatch({
      actionType: LayerConstants.LAYER_IMPORT,
      layer: layer
    });
  },

  destroySelected: function() {
    AppDispatcher.dispatch({
      actionType: LayerConstants.LAYER_DESTROY_SELECTED
    });
  },

  /**
   * @param  {string} id
   */
  destroy: function(id) {
    AppDispatcher.dispatch({
      actionType: LayerConstants.LAYER_DESTROY,
      id: id
    });
  },

  reorder: function(from, to) {
    AppDispatcher.dispatch({
      actionType: LayerConstants.LAYER_REORDER,
      from: from,
      to: to
    });
  },

  undo: function(from, to) {
    AppDispatcher.dispatch({
      actionType: LayerConstants.LAYER_UNDO
    });
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
    });
  },

  /**
   * @param  {object} An object literal containing only the data to be
   *     updated
   */
  updateList: function(updates) {
    console.log('updateList Action', updates)
    AppDispatcher.dispatch({
      actionType: LayerConstants.LAYER_UPDATE_LIST,
      updates: updates
    });
  },

  /**
   * @param  {string} id The ID of the ToDo item
   * @param  {string} text
   */
  updateText: function(id, text) {
    AppDispatcher.dispatch({
      actionType: LayerConstants.TODO_UPDATE_TEXT,
      id: id,
      text: text
    });
  },

  /**
   * Toggle whether a single ToDo is complete
   * @param  {object} todo
   */
  toggleComplete: function(todo) {
    var id = todo.id;
    var actionType = todo.complete ?
        LayerConstants.TODO_UNDO_COMPLETE :
        LayerConstants.TODO_COMPLETE;

    AppDispatcher.dispatch({
      actionType: actionType,
      id: id
    });
  },

  /**
   * Mark all ToDos as complete
   */
  toggleCompleteAll: function() {
    AppDispatcher.dispatch({
      actionType: LayerConstants.TODO_TOGGLE_COMPLETE_ALL
    });
  },

  /**
   * Delete all the completed ToDos
   */
  destroyCompleted: function() {
    AppDispatcher.dispatch({
      actionType: LayerConstants.TODO_DESTROY_COMPLETED
    });
  }

};

module.exports = LayerActions;