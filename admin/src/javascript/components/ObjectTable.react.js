import * as React from 'react';
import * as moment from 'moment';

import LoadingSmall from '../components/LoadingSmall.react';
import ObjectStore from '../stores/ObjectStore';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default class ObjectTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.objects) {
      return (
        <div>
          <div style={{padding: '20px'}}>
            <h3>Targets</h3>
            <div style={{width: '100%', height: '100px'}}>
              <LoadingSmall />
            </div>
          </div>
        </div>
      );
    }

    if (!ObjectStore.hasObjects()) {
      return (
        <div style={{marginLeft: 'auto', marginRight: 'auto', display: 'block', width: '600px'}}>
          no targets found
        </div>
      );
    }

    var nodes = [];
    this.props.objects.forEach((object) => {
      var node = (
        <TableRow key={object.id}>
          <TableRowColumn>
            <div style={{whiteSpace: 'normal', paddingTop: '9px', paddingBottom: '9px'}}>
              {object.name}
            </div>
          </TableRowColumn>
          <TableRowColumn>
            {object.event_count}
          </TableRowColumn>
          <TableRowColumn>
            {moment(new Date(object.first_active)).format('MMM DD, h:mm:ss a')}
          </TableRowColumn>
          <TableRowColumn>
            {moment(new Date(object.last_active)).format('MMM DD, h:mm:ss a')}
          </TableRowColumn>
        </TableRow>
      );
      nodes.push(node);
    });

    return (
      <div>
        <div className='main-section'>
          <div style={{width: '100%', height: '100%'}}>
            <Table selectable={false} className="objects-table">
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>Object</TableHeaderColumn>
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
