import * as React from 'react';
import { browserHistory } from 'react-router';
import * as _ from 'lodash';
import * as autoBind from 'react-autobind';

import SessionActions from '../actions/SessionActions';
import SessionStore from '../stores/SessionStore';
import ProjectActions from '../actions/ProjectActions';
import ProjectStore from '../stores/ProjectStore';
import Sidebar from '../components/Sidebar.react';
import Loading from '../components/Loading.react';

import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
var logo = require('../../assets/retraced-logo.png');

export default class Authenticated extends React.Component {
  constructor(props) {
    super(props);

    this.unsubscribe = [];

    var active = 'dashboard';
    if (this.props.location.pathname.endsWith('events')) {
      active = 'events';
    } else if (this.props.location.pathname.endsWith('actors')) {
      active = 'actors';
    } else if (this.props.location.pathname.endsWith('filters')) {
      active = 'filters';
    } else if (this.props.location.pathname.endsWith('settings')) {
      active = 'settings';
    } else if (this.props.location.pathname.endsWith('actions')) {
      active = 'actions';
    } else if (this.props.location.pathname.endsWith('targets')) {
      active = 'targets';
    } else {
      // We need to look for the ... this ...  this can't be right
      if (this.props.location.pathname.includes('/event/')) {
        active = 'events';
      } else if (this.props.location.pathname.includes('/action/')) {
        active = 'actions';
      } else if (this.props.location.pathname.includes('/actor/')) {
        active = 'actor';
      } else if (this.props.location.pathname.includes('/object/')) {
        active = 'object';
      }
    }

    autoBind(this);

    this.state = {
      active: active,
      projectId: null
    };
  }

  componentDidMount() {
    this.unsubscribe.push(SessionStore.listen(this.onSessionChange));
    this.unsubscribe.push(ProjectStore.listen(this.onProjectsChange));
    ProjectActions.load();

    const projectId = this.props.params.projectId;
    if (projectId) {
      this.setState({
        projectId
      });
    }
  }

  componentWillUnmount() {
    this.unsubscribe.forEach(
      (u) => u()
    );
  }

  onMenuItemSelected(item) {
    this.setState({active: item});
  }

  onSessionChange() {
    if (!SessionStore.isLoggedIn()) {
      window.location = RETRACED.publicWebURL;
    }

    this.forceUpdate();
  }

  onProjectsChange() {
    let projectId;
    if (this.state.projectId) {
      projectId = this.state.projectId;
    } else {
      const p = ProjectStore.getFirstProject();
      if (p) {
        projectId = p.id;
        this.setState({projectId});
      }
    }

    if (projectId) {
      const project = ProjectStore.getProjectById(projectId);
      if (!project.environments) {
        ProjectActions.loadProject(projectId);
      }
    }

    this.forceUpdate();
  }

  handleLogout() {
    SessionActions.logout();
  }

  handleDocsMenu(e, item) {
    if (item.key === 'changelog') {
      this.transitionTo('changelog', {});
    } else if (item.key === 'docs') {
      window.open('https://docs.retraced.io');
    }
  }

  handleToggleSidebar() {
    this.setState({sidebarOpen: !this.state.sidebarOpen});
    this.forceUpdate();
  }

  handleSelectEnvironment(event, key, environmentId) {
    SessionActions.selectEnvironment(environmentId);
  }

  getDefaultEnvironment() {
    let e = SessionStore.selectedEnvironment();
    if (e) {
      return e;
    }

    const projectId = this.state.projectId;
    if (!projectId) {
      return null;
    }

    const envs = ProjectStore.getEnvironmentsForProject(projectId);
    e = _.get(_.first(envs), 'id');
    if (e) {
      this.handleSelectEnvironment(null, null, e);
      return e;
    }

    return null;
  }

  getToolbar() {
    const projectId = this.state.projectId;
    let environments = null;
    if (projectId) {
      const envs = ProjectStore.getEnvironmentsForProject(projectId);
      if (envs) {
        environments =
          <DropDownMenu
            value={this.getDefaultEnvironment()}
            className='bar-menu'
            labelStyle={{color: '#fff'}}
            onChange={this.handleSelectEnvironment}>
            {envs.map((e) => <MenuItem key={e.id} value={e.id} primaryText={e.name}/> )}
          </DropDownMenu>;
      }
    }

    const accountMenu = (
      <IconButton iconClassName="material-icons" iconStyle={{color: '#fff'}} tooltipPosition="bottom-center" tooltip="Account">account_box</IconButton>
    );
    const docsMenu = (
      <IconButton iconClassName="material-icons" iconStyle={{color: '#fff'}} tooltipPosition="bottom-center" tooltip="Documentation">library_books</IconButton>
    );

    var pageButtons = [];
    if (this.state.active === 'events') {
      pageButtons = this.getEventsToolbarButtons();
    }

    return (
      <Toolbar style={{backgroundColor: 'rgba(0,0,0,0)'}}>
        <ToolbarGroup key={1}>
          {pageButtons}
        </ToolbarGroup>
        <ToolbarGroup key={2}>
          {environments}
          <IconMenu iconButtonElement={docsMenu} onItemTouchTap={this.handleDocsMenu}>
            <MenuItem primaryText="Documentation" key="docs" />
          </IconMenu>
          <IconMenu iconButtonElement={accountMenu}>
            <MenuItem primaryText="Logout" onClick={this.handleLogout}/>
          </IconMenu>
        </ToolbarGroup>
      </Toolbar>
    );
  }

  getEventsToolbarButtons() {
    var filterMenu = [
      <IconButton key="filter" iconClassName="material-icons" iconStyle={{color: '#fff'}}>filter_list</IconButton>
    ];

    return filterMenu;
  }

  render() {
    const title = (<img src={logo} style={{height: '24px', position: 'absolute', top: '20px'}} />);

    // This layout will ensure that the project store is loaded for any child it renders.  Children do NOT need to check if ProjectStore is loaded...
    var content;
    if (!ProjectStore.isLoaded()) {
      content = <Loading />;
    } else {
      content = this.props.children;
    }

    return (
      <div>
        <AppBar
          title={title}
          showMenuIconButton={false}
          style={{boxShadow: 'none', position: 'fixed', backgroundColor: '#393939'}}
          iconElementRight={this.getToolbar()} />
        <div className="main-content">
          <div className="row">
            <div className="flex-container">
              <div className="row" style={{width: '100%', marginTop: '64px'}}>
                <Sidebar active={this.state.active} projectId={this.state.projectId} params={this.props.params} onItemSelected={this.onMenuItemSelected} />
                <div className="main-container">
                  {content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
