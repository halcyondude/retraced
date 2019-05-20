import * as React from 'react';
import * as Joi from 'joi';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import ProjectActions from '../actions/ProjectActions';
import ProjectStore from '../stores/ProjectStore';
import AlertActions from '../actions/AlertActions';

export default class CreateTokenDialog extends React.Component {
  constructor(props) {
    super(props);

    var environments = ProjectStore.getEnvironmentsForProject(this.props.projectId) || [];

    this.state = {
      params: props ? props.params : this.props.params,
      environment: environments.length > 0 ? environments[0].id : null,
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

  onChangeThis(field, ev, idx, val) {
    var state = this.state;

    switch (field) {
    case 'name':
      state.name = this.refs.name.getValue();
      break;
    case 'environment':
      state.environment = val;
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
        this.setState({validationError: null});
        ProjectActions.createToken(this.props.projectId, this.state.name, this.state.environment, (errMsg) => {
          if (errMsg) {
            AlertActions.error('Error creating token', errMsg);
          } else {
            this.props.onDialogClose();
          }
        }).bind(this);
      } else {
        this.setState({validationError: err});
      }
    }.bind(this);
    var schema = Joi.object().keys({
      name: Joi.string().required().label('Display Name'),
      environment: Joi.string().required().label('Environemnt')
    });

    var data = {
      name: this.state.name,
      environment: this.state.environment
    };

    Joi.validate(data, schema, {abortEarly: false}, onValidate);
  }

  render() {
    var environments = ProjectStore.getEnvironmentsForProject(this.props.projectId) || [];
    var environmentItems = [];
    environments.forEach(function(environment) {
      environmentItems.push(<MenuItem value={environment.id} key={environment.id} primaryText={environment.name}/>);
    });

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
        label="Create Token"
        primary={true}
        onTouchTap={this.onSave} />
    ];

    return (
      <Dialog
        title="Create API Token"
        openImmediately={this.props.open}
        ref="dialog"
        open={this.props.open}
        actions={actions}
        modal={false}
        onRequestClose={this.onCancel}>
        <TextField
          hintText="Name"
          fullWidth={true}
          ref="name"
          errorText={errorTexts.name}
          onChange={this.onChangeThis.bind(this, 'name')}
          floatingLabelText="Token Name" />
        <div>
          <div style={{float: 'left', lineHeight: '56px'}}>
            Environment
          </div>
          <div style={{float: 'left'}}>
            <DropDownMenu onChange={this.onChangeThis.bind(this, 'environment')} value={this.state.environment}>
              {environmentItems}
            </DropDownMenu>
          </div>
        </div>
      </Dialog>
    );
  }
}
