import * as Reflux from 'reflux';

var TeamActions = Reflux.createActions([
  'load',
  'loadSuccess',
  'loadError',
  'invite',
  'inviteSuccess',
  'inviteError',
  'getInvitation',
  'getInvitationSuccess',
  'getInvitationError',
  'deleteTeamMember',
  'disableTeamMember'
]);

export default TeamActions;
