import * as React from 'react';
import { browserHistory } from 'react-router';

import ProjectActions from '../actions/ProjectActions';
import ProjectStore from '../stores/ProjectStore';
import Loading from '../components/Loading.react';

export default class ProjectsLoading extends React.Component {
  constructor(props) {
    super(props);

    this.unsubscribe = [];
    this.binder('onProjectsChange');
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  componentDidMount() {
    this.unsubscribe.push(ProjectStore.listen(this.onProjectsChange));
    ProjectActions.load();
  }

  componentWillUnmount() {
    this.unsubscribe.forEach(
      (u) => u()
    );
  }

  onProjectsChange() {
    const p = ProjectStore.getFirstProject();
    if (p) {
      browserHistory.push('/project/' + p.id);
    } else {
      browserHistory.push('/create-project');
    }

    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <Loading />
      </div>
    );
  }
}
