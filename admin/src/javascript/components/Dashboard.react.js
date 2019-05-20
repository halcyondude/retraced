import * as React from 'react';
import * as autoBind from 'react-autobind';
import { Line } from 'react-chartjs';

import {GridList, GridTile} from 'material-ui/GridList';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import DashboardActions from '../actions/DashboardActions';
import DashboardStore from '../stores/DashboardStore';
import SessionStore from '../stores/SessionStore';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    autoBind(this);

    this.state = {
      filter: 'active',
    };

    this.unsubscribe = [];
  }

  componentDidMount() {
    DashboardActions.load(this.props.params.projectId);
    this.unsubscribe.push(SessionStore.listen(this.handleSessionChange));
    this.unsubscribe.push(DashboardStore.listen(this.handleDashboardChange));
  }

  componentWillUnmount() {
    this.unsubscribe.forEach((u) => u());
  }

  onChangeFilter(e, b, view) {
    this.setState({filter: view});
  }

  render() {
    let tiles = [];
    switch (this.state.filter) {
    case 'views':
      tiles = [
        (<GridTile key='viewer_sessions'>
          <Line data={DashboardStore.getData('viewer_sessions', this.props.params.projectId)} width="600" height="250"/>
          <strong>Viewer Sessions</strong>
        </GridTile>),
        (<GridTile key='searches'>
          <Line data={DashboardStore.getData('searches', this.props.params.projectId)} width="600" height="250"/>
          <strong>Searches</strong>
        </GridTile>),
        (<GridTile key='api_requests'>
          <Line data={DashboardStore.getData('api_requests', this.props.params.projectId)} width="600" height="250"/>
          <strong>API Requests (whatever this means)</strong>
        </GridTile>),
        (<GridTile key='expand'>
          <Line data={DashboardStore.getData('expand', this.props.params.projectId)} width="600" height="250"/>
          <strong>Event Detail Expand</strong>
        </GridTile>),
      ];
      break;

    case 'exports':
      tiles = [
        (<GridTile key='export'>
          <Line data={DashboardStore.getData('export', this.props.params.projectId)} width="600" height="250"/>
          <strong>Export to SIEM</strong>
        </GridTile>),
        (<GridTile key='download'>
          <Line data={DashboardStore.getData('download', this.props.params.projectId)} width="600" height="250"/>
          <strong>Downloads</strong>
        </GridTile>),
      ];
      break;
        
    case 'active':
      tiles = [
        (<GridTile key='mau'>
          <Line data={DashboardStore.getData('active_users', this.props.params.projectId)} width="600" height="250"/>
          <strong>Monthly Active Users</strong>
        </GridTile>),
        (<GridTile key='mag'>
          <Line data={DashboardStore.getData('active_groups', this.props.params.projectId)} width="600" height="250"/>
          <strong>Monthly Active Groups</strong>
        </GridTile>),
      ];
      break;

    case 'alerts':
      tiles = [
        (<GridTile key='alert_set'>
          <Line data={DashboardStore.getData('alert_set', this.props.params.projectId)} width="600" height="250"/>
          <strong>Alerts Set</strong>
        </GridTile>),
        (<GridTile key='alert_triggered'>
          <Line data={DashboardStore.getData('alert_triggered', this.props.params.projectId)} width="600" height="250"/>
          <strong>Alerts Triggered</strong>
        </GridTile>),
      ];
      break;
    }

    return (
      <div style={{padding: '20px'}}>
        <div className="pull-right">
          <SelectField
            value={this.state.filter}
            onChange={this.onChangeFilter}>
            <MenuItem value='views' primaryText="Views" />
            <MenuItem value='exports' primaryText="Downloads" />
            <MenuItem value='alerts' primaryText="Alerts" />
            <MenuItem value='active' primaryText="Active Users & Groups" />
          </SelectField>
        </div>
        <GridList cellHeight={280} cols={2}>
          {tiles}
        </GridList>
      </div>
    );
  }
}
