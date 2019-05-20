import * as React from 'react';

import Paper from 'material-ui/Paper';

import Loading from '../components/Loading.react';
import ProjectStore from '../stores/ProjectStore';

export default class NoEvents extends React.Component {
  render() {
    let project = ProjectStore.getProjectById(this.props.projectId);
    if (!project) {
      return <Loading />;
    }

    return (
      <Paper zDepth={1} className="no-events">
        <p>
          There are no events in project {project.name}.
        </p>
        <p>
          One you start sending events, they will be displayed here.
        </p>
        <p>
          If you need help sending events, check out our <a href="https://docs.retraced.io/sending_events.html">documentation</a>.
        </p>
      </Paper>
    );
  }
}

