import * as React from 'react';
import * as Joi from 'joi';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import TeamActions from '../actions/TeamActions';

export default class InviteMemberDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: props ? props.params : this.props.params
    };

    this.binder('onChangeThis', 'onCancel', 'onSave');
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open) {
      this.refs.dialog.open = true;
    } else {
      this.refs.dialog.open = false;
    }
  }

  onChangeThis() {
    var state = this.state;
    state.email = this.refs.email.getValue();

    this.setState(state);
  }

  onCancel() {
    this.props.onDialogClose();
  }

  onSave() {
    var onValidate = function(err) {
      if (!err) {
        this.setState({validationError: null});
        TeamActions.invite(this.props.projectId, this.state.email);
      } else {
        this.setState({validationError: err});
      }
    }.bind(this);
    var schema = Joi.object().keys({
      email: Joi.string().email().required().label('Email Address')
    });

    var data = {
      email: this.state.email
    };

    Joi.validate(data, schema, {abortEarly: false}, onValidate);
  }

  render() {
    var errorTexts = {};
    if (this.state.validationError) {
      this.state.validationError.details.forEach(function(field) {
        errorTexts[field.path] = field.message;
      });
    }

    var actions = [
      <FlatButton
        key="cancel"
        label="Cancel"
        secondary={true}
        onTouchTap={this.onCancel} />,
      <FlatButton
        key="accept"
        label="Send Invitation"
        primary={true}
        onTouchTap={this.onSave} />
    ];

    return (
      <Dialog
        title="Invite Group Member"
        openImmediately={this.props.open}
        ref="dialog"
        open={this.props.open}
        actions={actions}
        modal={false}>
        <TextField
          hintText="Email Address"
          fullWidth={true}
          ref="email"
          errorText={errorTexts.email}
          onChange={this.onChangeThis}
          floatingLabelText="Email Address" />
      </Dialog>
    );
  }
}
