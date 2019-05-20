import * as React from 'react';

import AlertActions from '../actions/AlertActions';
import AlertStore from '../stores/AlertStore';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class OverlayAlert extends React.Component {
  constructor(props) {
    super(props);

    this.unsubscribe = [];
    this.binder('onRequestClose', 'onShowAlert');

    this.state = {
      alert: {
        severity: '',
        title: '',
        body: '',
        visible: false
      }
    };
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  componentDidMount() {
    this.unsubscribe.push(AlertStore.listen(this.onShowAlert));
  }

  componentWillUnmount() {
    this.unsubscribe.forEach(
      (u) => u()
    );
  }

  onRequestClose() {
    AlertActions.dismiss();
  }

  onShowAlert(alert) {
    this.setState({alert: alert});
  }

  render() {
    if (!this.state.alert.visible) {
      return <span />;
    }

    var actions = [
      <FlatButton
        label="OK"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.onRequestClose}
      />
    ];

    return (
      <Dialog
        open={true}
        ref="dialog"
        title={this.state.alert.title}
        modal={false}
        onDismiss={this.onRequestClose}
        onRequestClose={this.onRequestClose}
        actions={actions}
        openImmediately={true}>
        {this.state.alert.body}
      </Dialog>
    );
  }
}
