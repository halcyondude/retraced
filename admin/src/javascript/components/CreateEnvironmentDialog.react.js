import * as React from 'react';
import * as Joi from 'joi';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import ProjectActions from '../actions/ProjectActions';
import AlertActions from '../actions/AlertActions';

export default class CreateEnvironmentDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: props ? props.params : this.props.params,
      environment: 'production'
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

  onChangeThis(field) {
    var state = this.state;

    switch (field) {
    case 'name':
      state.name = this.refs.name.getValue();
      break;
    }

    this.setState(state);
  }

  onCancel() {
    this.props.onDialogClose();
  }

  onSave() {
    var onValidate = function(err) {
      if (!err) {
        this.setState({ validationError: null });
        ProjectActions.createEnvironment(this.props.projectId, this.state.name, (errMsg) => {
          if (errMsg) {
            AlertActions.error('Error creating environment', errMsg);
          } else {
            this.props.onDialogClose();
          }
        }).bind(this);
      } else {
        this.setState({ validationError: err });
      }
    }.bind(this);
    var schema = Joi.object().keys({
      name: Joi.string().required().label('Name')
    });

    var data = {
      name: this.state.name
    };

    Joi.validate(data, schema, { abortEarly: false }, onValidate);
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
        label="Create Environment"
        primary={true}
        onTouchTap={this.onSave} />
    ];

    return (
      <Dialog
        title="Create Environment"
        openImmediately={this.props.open}
        ref="dialog"
        open={this.props.open}
        actions={actions}
        modal={false}>
        <div>

        </div>
        <TextField
          hintText="Name"
          fullWidth={true}
          ref="name"
          errorText={errorTexts.name}
          onChange={this.onChangeThis.bind(this, 'name')}
          floatingLabelText="Environment Name" />
      </Dialog>
    );
  }
}
