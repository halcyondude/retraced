import * as _ from 'lodash';
import * as request from 'superagent/lib/client';
import * as Reflux from 'reflux';

import EventActions from '../actions/EventActions';
import AlertActions from '../actions/AlertActions';
import SessionStore from './SessionStore';
import Errors from '../services/Errors';

const blankSearch = {
  offset: 0,
  length: 0,
  totalResultCount: 0,
  events: [],
  eventsById: {},
};

var defaultState = {
  projectId: '',
  activeSearch: _.clone(blankSearch),
};

var EventStore = Reflux.createStore({
  listenables: [EventActions],

  init: function () {
    this.state = _.clone(defaultState);
  },

  getInitialState: function () {
    return this.state;
  },

  onReset: function () {
    this.state = _.clone(defaultState);
  },

  onGet: function (projectId, eventId, cb) {
    if (cb) {
      const ev = this.state.activeSearch.eventsById[eventId];
      cb(null, ev);
    }
  },

  onSearch: function (searchParams, projectId) {
    this.state.projectId = projectId;

    if (!SessionStore.isLoggedIn()) {
      return;
    }

    const endpoint = window.RETRACED.apiEndpoint;
    const accessToken = SessionStore.session.accessToken;

    request
      .post(`${endpoint}/project/${projectId}/events/search`)
      .set('Authorization', accessToken)
      .set('Accept', 'application/json')
      .query({ 'environment_id': SessionStore.selectedEnvironment() })
      .send(searchParams)
      .end((err, resp) => {
        if (err) {
          console.log(err);
          var errMsg = Errors.toString(err, resp);
          AlertActions.error('Error searching for events', errMsg);
          return;
        }

        this.state.activeSearch.totalResultCount = resp.body.total_hits;
        if (!searchParams.query.offset) {
          this.state.activeSearch.offset = 0;
        } else {
          this.state.activeSearch.offset = searchParams.query.offset;
        }

        this.state.activeSearch.events = resp.body.events;
        this.state.activeSearch.eventsById = _.keyBy(resp.body.events, "id");
        this.trigger(this.state.activeSearch);
      });
  },
});

export default EventStore;
