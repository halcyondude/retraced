import * as React from 'react';

import TeamTable from '../components/TeamTable.react';
import TeamActions from '../actions/TeamActions';
import TeamStore from '../stores/TeamStore';
import AlertActions from '../actions/AlertActions';
import TokensTable from '../components/TokensTable.react';
import EnvironmentsTable from '../components/EnvironmentsTable.react';

import ProjectStore from '../stores/ProjectStore';
import ProjectActions from '../actions/ProjectActions';

import SessionStore from '../stores/SessionStore';

import Divider from 'material-ui/Divider';

export default class ProjectSettings extends React.Component {
  constructor(props) {
    super(props);

    this.unsubscribe = [];
    this.state = {
      params: props ? props.params : this.props.params
    };

    this.binder('onTeamLoaded', 'onProjectLoaded', 'onDataChanged');
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  componentDidMount() {
    this.unsubscribe.push(ProjectStore.listen(this.onDataChanged));
    this.unsubscribe.push(TeamStore.listen(this.onDataChanged));

    TeamActions.load(this.props.params.projectId, this.onTeamLoaded);
    ProjectActions.loadProject(this.props.params.projectId, this.onProjectLoaded);
  }

  componentWillUnmount() {
    this.unsubscribe.forEach(
      (u) => u()
    );
  }

  onDataChanged() {
    this.forceUpdate();
  }

  onProjectLoaded(err) {
    if (err) {
      AlertActions.error('Error loading project', err);
      return;
    }
    this.forceUpdate();
  }

  onTeamLoaded(err) {
    if (err) {
      AlertActions.error('Error loading team', err);
      return;
    }
    this.forceUpdate();
  }

  render() {
    var members;
    if (TeamStore.isLoaded()) {
      members = TeamStore.getMembersForProject(this.props.params.projectId);
    }

    return (
      <div className='main-section'>
        <TeamTable members={members} projectId={this.props.params.projectId} userId={SessionStore.getUser().id}/>
        <Divider />
        <EnvironmentsTable environments={ProjectStore.getEnvironmentsForProject(this.props.params.projectId)} projectId={this.props.params.projectId}/>
        <Divider />
        <TokensTable tokens={ProjectStore.getTokensForProject(this.props.params.projectId)} projectId={this.props.params.projectId}/>
      </div>
    );
  }
}
