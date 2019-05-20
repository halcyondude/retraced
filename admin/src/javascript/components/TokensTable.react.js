import * as React from 'react';
import * as moment from 'moment';
import * as classNames from 'classnames';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import {Card, CardText} from 'material-ui/Card';

import Loading from '../components/Loading.react';
import CreateTokenDialog from '../components/CreateTokenDialog.react';
import ProjectActions from '../actions/ProjectActions';
import AlertActions from '../actions/AlertActions';

export default class TokensTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: props ? props.params : this.props.params,
      createDialogOpen: false
    };

    this.binder('onCreateToken', 'onCreateTokenHide', 'onDeleteToken');
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  onCreateToken() {
    this.setState({createDialogOpen: true});
  }

  onCreateTokenHide() {
    this.setState({createDialogOpen: false});
  }

  onDeleteToken(token) {
    ProjectActions.deleteToken(this.props.projectId, token, (err) => {
      if (err) {
        AlertActions.error('Error deleting token', err);
        return;
      }
    });
  }

  onDisableToken(token) {
    ProjectActions.disableToken(this.props.projectId, token, (err) => {
      if (err) {
        AlertActions.error('Error disabling token', err);
        return;
      }
    });
  }

  render() {
    if (!this.props.tokens) {
      return <Loading />;
    }

    const nodes = this.props.tokens.map((t) => {
      const disableIconClass = classNames(
        'material-icons',
        {'action-icon': t.disabled !== 0},
        {'action-icon-disabled': t.disabled === 0}
      );

      return (
        <TableRow key={t.token}>
          <TableRowColumn>
            <IconButton
              iconClassName="material-icons action-icon"
              onClick={this.onDeleteToken.bind(this, t.token)}
            >delete</IconButton>
          </TableRowColumn>
          <TableRowColumn>
            <IconButton
              iconClassName={disableIconClass}
              disabled={t.disabled !== 0}
              onClick={this.onDisableToken.bind(this, t.token)}
            >lock</IconButton>
          </TableRowColumn>
          <TableRowColumn>
            {t.name}
          </TableRowColumn>
          <TableRowColumn>
            {t.environment_id}
          </TableRowColumn>
          <TableRowColumn>
            <Token token={t.token} />
          </TableRowColumn>
          <TableRowColumn>
            {t.last_used ? moment(new Date(t.last_used)).calendar() : 'Never'}
          </TableRowColumn>
        </TableRow>
      );
    });

    return (
      <div>
        <Card initiallyExpanded={true} className="big-card">
          <CardText expandable={false}>
            <Table selectable={false} className="tokens-table">
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn colSpan={6}>
                    <div className='pull-left'>
                      <h2>API Tokens</h2>
                    </div>
                    <div className='pull-right'>
                      <IconButton iconClassName="material-icons" onClick={this.onCreateToken}>add_box</IconButton>
                    </div>
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                <TableRow>
                  <TableRowColumn></TableRowColumn>
                  <TableRowColumn></TableRowColumn>
                  <TableRowColumn>Name</TableRowColumn>
                  <TableRowColumn>Environment</TableRowColumn>
                  <TableRowColumn>Token</TableRowColumn>
                  <TableRowColumn>Last Used</TableRowColumn>
                </TableRow>
                {nodes}
              </TableBody>
            </Table>
          </CardText>
        </Card>
        <CreateTokenDialog
        ref="createTokenDialog"
        onDialogClose={this.onCreateTokenHide}
        open={this.state.createDialogOpen}
        projectId={this.props.projectId}/>
      </div>
    );
  }
}

class Token extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  handleShow(e) {
    e.preventDefault();
    this.setState({
      visible: true
    });
  }

  render() {
    const token = this.props.token;
    let content;
    if (this.state.visible) {
      content = <span>
        {token}
      </span>;
    } else {
      content = <div className='token-row'>
        <span>
          {'*'.repeat(token.length)}
        </span>
        <button
          type='button'
          className='btn btn-xs btn-default'
          onClick={this.handleShow.bind(this)}
        >Show</button>
      </div>;
    }

    return content;
  }
}

Token.propTypes = {
  token: React.PropTypes.string
};
