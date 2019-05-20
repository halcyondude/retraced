import * as _ from 'lodash';
import * as request from 'superagent/lib/client';
import * as Reflux from 'reflux';

import ProjectActions from '../actions/ProjectActions';
import SessionActions from '../actions/SessionActions';
import SessionStore from './SessionStore';
import Errors from '../services/Errors';

function handleTokenPromise(p, projectId, cb) {
  p.end(_.bind(function(err, res) {
    if (err) {
      cb(Errors.toString(err, res));
    } else {
      _.find(this.projects.projects, {id: projectId}).tokens = res.body.tokens;
      this.trigger(this.projects);
      cb(null);
    }
  }, this));
}

var defaultState = {
  loaded: false,
  projects: [],
  currentProject: null
};

let ProjectStore = Reflux.createStore({
  listenables: [ProjectActions],

  init() {
    this.projects = _.cloneDeep(defaultState);
  },

  getInitialState() {
    return this.projects;
  },

  onLoadProject(projectId, cb) {
    if (!SessionStore.isLoggedIn()) {
      SessionActions.unauthorized();
      return;
    }
    request
      .get(window.RETRACED.apiEndpoint + '/project/' + projectId)
      .set('Authorization', SessionStore.session.accessToken)
      .set('Accept', 'application/json')
      .end(_.bind(function(err, res) {
        if (err) {
          if (err.status === 401) {
            SessionActions.unauthorized();
            return;
          }
          var errMsg = Errors.toString(err, res);
          cb(errMsg);
        } else {
          var project = _.find(this.projects.projects, {id: projectId});
          project.tokens = res.body.tokens;
          project.environments = res.body.environments;
          this.trigger(this.projects);
          if (cb) {
            cb(null, project.tokens);
          }
        }
      }, this));
  },

  onLoad() {
    if (!SessionStore.isLoggedIn()) {
      SessionActions.unauthorized();
      return;
    }
    request
      .get(window.RETRACED.apiEndpoint + '/projects')
      .set('Authorization', SessionStore.session.accessToken)
      .set('Accept', 'application/json')
      .end(_.bind(function(err, res) {
        if (err) {
          if (err.status === 401) {
            SessionActions.unauthorized();
            return;
          }
          var errMsg = Errors.toString(err, res);
          console.log(errMsg);
        } else {
          this.projects.loaded = true;
          this.projects.projects = res.body.projects;
          this.trigger(this.projects);
        }
      }, this));
  },

  onCreate(name, cb) {
    request
      .post(window.RETRACED.apiEndpoint + '/project')
      .set('Authorization', SessionStore.session.accessToken)
      .send({
        'name': name
      })
      .end(_.bind(function(err, res) {
        if (err) {
          if (err.status === 401) {
            SessionActions.unauthorized();
            return;
          }
          var fields = {
            'name': 'Project Name'
          };
          var errMsg = Errors.toString(err, res, fields);
          cb(errMsg, null);
        } else {
          this.projects.projects.push(res.body.project);
          this.trigger(this.projects);
          cb(null, res.body.project);
        }
      }, this));
  },

  hasProjects() {
    return this.projects.loaded && this.projects.projects.length > 0;
  },

  getFirstProject() {
    return this.projects.projects[0];
  },

  isLoaded() {
    return this.projects.loaded;
  },

  getProjectById(id) {
    return _.find(this.projects.projects, {id: id});
  },

  getTokensForProject(id) {
    var project = _.find(this.projects.projects, {id: id});
    if (!project || !project.tokens) {
      return null;
    }

    return project.tokens;
  },

  getEnvironmentsForProject(id) {
    var project = _.find(this.projects.projects, {id: id});
    if (!project || !project.environments) {
      return null;
    }

    return project.environments;
  },

  onDeleteEnvironment(projectId, environmentId, cb) {
    request
      .delete(window.RETRACED.apiEndpoint + '/project/' + projectId + '/environment/' + environmentId)
      .set('Authorization', SessionStore.session.accessToken)
      .end(_.bind(function(err, res) {
        if (err) {
          var errMsg = Errors.toString(err, res);
          cb(errMsg);
        } else {
          _.find(this.projects.projects, {id: projectId}).environments = res.body.environments;
          this.trigger(this.projects);
          cb(null);
        }
      }, this));
  },

  onCreateEnvironment(projectId, name, cb) {
    request
      .post(window.RETRACED.apiEndpoint + '/project/' + projectId + '/environment')
      .set('Authorization', SessionStore.session.accessToken)
      .set('Content-Type', 'application/json')
      .send({name: name})
      .end(_.bind(function(err, res) {
        if (err) {
          var errMsg = Errors.toString(err, res);
          cb(errMsg);
        } else {
          _.find(this.projects.projects, {id: projectId}).environments = res.body.environments;
          this.trigger(this.projects);
          cb(null);
        }
      }, this));
  },

  onCreateToken(projectId, name, environmentId, cb) {
    const p = request
      .post(window.RETRACED.apiEndpoint + '/project/' + projectId + '/token')
      .set('Authorization', SessionStore.session.accessToken)
      .set('Content-Type', 'application/json')
      .send({name: name, 'environment_id': environmentId});
    handleTokenPromise.call(this, p, projectId, cb);
  },

  onDeleteToken(projectId, token, cb) {
    const p = request
      .delete(window.RETRACED.apiEndpoint + '/project/' + projectId + '/token/' + token)
      .set('Authorization', SessionStore.session.accessToken)
      .set('Content-Type', 'application/json');
    handleTokenPromise.call(this, p, projectId, cb);
  },

  onDisableToken(projectId, token, cb) {
    const p = request
      .post(window.RETRACED.apiEndpoint + '/project/' + projectId + '/token/' + token + '/disable')
      .set('Authorization', SessionStore.session.accessToken)
      .set('Content-Type', 'application/json');
    handleTokenPromise.call(this, p, projectId, cb);
  }
});

export default ProjectStore;
