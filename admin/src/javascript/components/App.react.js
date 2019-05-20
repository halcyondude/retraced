import * as React from 'react';
import * as util from 'util';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

import RetracedTheme from '../MaterialTheme';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  getChildContext() {
    return {
      muiTheme: getMuiTheme(RetracedTheme)
    };
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

App.childContextTypes = {
  muiTheme: React.PropTypes.object
};
