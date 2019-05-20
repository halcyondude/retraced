import * as React from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import Loading from '../components/Loading.react';

import ActionActions from '../actions/ActionActions';
import AlertActions from '../actions/AlertActions';

export default class Action extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      action: null
    };

    this.binder('handleGetComplete', 'onClickUpdate', 'onChangeThis');
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  componentDidMount() {
    const projectId = this.props.params.projectId;
    const actionId = this.props.params.id;
    ActionActions.get(projectId, actionId, this.handleGetComplete);
  }

  handleGetComplete(err, ac) {
    if (err) {
      AlertActions.error('Error fetching action: ' + err);
      return;
    }

    this.setState(ac);
  }

  onChangeThis(field, ev) {
    var state = this.state;
    switch (field) {
    case 'display_template':
      state.display_template = ev.target.value; // eslint-disable-line camelcase
      break;
    }

    this.setState(state);
  }

  onClickUpdate() {
    ActionActions.update(this.props.params.projectId, this.props.params.id, this.state.display_template, (errMsg) => {
      if (errMsg) {
        AlertActions.error('Error updating action', errMsg);
      } else {
        AlertActions.success('Saved');
      }
    });
  }

  render() {
    if (!this.state.action) {
      return (
        <Loading />
      );
    }

    return (
      <div>
        <div className="main-section">
          <div className="main-form">
            <div style={{width: '100%', height: '100%'}}>
              <div>{this.state.action}</div>
              <div>
                <TextField
                  hintText="Display Template"
                  fullWidth={true}
                  value={this.state.display_template ? this.state.display_template : ''}
                  onChange={this.onChangeThis.bind(this, 'display_template')}
                  floatingLabelText="Display Template" />
              </div>
              <RaisedButton label='Update' primary={true} onClick={this.onClickUpdate}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
