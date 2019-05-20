import * as React from 'react';

import Paper from 'material-ui/Paper';

export default class NoActors extends React.Component {
  render() {
    return (
      <Paper zDepth={1} className="no-events">
        <p>
          There are no actors in project {this.props.projectId}.
        </p>
        <p>
          One you start sending events, the actors will be displayed here.
        </p>
        <p>
          If you need help sending events, check out our <a href="https://docs.retraced.io">documentation</a>.
        </p>
      </Paper>
    );
  }
}
