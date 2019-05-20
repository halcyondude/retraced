import * as React from 'react';
import { browserHistory } from 'react-router';

export default class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      params: props ? props.params : this.props.params
    };
  }

  componentDidMount() {
    if (this.props.location.pathname.endsWith(this.state.params.projectId)) {
      browserHistory.push('/project/' + this.state.params.projectId + '/dashboard');
      return;
    }
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
