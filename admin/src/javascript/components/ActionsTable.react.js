import * as React from 'react';
import { browserHistory } from 'react-router';
import * as moment from 'moment';

import LoadingSmall from '../components/LoadingSmall.react';
import ActionStore from '../stores/ActionStore';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default class ActionTable extends React.Component {
  constructor(props) {
    super(props);

    this.binder('onSelectAction');
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  onSelectAction(ev) {
    let action = this.props.actions[ev];
    browserHistory.push('/project/' + this.props.projectId + '/action/' + action.id);
  }

  render() {
    if (!this.props.actions) {
      return (
        <div>
          <div style={{padding: '20px'}}>
            <h3>Actions</h3>
            <div style={{width: '100%', height: '100px'}}>
              <LoadingSmall />
            </div>
          </div>
        </div>
      );
    }

    if (!ActionStore.hasActions()) {
      return (
        <div style={{marginLeft: 'auto', marginRight: 'auto', display: 'block', width: '600px'}}>
          no actions found
        </div>
      );
    }

    var nodes = [];
    this.props.actions.forEach((action) => {
      var node = (
        <TableRow key={action.action}>
          <TableRowColumn>
            <div style={{whiteSpace: 'normal', paddingTop: '9px', paddingBottom: '9px'}}>
              {action.action}
            </div>
          </TableRowColumn>
          <TableRowColumn>
            {action.event_count}
          </TableRowColumn>
          <TableRowColumn>
            {moment(new Date(action.first_active)).format('MMM DD, h:mm:ss a')}
          </TableRowColumn>
          <TableRowColumn>
            {moment(new Date(action.last_active)).format('MMM DD, h:mm:ss a')}
          </TableRowColumn>
        </TableRow>
      );
      nodes.push(node);
    });

    return (
      <div>
        <div className='main-section'>
          <div style={{width: '100%', height: '100%'}}>
            <Table selectable={false} className="actions-table" onCellClick={this.onSelectAction}>
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>Action</TableHeaderColumn>
                  <TableHeaderColumn>Event Count</TableHeaderColumn>
                  <TableHeaderColumn>First Seen</TableHeaderColumn>
                  <TableHeaderColumn>Last Seen</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {nodes}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}
