import * as React from 'react';
import * as moment from 'moment';
import * as classNames from 'classnames';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import {Card, CardText} from 'material-ui/Card';

import LoadingSmall from '../components/LoadingSmall.react';
import InviteMemberDialog from '../components/InviteMemberDialog.react';

import AlertActions from '../actions/AlertActions';
import TeamActions from '../actions/TeamActions';

export default class TeamTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: props ? props.params : this.props.params,
      inviteDialogOpen: false
    };

    this.binder('onInviteMember', 'onInviteHide');
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  onInviteMember() {
    this.setState({inviteDialogOpen: true});
  }

  onInviteHide() {
    this.setState({inviteDialogOpen: false});
  }

  onDeleteMember(memberId) {
    TeamActions.deleteTeamMember(this.props.projectId, memberId, (err) => {
      if (err) {
        AlertActions.error('Error deleting team member', err);
        return;
      }
    });
  }

  onDisableMember(memberId) {
    TeamActions.disableTeamMember(this.props.projectId, memberId, (err) => {
      if (err) {
        AlertActions.error('Error disabling team member', err);
        return;
      }
    });
  }

  render() {
    if (!this.props.members) {
      return (
        <div>
          <div>
            <h3>Team Members</h3>
            <div style={{width: '100%', height: '100px'}}>
              <LoadingSmall />
            </div>
          </div>
        </div>
      );
    }

    var nodes = this.props.members.map((member) => {
      const disabled = member.id === this.props.userId;
      const disableDisabled = disabled || member.disabled;
      const actionIconClass = (d) => classNames(
        'material-icons',
        {'action-icon': !d},
        {'action-icon-disabled': d}
      );

      return (
        <TableRow key={member.id}>
          <TableRowColumn>
            <IconButton
              iconClassName={actionIconClass(disabled)}
              disabled={disabled}
              onClick={this.onDeleteMember.bind(this, member.id)}
            >delete</IconButton>
          </TableRowColumn>
          <TableRowColumn>
            <IconButton
              iconClassName={actionIconClass(disableDisabled)}
              disabled={disableDisabled}
              onClick={this.onDisableMember.bind(this, member.id)}
            >lock</IconButton>
          </TableRowColumn>
          <TableRowColumn>
            <Avatar>{member.email[0].toUpperCase()}</Avatar>
          </TableRowColumn>
          <TableRowColumn>
            {member.email}
          </TableRowColumn>
          <TableRowColumn>
            {moment(new Date(member.created)).calendar()}
          </TableRowColumn>
          <TableRowColumn>
            {moment(new Date(member.last_login)).calendar()}
          </TableRowColumn>
          <TableRowColumn>
            No
          </TableRowColumn>
        </TableRow>
      );
    });

    return (
      <div>
        <Card initiallyExpanded={true} className="big-card">
          <CardText expandable={false}>
            <Table selectable={false} className="team-table">
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn colSpan={7}>
                    <div className='pull-left'>
                      <h2>Team Members</h2>
                    </div>
                    <div className='pull-right'>
                      <IconButton iconClassName="material-icons" onClick={this.onInviteMember}>add_box</IconButton>
                    </div>
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                <TableRow key="team-members">
                  <TableRowColumn></TableRowColumn>
                  <TableRowColumn></TableRowColumn>
                  <TableRowColumn></TableRowColumn>
                  <TableRowColumn>Email Address</TableRowColumn>
                  <TableRowColumn>Created</TableRowColumn>
                  <TableRowColumn>Last Login</TableRowColumn>
                  <TableRowColumn>2FA Enabled</TableRowColumn>
                </TableRow>
                {nodes}
              </TableBody>
            </Table>
          </CardText>
        </Card>
        <InviteMemberDialog
          ref="inviteDialog"
          onDialogClose={this.onInviteHide}
          open={this.state.inviteDialogOpen}
          projectId={this.props.projectId}/>
      </div>
    );
  }
}
