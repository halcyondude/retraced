import * as request from 'superagent/lib/client';
import * as uuid from 'node-uuid';
import * as Reflux from 'reflux';

import SessionActions from '../actions/SessionActions';
import EventActions from '../actions/EventActions';
import Errors from '../services/Errors';

var DB = function () {
  this.store = window.localStorage;
};

DB.prototype.getItem = function (key) {
  return this.store.getItem(key);
};

DB.prototype.setItem = function (key, value) {
  return this.store.setItem(key, value);
};

DB.prototype.clear = function () {
  window.localStorage.clear();
  window.sessionStorage.clear();
};

var SessionStore = Reflux.createStore({
  listenables: [SessionActions],

  init: function () {
    this.initStore();
    this.session = this.getDefaultState();
    var data = this.getSessionData();
    if (data && data.accessToken) {
      this.session = data;
      this.startSession();
      this.setTimezone();
    } else {
      this.setSessionData(this.session);
      this.startAnonSession();
    }
    this.session.loaded = true;
  },

  getInitialState: function () {
    return this.session;
  },

  onUnauthorized: function () {
    this.trigger(this.session);
  },

  onLogin: function (opts) {
    this.db = new DB();
    request.post(window.RETRACED.apiEndpoint + '/user/login')
      .send({ external_auth: opts.externalAuthPayload })
      .end(function (err, res) {
        if (err) {
          this.updateSession();
          return;
        }

        // TODO(zhaytee): Report error
        if (res.statusCode < 200 || res.statusCode >= 300) {
          this.updateSession();
          return;
        }

        this.session.user = res.body.user;
        this.session.accessToken = res.body.token;
        this.startSession();
        this.updateSession();
        this.setTimezone();
        if (opts.cb) {
          opts.cb();
        }
      }.bind(this));
  },

  onLogout: function () {
    this.db.clear();
    this.setSessionId(uuid.v4());
    this.session = this.getDefaultState();
    this.session.loaded = true;
    this.startAnonSession();
    this.updateSession();
    SessionActions.logoutSuccess();
    EventActions.reset();
    return this.session;
  },

  onSelectEnvironment: function (environmentId) {
    this.session.selectedEnvironment = environmentId;
    this.updateSession();
  },

  isLoaded: function () {
    return this.session.loaded;
  },

  selectedEnvironment: function () {
    return this.session.selectedEnvironment;
  },

  isLoggedIn: function () {
    return !!this.session.accessToken;
  },

  initStore: function () {
    this.db = new DB(window.localStorage.hasOwnProperty('retraced.sessionid'));
  },

  getDefaultState: function () {
    return {
      id: this.getSessionId(),
      loaded: false,
      user: null,
      accessToken: null,
      selectedEnvironment: null
    };
  },

  getSessionId: function () {
    var sessionId = this.db.getItem('retraced.sessionid');
    if (!sessionId) {
      sessionId = uuid.v4();
      this.setSessionId(sessionId);
    }
    return sessionId;
  },

  setSessionId: function (sessionId) {
    this.db.setItem('retraced.sessionid', sessionId);
  },

  getSessionData: function () {
    var data = this.db.getItem('retraced.data');
    if (data) {
      return JSON.parse(data);
    }
    return null;
  },

  setSessionData: function (data) {
    this.db.setItem('retraced.data', JSON.stringify(data));
  },

  updateSession: function () {
    this.setSessionData(this.session);
    this.trigger(this.session);
  },

  startSession: function () {
  },

  startAnonSession: function () {
  },

  getUser() {
    return this.session.user;
  },

  setTimezone() {
    // Check if the user's timezone needs to be updated.
    // This works for IE11 and green browsers. Use moment-timezone.guess()
    // if other browsers need to be supported.
    let tz;
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    }
    catch (e) {
      return;
    }
    request.put(window.RETRACED.apiEndpoint + '/user/' + this.session.user.id)
      .set('Authorization', this.session.accessToken)
      .set('Content-Type', 'application/json')
      .send({timezone: tz})
      .end(function (err, res) {
        if (err) {
          console.log(Errors.toString(err, res));
          return;
        }
        this.session.user.timezone = tz;
        this.updateSession();
      }.bind(this));
  },
});

export default SessionStore;
