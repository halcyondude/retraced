import * as React from 'react';
import * as Joi from 'joi';
import * as _ from 'lodash';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardText} from 'material-ui/Card';

import FilterConditionBuilder from '../components/FilterConditionBuilder.react';

const schema = Joi.object().keys({
  name: Joi.string().min(4).required().label('Filter Name'),
  conditions: Joi.array().min(1)
});

const getEmptyFilter = () => ({
  name: '',
  conditions: [{
    conjunction: 'and',
    field: 'action',
    operator: '==',
    value: '',
    sort: 0
  }]
});

export default class FilterDialog extends React.Component {
  constructor(props) {
    super(props);

    const filter = getEmptyFilter();
    if (props.filter) {
      Object.assign(filter, props.filter);
    }

    this.state = {
      errorTexts: {},
      filter
    };
  }

  componentWillReceiveProps(props) {
    const filter = getEmptyFilter();
    if (props.filter) {
      Object.assign(filter, props.filter);
    }

    this.setState({filter});
  }

  render() {
    const edit = !!this.props.filter;
    const title = edit ? 'Edit Filter' : 'Create Filter';
    const filter = this.state.filter;

    let nameField = null;
    const nameFieldRef = (n) => {
      nameField = n;
    };

    const setFilter = (action) => this.setState({
      filter: action(this.state.filter)
    });
    const runIfValid = (action) => {
      const data = _.pick(filter, 'name', 'filterConditions');
      Joi.validate(data, schema, {abortEarly: false}, (err) => {
        const errorTexts = {};
        if (err) {
          err.details.forEach((field) => {
            errorTexts[field.path] = field.message;
          });
        } else {
          action();
        }

        this.setState({errorTexts});
      });
    };
    const handleNameChange = () => setFilter((f) => {
      f.name = nameField.getValue();
      return f;
    });
    const handleConditionChange = (idx, key, val) => setFilter((f) => {
      f.conditions[idx][key] = val;
      return f;
    });
    const handleAddAnother = () => setFilter((f) => {
      f.conditions.push({
        conjunction: 'and',
        field: 'action',
        operator: '==',
        value: '',
        sort: this.state.filter.conditions.length
      });
      return f;
    });
    const handleCreate = () => runIfValid(() => this.props.onCreate(filter));
    const handleUpdate = () => runIfValid(() => this.props.onUpdate(filter));
    const handleDelete = () => this.props.onDelete(filter.id);
    const dialogActions = [
      <FlatButton label='Cancel' secondary={true} onClick={this.props.onCancel} />
    ];
    const cardActions = edit
      ? (
        <CardActions>
          <RaisedButton label='Update Filter' primary={true} onClick={handleUpdate}/>
          <RaisedButton label='Delete Filter' secondary={true} onClick={handleDelete}/>
        </CardActions>
      )
      : (
        <CardActions>
          <RaisedButton label='Create Filter' primary={true} onClick={handleCreate}/>
        </CardActions>
      );
    const conditionNodes = filter.conditions.map((filterCondition) => {
      const showAdd = filterCondition.sort === filter.conditions.length - 1;
      return (
        <FilterConditionBuilder
          key={filterCondition.sort}
          condition={filterCondition}
          showAdd={showAdd}
          sort={filterCondition.sort}
          onConditionChange={handleConditionChange}
          onAddAnother={handleAddAnother} />
      );
    });

    return (
      <Dialog title={title} open={this.props.open} actions={dialogActions}>
        <Card>
          <CardText>
            <TextField
              ref={nameFieldRef}
              fullWidth={true}
              autoFocus={true}
              errorText={this.state.errorTexts.name}
              onChange={handleNameChange}
              defaultValue={filter.name}
              hintText='Filter Name' />
              <div className='row'>
                <table className='condition-builder-table'>
                  <tbody>
                    {conditionNodes}
                  </tbody>
                </table>
              </div>
          </CardText>
          {cardActions}
        </Card>
      </Dialog>
    );
  }
}

FilterDialog.propTypes = {
  open: React.PropTypes.bool,
  filter: React.PropTypes.object,
  onCancel: React.PropTypes.func,
  onCreate: React.PropTypes.func,
  onUpdate: React.PropTypes.func,
  onDelete: React.PropTypes.func
};
