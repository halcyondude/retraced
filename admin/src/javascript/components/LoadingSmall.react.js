import * as React from 'react';

import CircularProgress from 'material-ui/CircularProgress';

export default class LoadingSmall extends React.Component {
  render() {
    return (
      <div className="row">
        <CircularProgress mode="indeterminate" />
      </div>
    );
  }
}
