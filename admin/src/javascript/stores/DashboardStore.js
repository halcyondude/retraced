import * as _ from 'lodash';
import * as request from 'superagent/lib/client';
import * as Reflux from 'reflux';
import * as moment from 'moment-timezone';

import DashboardActions from '../actions/DashboardActions';
import AlertActions from '../actions/AlertActions';
import SessionStore from './SessionStore';
import Errors from '../services/Errors';

var daysInGraph = 7;

var defaultState = {
  cache: {},
};

var DashboardStore = Reflux.createStore({
  listenables: [DashboardActions],

  init: function() {
    this.state = _.clone(defaultState);
  },

  getInitialState: function() {
    return this.state;
  },

  onReset: function() {
    this.state = _.clone(defaultState);
  },

  onLoad: function(projectId) {
    if (!SessionStore.isLoggedIn()) {
      return;
    }

    const endpoint = window.RETRACED.apiEndpoint;
    const accessToken = SessionStore.session.accessToken;

    request
    .get(`${endpoint}/project/${projectId}/dashboard`)
    .set('Authorization', accessToken)
    .set('Accept', 'application/json')
    .query({'environment_id': SessionStore.selectedEnvironment()})
    .end((err, resp) => {
      if (err) {
        var errMsg = Errors.toString(err, resp);
        AlertActions.error('Error retreiving dasbboard', errMsg);
        return;
      }

      this.state.cache[`${projectId}.${SessionStore.selectedEnvironment()}`] = resp.body.dashboard;
    });
  },

  getLabels: function() {
    const labels = [];
    for (let i = daysInGraph; i >= 0; i--) {
      labels.push(moment().subtract(i, 'days').format('L'));
    }

    return labels;
  },

  getData: function(graph, projectId) {
    if (!this.state.cache[`${projectId}.${SessionStore.selectedEnvironment()}`]) {
      return this.getDefaultChart();
    }

    switch (graph) {
    case 'viewer_sessions':
      return this.getViewerSessions(projectId);
    case 'searches':
      return this.getSearches(projectId);
    case 'active_users':
      return this.getActiveUsers(projectId);
    case 'active_groups':
      return this.getActiveGroups(projectId);
    default:
      return this.getDefaultChart();
    }
  },

  getDefaultChart() {
    return {
      labels: this.getLabels(),
      datasets: [
        {
          label: 'Count',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [0, 0, 0, 0, 0, 0, 0],
          spanGaps: false,
        }
      ]
    };
  },

  getActiveGroups(projectId) {
    const data = _.map(this.getLabels(), function() {
      return 0;
    });

  
    _.forEach(this.state.cache[`${projectId}.${SessionStore.selectedEnvironment()}`]['active_groups'], function(e) {
      const nowDate = new Date().getTime();
      const eventDate = new Date(new moment(e.start_time).startOf('day')).getTime();

      let daysAgo = Math.floor((nowDate - eventDate) / (24 * 60 * 60 * 1000));

      // this is just simply wrong to do.  the graph is incorrect because of this.  timezones!
      daysAgo = daysAgo === -1 ? 0 : daysAgo;

      data[daysInGraph - daysAgo] += parseInt(e.count);
    });

    return {
      labels: this.getLabels(),
      datasets: [
        {
          label: 'Count',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: data,
          spanGaps: false,
        }
      ]
    };    
  },

  getActiveUsers(projectId) {
    const data = _.map(this.getLabels(), function() {
      return 0;
    });
  
    _.forEach(this.state.cache[`${projectId}.${SessionStore.selectedEnvironment()}`]['active_users'], function(e) {
      const nowDate = new Date().getTime();
      const eventDate = new Date(new moment(e.start_time).startOf('day')).getTime();

      let daysAgo = Math.floor((nowDate - eventDate) / (24 * 60 * 60 * 1000));

      // this is just simply wrong to do.  the graph is incorrect because of this.  timezones!
      daysAgo = daysAgo === -1 ? 0 : daysAgo;

      data[daysInGraph - daysAgo] += parseInt(e.count);
    });

    return {
      labels: this.getLabels(),
      datasets: [
        {
          label: 'Count',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: data,
          spanGaps: false,
        }
      ]
    };    
  },

  getViewerSessions(projectId) {
    const data = _.map(this.getLabels(), function() {
      return 0;
    });
  
    _.forEach(this.state.cache[`${projectId}.${SessionStore.selectedEnvironment()}`]['viewer_session'], function(e) {
      const nowDate = new Date().getTime();
      const eventDate = new Date(new moment(e.start_time).startOf('day')).getTime();

      let daysAgo = Math.floor((nowDate - eventDate) / (24 * 60 * 60 * 1000));

      // this is just simply wrong to do.  the graph is incorrect because of this.  timezones!
      daysAgo = daysAgo === -1 ? 0 : daysAgo;

      data[daysInGraph - daysAgo] += parseInt(e.count);
    });

    return {
      labels: this.getLabels(),
      datasets: [
        {
          label: 'Count',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: data,
          spanGaps: false,
        }
      ]
    };
  },

  getSearches(projectId) {
    const data = _.map(this.getLabels(), function() {
      return 0;
    });
  
    _.forEach(this.state.cache[`${projectId}.${SessionStore.selectedEnvironment()}`]['viewer_search'], function(e) {
      const nowDate = new Date().getTime();
      const eventDate = new Date(new moment(e.start_time).startOf('day')).getTime();

      let daysAgo = Math.floor((nowDate - eventDate) / (24 * 60 * 60 * 1000));

      // this is just simply wrong to do.  the graph is incorrect because of this.  timezones!
      daysAgo = daysAgo === -1 ? 0 : daysAgo;

      data[daysInGraph - daysAgo] += parseInt(e.count);
    });


    return {
      labels: this.getLabels(),
      datasets: [
        {
          label: 'Count',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: data,
          spanGaps: false,
        }
      ]
    };
  }
});

export default DashboardStore;
