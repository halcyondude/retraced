import * as _ from 'lodash';
import * as request from 'superagent/lib/client';
import * as Reflux from 'reflux';

import ObjectActions from '../actions/ObjectActions';
import SessionActions from '../actions/SessionActions';
import SessionStore from './SessionStore';
import Errors from '../services/Errors';

var defaultState = {
  loaded: false,
  objects: [],
  projectId: null
};

var ObjectStore = Reflux.createStore({
  listenables: [ObjectActions],

  init: function() {
    this.objects = _.cloneDeep(defaultState);
  },

  getInitialState: function() {
    return this.objects;
  },

  onLoad: function(projectId, cb) {
    if (!SessionStore.isLoggedIn()) {
      return;
    }

    request
      .get(window.RETRACED.apiEndpoint + '/project/' + projectId + '/targets')
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
          this.objects.loaded = true;
          this.objects.objects = res.body.targets;
          this.objects.projectId = projectId;
          this.trigger(this.objects);
          cb(null);
        }
      }, this));
  },

  hasObjects: function() {
    return this.objects.loaded && this.objects.objects.length > 0;
  },

  isLoaded: function() {
    return this.objects.loaded;
  },

  getObjectsForProject: function(projectId) {
    if (this.objects.projectId !== projectId) {
      return null;
    }
    return this.objects.objects;
  }
});

export default ObjectStore;
