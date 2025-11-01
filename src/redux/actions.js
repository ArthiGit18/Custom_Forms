export const ADD_FIELD = 'ADD_FIELD';
export const UPDATE_FIELD = 'UPDATE_FIELD';
export const REMOVE_FIELD = 'REMOVE_FIELD';
export const SET_DRAGGING_FIELD = 'SET_DRAGGING_FIELD';
export const REORDER_FIELDS = 'REORDER_FIELDS';
export const addField = (fieldData) => ({
  type: ADD_FIELD,
  payload: fieldData,
});
export const updateField = (id, updates) => ({
  type: UPDATE_FIELD,
  payload: { id, updates },
});
export const removeField = (id) => ({
  type: REMOVE_FIELD,
  payload: id,
});
export const setDraggingField = (fieldType) => ({
  type: SET_DRAGGING_FIELD,
  payload: fieldType,
});
export const reorderFields = (sourceIndex, destinationIndex) => ({
  type: REORDER_FIELDS,
  payload: { sourceIndex, destinationIndex },
});