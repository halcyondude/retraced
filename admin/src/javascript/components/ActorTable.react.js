import * as React from 'react';
import { browserHistory } from 'react-router';
import * as moment from 'moment';

import NoActors from '../components/NoActors.react';
import LoadingSmall from '../components/LoadingSmall.react';
import ActorStore from '../stores/ActorStore';

import Avatar from 'material-ui/Avatar';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import {grey400, white, green400, blue400, orange400, red400, purple400, cyan400, yellow400, bluegrey400} from 'material-ui/styles/colors';

export default class ActorTable extends React.Component {
  constructor(props) {
    super(props);

    this.binder('onActorSelected');
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  onActorSelected(actorId) {
    browserHistory.push('/project/' + this.props.projectId + '/actor/' + actorId);
  }

  render() {
    if (!this.props.actors) {
      return (
        <div>
          <div style={{padding: '20px'}}>
            <h3>Actors</h3>
            <div style={{width: '100%', height: '100px'}}>
              <LoadingSmall />
            </div>
          </div>
        </div>
      );
    }

    if (!ActorStore.hasActors()) {
      return (
        <div style={{marginLeft: 'auto', marginRight: 'auto', display: 'block', width: '600px'}}>
          <NoActors projectId={this.props.projectId} />
        </div>
      );
    }

    var nodes = [];
    this.props.actors.forEach((actor) => {
      var avatar;
      var avatarBackgroundColor = grey400;
      var avatarColor = white;
      if (actor.name.length > 0) {
        avatar = actor.name[0].toUpperCase();
        switch (avatar.charCodeAt(0) % 8) {
        case 0:
          avatarBackgroundColor = green400;
          break;
        case 1:
          avatarBackgroundColor = blue400;
          break;
        case 2:
          avatarBackgroundColor = orange400;
          break;
        case 3:
          avatarBackgroundColor = red400;
          break;
        case 4:
          avatarBackgroundColor = purple400;
          break;
        case 5:
          avatarBackgroundColor = cyan400;
          break;
        case 6:
          avatarBackgroundColor = yellow400;
          break;
        case 7:
          avatarBackgroundColor = bluegrey400;
          break;
        }
      } else {
        avatar = '-';
      }

      var node = (
        <TableRow key={actor.foreign_id}>
          <TableRowColumn>
            <Avatar color={avatarColor} backgroundColor={avatarBackgroundColor}>{avatar}</Avatar>
          </TableRowColumn>
          <TableRowColumn>
            <div style={{whiteSpace: 'normal', paddingTop: '9px', paddingBottom: '9px'}}>
              {actor.name}
            </div>
          </TableRowColumn>
          <TableRowColumn>
            {actor.event_count}
          </TableRowColumn>
          <TableRowColumn>
            {moment(new Date(actor.first_active)).calendar()}
          </TableRowColumn>
          <TableRowColumn>
            {moment(new Date(actor.last_active)).calendar()}
          </TableRowColumn>
          <TableRowColumn>
            <IconButton iconClassName="material-icons" onClick={this.onActorSelected.bind(this, actor.id)}>zoom_in</IconButton>
          </TableRowColumn>
        </TableRow>
      );
      nodes.push(node);
    });

    return (
      <div>
        <div className='main-section'>
          <h3>Actors</h3>
          <div style={{width: '100%', height: '100%'}}>
            <Table selectable={false} className="actors-table">
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn></TableHeaderColumn>
                  <TableHeaderColumn>Name</TableHeaderColumn>
                  <TableHeaderColumn>Event Count</TableHeaderColumn>
                  <TableHeaderColumn>First Seen</TableHeaderColumn>
                  <TableHeaderColumn>Last Seen</TableHeaderColumn>
                  <TableHeaderColumn></TableHeaderColumn>
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
