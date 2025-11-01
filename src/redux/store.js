import { createStore, combineReducers } from 'redux';
import { formBuilderReducer } from './reducers';
const rootReducer = combineReducers({
  form: formBuilderReducer,
});
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;