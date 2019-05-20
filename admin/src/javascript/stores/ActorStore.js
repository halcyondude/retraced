import * as _ from 'lodash';
import * as request from 'superagent/lib/client';
import * as Reflux from 'reflux';

import ActorActions from '../actions/ActorActions';
import SessionActions from '../actions/SessionActions';
import SessionStore from './SessionStore';
import Errors from '../services/Errors';

var defaultState = {
  loaded: false,
  actors: [],
  projectId: null
};

var ActorStore = Reflux.createStore({
  listenables: [ActorActions],

  init: function() {
    this.actors = _.cloneDeep(defaultState);
  },

  getInitialState: function() {
    return this.actors;
  },

  onGet: function(projectId, actorId, cb) {
    if (!SessionStore.isLoggedIn()) {
      return;
    }

    // Always get it from the API
    request
      .get(window.RETRACED.apiEndpoint + '/project/' + projectId + '/actor/' + actorId)
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
          cb(null, res.body.actor);
        }
      }));
  },

  onLoad: function(projectId, cb) {
    if (!SessionStore.isLoggedIn()) {
      return;
    }

    request
      .get(window.RETRACED.apiEndpoint + '/project/' + projectId + '/actors')
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
          this.actors.loaded = true;
          this.actors.actors = res.body.actors;
          this.actors.projectId = projectId;
          this.trigger(this.actors);
          cb(null);
        }
      }, this));
  },

  hasActors: function() {
    return this.actors.loaded && this.actors.actors.length > 0;
  },

  isLoaded: function() {
    return this.actors.loaded;
  },

  getActorsForProject: function(projectId) {
    if (this.actors.projectId !== projectId) {
      return null;
    }
    return this.actors.actors;
  }
});

export default ActorStore;
