/*eslint-disable semi*/
import * as Reflux from 'reflux';

var ProjectActions = Reflux.createActions([
  'load',
  'loadSuccess',
  'loadError',
  'create',
  'createSuccess',
  'createError',
  'loadProject',
  'update',
  'updateSuccess',
  'updateError',
  'createEnvironment',
  'deleteEnvironment',
  'createToken',
  'deleteToken',
  'disableToken'
]);

export default ProjectActions;
