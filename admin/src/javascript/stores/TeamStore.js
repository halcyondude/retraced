import * as _ from 'lodash';
import * as request from 'superagent/lib/client';
import * as Reflux from 'reflux';

import TeamActions from '../actions/TeamActions';
import SessionActions from '../actions/SessionActions';
import SessionStore from './SessionStore';
import Errors from '../services/Errors';

function handleTeamPromise(p, projectId, cb) {
  p.end(_.bind(function(err, res) {
    if (err) {
      if (err.status === 401) {
        SessionActions.unauthorized();
        return;
      }
      var errMsg = Errors.toString(err, res);
      cb(errMsg);
    } else {
      this.team.loaded = true;
      this.team.members = res.body.group.members;
      this.team.invitations = res.body.group.invitations;
      this.team.projectId = projectId;
      this.trigger(this.team);
      cb(null);
    }
  }, this));
}

var defaultState = {
  loaded: false,
  members: [],
  invites: [],
  projectId: null
};

var ActorStore = Reflux.createStore({
  listenables: [TeamActions],

  init: function() {
    this.team = _.cloneDeep(defaultState);
  },

  getInitialState: function() {
    return this.team;
  },

  onGetInvitation: function(inviteId) {
    request
      .get(window.RETRACED.apiEndpoint + '/invitation/' + inviteId)
      .set('Authorization', SessionStore.session.accessToken)
      .set('Accept', 'application/json')
      .end(_.bind(function(err, res) {
        if (err) {
          var errMsg = Errors.toString(err, res);
          TeamActions.getInvitationError(errMsg, err, res);
        } else {
          TeamActions.getInvitationSuccess(res.body.invitation);
        }
      }, this));
  },

  onInvite: function(projectId, email) {
    if (!SessionStore.isLoggedIn()) {
      return;
    }
    if (projectId !== this.team.projectId) {
      TeamActions.inviteError('Incorrect project loaded');
      return;
    }

    request
      .post(window.RETRACED.apiEndpoint + '/project/' + projectId + '/invite')
      .set('Authorization', SessionStore.session.accessToken)
      .send({
        'email': email
      })
      .end(_.bind(function(err, res) {
        if (err) {
          if (err.status === 401) {
            SessionActions.unauthorized();
            return;
          }
          var errMsg = Errors.toString(err, res);
          TeamActions.inviteError(errMsg, err, res);
        } else {
          this.team.invitations.push(res.body.invitation);
          TeamActions.inviteSuccess(res.body.invitation);
        }
      }, this));
  },

  onLoad: function(projectId, cb) {
    if (!SessionStore.isLoggedIn()) {
      return;
    }

    const p = request
      .get(window.RETRACED.apiEndpoint + '/project/' + projectId + '/group')
      .set('Authorization', SessionStore.session.accessToken)
      .set('Accept', 'application/json');
    handleTeamPromise.call(this, p, projectId, cb);
  },

  onDeleteTeamMember: function(projectId, userId, cb) {
    if (!SessionStore.isLoggedIn()) {
      return;
    }

    const p = request
      .delete(window.RETRACED.apiEndpoint + '/project/' + projectId + '/group/' + userId)
      .set('Authorization', SessionStore.session.accessToken)
      .set('Accept', 'application/json');
    handleTeamPromise.call(this, p, projectId, cb);
  },

  onDisableTeamMember: function(projectId, userId, cb) {
    if (!SessionStore.isLoggedIn()) {
      return;
    }

    const p = request
      .post(window.RETRACED.apiEndpoint + '/project/' + projectId + '/group/' + userId + '/disable')
      .set('Authorization', SessionStore.session.accessToken)
      .set('Accept', 'application/json');
    handleTeamPromise.call(this, p, projectId, cb);
  },

  isLoaded: function() {
    return this.team.loaded;
  },

  getInvitationsForProject: function(projectId) {
    if (this.team.projectId !== projectId) {
      return null;
    }
    return this.team.invitations;
  },

  getMembersForProject: function(projectId) {
    if (this.team.projectId !== projectId) {
      return null;
    }
    return this.team.members;
  }
});

export default ActorStore;
