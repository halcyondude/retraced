import * as Reflux from 'reflux';

var FilterActions = Reflux.createActions([
  'load',
  'loadSuccess',
  'loadError',
  'create',
  'createSuccess',
  'createError',
  'update',
  'updateSuccess',
  'updateError',
  'delete',
  'deleteSuccess',
  'deleteError'
]);

export default FilterActions;
