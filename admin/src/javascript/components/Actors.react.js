import * as React from 'react';

import ActorTable from '../components/ActorTable.react';
import ActorActions from '../actions/ActorActions';
import ActorStore from '../stores/ActorStore';
import SessionStore from '../stores/SessionStore';
import AlertActions from '../actions/AlertActions';

export default class Actors extends React.Component {
  constructor(props) {
    super(props);

    this.unsubscribe = [];
    this.state = {
      params: props ? props.params : this.props.params
    };

    this.binder('onActorsLoaded', 'onSessionChanged');
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  loadActors() {
    ActorActions.load(this.props.params.projectId, this.onActorsLoaded);
  }

  componentDidMount() {
    this.unsubscribe.push(SessionStore.listen(this.onSessionChanged));
    this.loadActors();
  }

  componentWillUnmount() {
    this.unsubscribe.forEach((u) => u());
  }

  onActorsLoaded(err) {
    if (err) {
      AlertActions.error('Error loading actors', err);
      return;
    }
    this.forceUpdate();
  }

  onSessionChanged() {
    this.loadActors();
  }

  render() {
    var actors;
    if (ActorStore.isLoaded()) {
      actors = ActorStore.getActorsForProject(this.props.params.projectId);
    }

    return (
      <div className="content">
        <ActorTable actors={actors} projectId={this.props.params.projectId} />
      </div>
    );
  }
}
