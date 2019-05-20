import * as React from 'react';

import ObjectTable from '../components/ObjectTable.react';
import ObjectActions from '../actions/ObjectActions';
import ObjectStore from '../stores/ObjectStore';
import SessionStore from '../stores/SessionStore';
import AlertActions from '../actions/AlertActions';

export default class Targets extends React.Component {
  constructor(props) {
    super(props);

    this.unsubscribe = [];
    this.state = {
      params: props ? props.params : this.props.params
    };

    this.binder('onObjectsLoaded', 'onSessionChanged');
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  loadObjects() {
    ObjectActions.load(this.props.params.projectId, this.onObjectsLoaded);
  }

  componentDidMount() {
    this.unsubscribe.push(SessionStore.listen(this.onSessionChanged));
    this.loadObjects();
  }

  componentWillUnmount() {
    this.unsubscribe.forEach((u) => u());
  }

  onObjectsLoaded(err) {
    if (err) {
      AlertActions.error('Error loading targets', err);
      return;
    }
    this.forceUpdate();
  }

  onSessionChanged() {
    this.loadObjects();
  }

  render() {
    var objects;
    if (ObjectStore.isLoaded()) {
      objects = ObjectStore.getObjectsForProject(this.props.params.projectId);
    }

    return (
      <div className="content">
        <ObjectTable objects={objects} projectId={this.props.params.projectId} />
      </div>
    );
  }
}
