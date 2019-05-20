import * as Reflux from 'reflux';

var EventActions = Reflux.createActions([
  'search',
  'searchSuccess',
  'searchError',
  'get',
  'getSuccess',
  'getError',
  'reset',
]);

export default EventActions;
