import * as React from 'react';
import * as Joi from 'joi';
import { browserHistory } from 'react-router';

import ProjectActions from '../actions/ProjectActions';
import AlertActions from '../actions/AlertActions';

import {Card, CardText, CardActions} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class NoProject extends React.Component {
  constructor(props) {
    super(props);

    this.unsubscribe = [];
    this.state = {
      validationError: null
    };

    this.binder('handleCreateProject', 'handleChangeThis');
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  componentWillUnmount() {

  }

  handleCreateProject() {
    var onValidate = function(err) {
      if (!err) {
        this.setState({validationError: null});
        ProjectActions.create(this.state.projectName, (err, project) => { // eslint-disable-line no-shadow
          if (err) {
            AlertActions.error('Error', err);
            return;
          }

          ProjectActions.loadProject(project.id);
          browserHistory.push('/project/' + project.id);
        });
      } else {
        this.setState({validationError: err});
      }
    }.bind(this);
    var schema = Joi.object().keys({
      projectName: Joi.string().min(4).required().label('Project Name')
    });

    var data = {
      projectName: this.state.projectName
    };

    Joi.validate(data, schema, {abortEarly: false}, onValidate);
  }

  handleCreateSuccess(project) {
    this.transitionTo('project', {projectId: project.id});
  }

  handleCreateError(errMsg) {
    AlertActions.error('Error', errMsg);
  }

  handleChangeThis() {
    this.setState({ projectName: this.refs.projectName.getValue() });
  }

  render() {
    var errorTexts = {};
    if (this.state.validationError) {
      this.state.validationError.details.forEach(function(field) {
        errorTexts[field.path] = field.message;
      });
    }

    return (
      <div className="flex-container">
        <div className="row">
          <Card initiallyExpanded={true} className="create-project-card">
            <CardText>
              <p>Audited events are organized into projects.  Actors and events cannot be split across projects.</p>
              <p>Most of the time, you should only have a single project.</p>
            </CardText>
            <CardText>
              <TextField
                style={{top: '-32px'}}
                ref="projectName"
                fullWidth={true}
                autoFocus={true}
                errorText={errorTexts.projectName}
                onChange={this.handleChangeThis}
                floatingLabelText="Project Name" />
            </CardText>
            <CardActions>
              <RaisedButton label="Create Project" primary={true} onClick={this.handleCreateProject}/>
            </CardActions>
          </Card>
        </div>
      </div>
    );
  }
}
