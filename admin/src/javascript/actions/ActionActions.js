import * as Reflux from 'reflux';

var ActionActions = Reflux.createActions([
  'load',
  'loadSuccess',
  'loadError',
  'get',
  'getSuccess',
  'getError',
  'update',
  'updateSuccess',
  'updateError'
]);

export default ActionActions;
