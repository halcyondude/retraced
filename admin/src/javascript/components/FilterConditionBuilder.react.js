import * as React from 'react';
import * as classNames from 'classnames';

import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';

export default class FilterConditionBuilder extends React.Component {
  constructor(props) {
    super(props);

    this.binder( 'onChangeDdl', 'onChangeTxt', 'onChangeThis');
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  onChangeDdl(k, e, i, v) {
    this.onChangeThis(k, v);
  }

  onChangeTxt(k, e) {
    this.onChangeThis(k, e.target.value);
  }

  onChangeThis(k, v) {
    this.props.onConditionChange(this.props.sort, k, v);
  }

  render() {
    var addButtonClasses = classNames({hidden: !this.props.showAdd});
    var conjunctionClasses = classNames({hidden: this.props.condition.sort === 0});

    return (
      <tr>
        <td>
          <DropDownMenu
            className={conjunctionClasses}
            value={this.props.condition.conjunction}
            onChange={this.onChangeDdl.bind(this, 'conjunction')}>
            <MenuItem value="and" primaryText="and" />
            <MenuItem value="or" primaryText="or" />
          </DropDownMenu>
          <div className={classNames({hidden: this.props.condition.sort !== 0})} style={{marginTop: '4px', paddingLeft: '24px', textAlign: 'left'}}>
            <strong>Where</strong>
          </div>
        </td>
        <td>
          <DropDownMenu onChange={this.onChangeDdl.bind(this, 'field')} value={this.props.condition.field}>
            <MenuItem value="action" primaryText="Action" />
            <MenuItem value="location" primaryText="Location" />
            <MenuItem value="created" primaryText="Created" />
          </DropDownMenu>
        </td>
        <td>
          <DropDownMenu onChange={this.onChangeDdl.bind(this, 'operator')} value={this.props.condition.operator}>
            <MenuItem value="==" primaryText="==" />
            <MenuItem value="<>" primaryText="<>" />
            <MenuItem value=">=" primaryText=">=" />
            <MenuItem value="<=" primaryText="<=" />
          </DropDownMenu>
        </td>
        <td>
          <TextField
            ref="filterValue"
            style={{marginTop: '10px'}}
            fullWidth={true}
            autoFocus={true}
            value={this.props.condition.value}
            onChange={this.onChangeTxt.bind(this, 'value')} />
        </td>
        <td>
          <IconButton
            className={addButtonClasses}
            iconClassName="material-icons"
            tooltipPosition="bottom-center"
            onClick={this.props.onAddAnother}
            tooltip="Add another">add_circle_outline</IconButton>
        </td>
      </tr>
    );
  }
}
