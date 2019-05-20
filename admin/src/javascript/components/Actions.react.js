import * as React from 'react';

import ActionsTable from '../components/ActionsTable.react';
import ActionActions from '../actions/ActionActions';
import ActionStore from '../stores/ActionStore';
import SessionStore from '../stores/SessionStore';
import AlertActions from '../actions/AlertActions';

export default class Actions extends React.Component {
  constructor(props) {
    super(props);

    this.unsubscribe = [];
    this.state = {
      params: props ? props.params : this.props.params
    };

    this.binder('onActionsLoaded', 'onSessionChanged');
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  loadActions() {
    ActionActions.load(this.props.params.projectId, this.onActionsLoaded);
  }

  componentDidMount() {
    this.unsubscribe.push(SessionStore.listen(this.onSessionChanged));
    this.loadActions();
  }

  componentWillUnmount() {
    this.unsubscribe.forEach((u) => u());
  }

  onActionsLoaded(err) {
    if (err) {
      AlertActions.error('Error loading actions', err);
      return;
    }
    this.forceUpdate();
  }

  onSessionChanged() {
    this.loadActions();
  }

  render() {
    var actions;
    if (ActionStore.isLoaded()) {
      actions = ActionStore.getActionsForProject(this.props.params.projectId);
    }

    return (
      <div className="content">
        <ActionsTable actions={actions} projectId={this.props.params.projectId} />
      </div>
    );
  }
}
