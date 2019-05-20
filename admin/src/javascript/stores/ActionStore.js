import * as _ from 'lodash';
import * as request from 'superagent/lib/client';
import * as Reflux from 'reflux';

import ActionActions from '../actions/ActionActions';
import SessionActions from '../actions/SessionActions';
import SessionStore from './SessionStore';
import Errors from '../services/Errors';

var defaultState = {
  loaded: false,
  actions: [],
  projectId: null
};

var ActionStore = Reflux.createStore({
  listenables: [ActionActions],

  init: function() {
    this.actions = _.cloneDeep(defaultState);
  },

  getInitialState: function() {
    return this.actions;
  },

  onUpdate: function(projectId, actionId, displayTemplate, cb) {
    if (!SessionStore.isLoggedIn()) {
      return;
    }

    /*eslint-disable camelcase*/
    request
      .put(window.RETRACED.apiEndpoint + '/project/' + projectId + '/action/' + actionId)
      .set('Authorization', SessionStore.session.accessToken)
      .set('Accept', 'application/json')
      .query({'environment_id': SessionStore.selectedEnvironment()})
      .send({
        display_template: displayTemplate
      })
      .end(_.bind((err, res) => {
        if (err) {
          if (err.status === 401) {
            SessionActions.unauthorized();
            return;
          }
          var errMsg = Errors.toString(err, res);
          cb(errMsg);
        } else {
          cb(null, res.body.action);
        }
      }));
  },

  onGet: function(projectId, actionId, cb) {
    if (!SessionStore.isLoggedIn()) {
      return;
    }

    // Always get it from the API
    request
      .get(window.RETRACED.apiEndpoint + '/project/' + projectId + '/action/' + actionId)
      .set('Authorization', SessionStore.session.accessToken)
      .set('Accept', 'application/json')
      .query({'environment_id': SessionStore.selectedEnvironment()})
      .end(_.bind((err, res) => {
        if (err) {
          if (err.status === 401) {
            SessionActions.unauthorized();
            return;
          }
          var errMsg = Errors.toString(err, res);
          cb(errMsg);
        } else {
          cb(null, res.body.action);
        }
      }));
  },

  onLoad: function(projectId, cb) {
    if (!SessionStore.isLoggedIn()) {
      return;
    }

    request
      .get(window.RETRACED.apiEndpoint + '/project/' + projectId + '/actions')
      .set('Authorization', SessionStore.session.accessToken)
      .set('Accept', 'application/json')
      .query({'environment_id': SessionStore.selectedEnvironment()})
      .end(_.bind(function(err, res) {
        if (err) {
          if (err.status === 401) {
            SessionActions.unauthorized();
            return;
          }
          var errMsg = Errors.toString(err, res);
          cb(errMsg);
        } else {
          this.actions.loaded = true;
          this.actions.actions = res.body.actions;
          this.actions.projectId = projectId;
          this.trigger(this.actions);
          cb(null);
        }
      }, this));
  },

  hasActions: function() {
    return this.actions.loaded && this.actions.actions.length > 0;
  },

  isLoaded: function() {
    return this.actions.loaded;
  },

  getActionsForProject: function(projectId) {
    if (this.actions.projectId !== projectId) {
      return null;
    }
    return this.actions.actions;
  }
});

export default ActionStore;
