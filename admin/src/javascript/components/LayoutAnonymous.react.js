import * as React from 'react';

import OverlayAlert from '../components/OverlayAlert.react';

export default class Anonymous extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          {this.props.children}
          <OverlayAlert />
        </div>
      </div>
    );
  }
}
