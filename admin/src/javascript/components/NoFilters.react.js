import * as React from 'react';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

export default class NoFilters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: props ? props.params : this.props.params
    };

    this.binder('onCreateFilter');
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  onCreateFilter() {
    if (this.props.onShowCreateFilter) {
      this.props.onShowCreateFilter();
    }
  }

  render() {
    return (
      <Paper zDepth={1} className="no-events">
        <div>
          <strong>Filters</strong> are commonly used queries against your specific audit logs.<br /><code>//TODO:  provide some examples</code>
        </div>
        <div style={{textAlign: 'center', paddingTop: '30px', paddingBottom: '30px'}}>
          <RaisedButton label="Create Filter" primary={true} onClick={this.onCreateFilter}/>
        </div>
        <div style={{textAign: 'center'}}>
          <p className="text-muted">
            If you need help creating filters, check out our <a href="https://docs.retraced.io">documentation</a>.
          </p>
        </div>
      </Paper>
    );
  }
}
