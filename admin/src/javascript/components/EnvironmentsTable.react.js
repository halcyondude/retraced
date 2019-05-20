import * as React from 'react';

import IconButton from 'material-ui/IconButton';

import CreateEnvironmentDialog from '../components/CreateEnvironmentDialog.react';
import CardTable from '../components/CardTable.react';

import AlertActions from '../actions/AlertActions';
import ProjectActions from '../actions/ProjectActions';

export default class EnvironmentsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: props ? props.params : this.props.params,
      createDialogOpen: false
    };

    this.binder('onCreateEnvironment', 'onCreateEnvironmentHide', 'onDeleteEnvironment');
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  onCreateEnvironment() {
    this.setState({createDialogOpen: true});
  }

  onCreateEnvironmentHide() {
    this.setState({createDialogOpen: false});
  }

  onDeleteEnvironment(id) {
    ProjectActions.deleteEnvironment(this.props.projectId, id, (errMsg) => {
      if (errMsg) {
        AlertActions.error('Error deleting environment', errMsg);
      }
    });
  }

  render() {
    const environments = this.props.environments || [];
    const rows = environments.map((environment) => [
      <IconButton iconClassName="material-icons action-icon"
      onClick={this.onDeleteEnvironment.bind(this, environment.id)
      }>delete</IconButton>,
      environment.name
    ]);

    return (
      <div>
        <CardTable
          headerText='Environments'
          tableClassName='environments-table'
          rows={rows}
          rowKey={(i) => i ? environments[i - 1].id : ''}
          onAdd={this.onCreateEnvironment} />

        <CreateEnvironmentDialog
          ref="createEnvironmentDialog"
          onDialogClose={this.onCreateEnvironmentHide}
          open={this.state.createDialogOpen}
          projectId={this.props.projectId}/>
      </div>
    );
  }
}
