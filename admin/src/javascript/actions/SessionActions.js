import * as Reflux from 'reflux';

var SessionActions = Reflux.createActions([
  'login',
  'logout',
  'logoutSuccess',
  'logoutError',
  'unauthorized',
  'selectEnvironment',
]);

export default SessionActions;
