import * as _ from 'lodash';
import * as request from 'superagent/lib/client';
import * as Reflux from 'reflux';

import FilterActions from '../actions/FilterActions';
import SessionActions from '../actions/SessionActions';
import SessionStore from './SessionStore';
import Errors from '../services/Errors';

var defaultState = {
  loaded: false,
  filters: [],
  projectId: null
};

var FilterStore = Reflux.createStore({
  listenables: [FilterActions],

  init: function() {
    this.filters = _.cloneDeep(defaultState);
  },

  getInitialState: function() {
    return this.filters;
  },

  ensureLoggedIn: function() {
    return SessionStore.isLoggedIn();
  },

  ensureHaveProjectId: function() {
    return this.ensureLoggedIn()
      && this.filters.projectId
      && this.filters.projectId.length !== 0;
  },

  callApi: function(url, method, data, callback, errCallback, trigger=true) {
    let r = request[method](window.RETRACED.apiEndpoint + url)
      .set('Authorization', SessionStore.session.accessToken)
      .set('Accept', 'application/json');

    if (data) {
      r = r.send(data);
    }

    r.end((err, res) => {
      if (err) {
        if (err.status === 401) {
          SessionActions.unauthorized();
          return;
        }
        errCallback(Errors.toString(err, res), err, res);
      } else {
        this.filters.filters = res.body.filters;
        if (trigger) {
          this.trigger(this.filters);
        }
        callback(this.filters.filters);
      }
    });
  },

  onLoad: function(projectId) {
    if (!this.ensureLoggedIn()) {
      return;
    }

    this.callApi(
      '/project/' + projectId + '/filters',
      'get',
      null,
      (filters) => {
        this.filters.loaded = true;
        this.filters.projectId = projectId;
        this.trigger(this.filters);
        FilterActions.loadSuccess(filters);
      },
      FilterActions.loadError,
      false
    );
  },

  onCreate: function(name, conditions) {
    if (!this.ensureHaveProjectId()) {
      return;
    }

    this.callApi(
      '/project/' + this.filters.projectId + '/filter',
      'post',
      {name, conditions},
      FilterActions.createSuccess,
      FilterActions.createError
    );
  },

  onUpdate: function(filter) {
    if (!this.ensureHaveProjectId()) {
      return;
    }

    this.callApi(
      '/project/' + this.filters.projectId + '/filter/' + filter.id,
      'put',
      filter,
      FilterActions.updateSuccess,
      FilterActions.updateError
    );
  },

  onDelete: function(filterId) {
    if (!this.ensureHaveProjectId()) {
      return;
    }

    this.callApi(
      '/project/' + this.filters.projectId + '/filter/' + filterId,
      'delete',
      null,
      FilterActions.deleteSuccess,
      FilterActions.deleteError
    );
  },

  hasFilters: function() {
    return this.filters.loaded && this.filters.filters.length > 0;
  },

  isLoaded: function() {
    return this.filters.loaded;
  },

  getFiltersForProject: function(projectId) {
    if (this.filters.projectId !== projectId) {
      return null;
    }
    return this.filters.filters;
  },

  getFilterById: function(filterId, projectId) {
    if (this.filters.projectId !== projectId) {
      return null;
    }
    return _.find(this.filters.filters, {id: filterId});
  }
});

export default FilterStore;
