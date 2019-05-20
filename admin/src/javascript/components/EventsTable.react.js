import * as React from 'react';
import { browserHistory } from 'react-router';
import * as moment from 'moment';
import * as ReactMarkdown from 'react-markdown';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';

import InlineLink from '../components/InlineLink.react';
import InlineImage from '../components/InlineImage.react';

export default class EventsTable extends React.Component {
  constructor(props) {
    super(props);

    this.binder('onItemSelected');
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  onItemSelected(eventId) {
    browserHistory.push('/project/' + this.props.projectId + '/event/' + eventId);
  }

  render() {
    var nodes = [];

    var renderers = {
      'Link': InlineLink,
      'Image': InlineImage
    };

    var height = '32px';
    this.props.events.forEach(function(event) {
      if (!event) {
        return;
      }

      var eventDate = event.created ? event.created : event.received;
      var node = (
        <TableRow key={event.id} hoverable={true} style={{height: height}}>
          <TableRowColumn style={{height: height}}>
            <ReactMarkdown sourcePos={true} renderers={renderers} className='no-margin event-data' source={event.display_title} />
          </TableRowColumn>
          <TableRowColumn style={{height: height}}>
            {moment(new Date(eventDate)).format('MMM DD, h:mm:ss a')}
          </TableRowColumn>
          <TableRowColumn style={{height: height}}>
            {event.source_ip}
          </TableRowColumn>
          <TableRowColumn>
            <IconButton iconClassName="material-icons" onClick={this.onItemSelected.bind(this, event.id)}>zoom_in</IconButton>
          </TableRowColumn>
        </TableRow>
      );
      nodes.push(node);
    }.bind(this));

    return (
      <div>
        <div className='main-section'>
          <div style={{width: '100%', height: '100%'}}>
            <Table selectable={false} className="events-table">
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>Event Description</TableHeaderColumn>
                  <TableHeaderColumn>Date</TableHeaderColumn>
                  <TableHeaderColumn>IP Address</TableHeaderColumn>
                  <TableHeaderColumn></TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody showRowHover={true} displayRowCheckbox={false}>
                {nodes}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}
