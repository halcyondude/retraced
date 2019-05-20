import * as React from "react";
import { render } from "react-dom";
import {
  Router,
  browserHistory,
  Route,
  IndexRedirect,
  IndexRoute,
  Redirect,
} from "react-router";
import * as _ from "lodash";
var injectTapEventPlugin = require("react-tap-event-plugin");

require("../styles/main.less");
require("font-awesome-webpack");

import App from "./components/App.react";
import LayoutAnonymous from "./components/LayoutAnonymous.react";
import ExternalAuthCallback from "./components/ExternalAuthCallback.react";
import Logout from "./components/Logout.react";
import LayoutAuthenticated from "./components/LayoutAuthenticated.react";
import NoProject from "./components/NoProject.react";
import Project from "./components/Project.react";
import Dashboard from "./components/Dashboard.react";
import Events from "./components/Events.react";
import Event from "./components/Event.react";
import Actors from "./components/Actors.react";
import Actor from "./components/Actor.react";
import Targets from "./components/Targets.react";
import Actions from "./components/Actions.react";
import Action from "./components/Action.react";
import Filters from "./components/Filters.react";
import ProjectSettings from "./components/ProjectSettings.react";
import ProjectsLoading from "./components/ProjectsLoading.react";
import SessionActions from "./actions/SessionActions";
import SessionStore from "./stores/SessionStore";

injectTapEventPlugin();

var doLogout = function (nextState) {
  SessionActions.logout(nextState);
};

var requireAuth = function (nextState, replace) {
  if (!SessionStore.isLoggedIn()) {
    window.location = RETRACED.publicWebURL;
    return;
  }
};

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route component={LayoutAuthenticated} onEnter={requireAuth}>
        <IndexRedirect to="project" />
        <Route path="create-project" component={NoProject} />
        <Route path="project">
          <IndexRoute component={ProjectsLoading} />
          <Route path=":projectId" component={Project}>
            <Route path="dashboard" component={Dashboard} />
            <Route path="event/:id" component={Event} />
            <Route path="events" component={Events} />
            <Route path="actions" component={Actions} />
            <Route path="action/:id" component={Action} />
            <Route path="targets" component={Targets} />
            <Route path="actors" component={Actors} />
            <Route path="actor/:id" component={Actor} />
            <Route path="filters" component={Filters} />
            <Route path="settings" component={ProjectSettings} />
          </Route>
        </Route>
        <Route path="logout" component={Logout} onEnter={doLogout} />
      </Route>
      <Route component={LayoutAnonymous}>
        <Route path="/login/callback" component={ExternalAuthCallback} />
      </Route>
    </Route>
  </Router>
), document.getElementById("content"));
