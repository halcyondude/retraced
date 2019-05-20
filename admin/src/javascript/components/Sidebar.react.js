import * as React from 'react';
import { browserHistory } from 'react-router';
import * as classNames from 'classnames';

import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import {blueGrey300} from 'material-ui/styles/colors';

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: props.active,
      expanded: false
    };

    this.onSelect = this.onSelect.bind(this);
    this.onExpand = this.onExpand.bind(this);
    this.onCollapse = this.onCollapse.bind(this);
  }

  onSelect(item) {
    this.setState({active: item, expanded: false});
    browserHistory.push('/project/' + this.props.params.projectId + '/' + item);
    if (this.props.onItemSelected) {
      this.props.onItemSelected(item);
    }
  }

  onExpand() {
    this.setState({expanded: true});
  }

  onCollapse() {
    this.setState({expanded: false});
  }

  render() {
    var buttonClasses, labelStyle;
    if (this.state.expanded) {
      buttonClasses = {
        lineHeight: '48px',
        minWidth: '256px',
        height: '36px',
        textAlign: 'left',
        paddingLeft: '22px'
      };
      labelStyle = {
        top: '-4px',
        fontSize: '0.9em',
        textTransform: 'initial',
        color: '#555'
      };
    } else {
      buttonClasses = {
        lineHeight: '48px',
        minWidth: '64px',
        height: '36px',
        textAlign: 'left',
        paddingLeft: '22px'
      };
      labelStyle = {
        fontSize: '0.9em',
        color: '#555'
      };
    }

    var iconClasses = {
      fontSize: '18px',
      color: '#555'
    };

    var rootClasses = classNames('left-nav', {expanded: this.state.expanded});
    return (
      <div className={rootClasses} onMouseEnter={this.onExpand} onMouseLeave={this.onCollapse}>
        <div className={classNames('left-nav-item', {active: this.state.active === 'dashboard'})}>
          <FlatButton onClick={this.onSelect.bind(this, 'dashboard')} label={this.state.expanded ? 'Dashboard' : ''} style={buttonClasses} labelStyle={labelStyle}>
            <FontIcon className="material-icons" style={iconClasses} color={this.state.active === 'dashboard' ? '#1c84c2' : blueGrey300}>dashboard</FontIcon>
          </FlatButton>
        </div>
        <div className={classNames('left-nav-item', {active: this.state.active === 'events'})}>
          <FlatButton onClick={this.onSelect.bind(this, 'events')} label={this.state.expanded ? 'Events' : ''} style={buttonClasses} labelStyle={labelStyle}>
            <FontIcon className="material-icons" style={iconClasses} color={this.state.active === 'events' ? '#1c84c2' : blueGrey300}>view_stream</FontIcon>
          </FlatButton>
        </div>
        <div className={classNames('left-nav-item', {active: this.state.active === 'actions'})}>
          <FlatButton onClick={this.onSelect.bind(this, 'actions')} label={this.state.expanded ? 'Actions' : ''} style={buttonClasses} labelStyle={labelStyle}>
            <FontIcon className="material-icons" style={iconClasses} color={this.state.active === 'events' ? '#1c84c2' : blueGrey300}>code</FontIcon>
          </FlatButton>
        </div>
        <div className={classNames('left-nav-item', {active: this.state.active === 'actors'})}>
          <FlatButton onClick={this.onSelect.bind(this, 'actors')} label={this.state.expanded ? 'Actors' : ''} style={buttonClasses} labelStyle={labelStyle}>
            <FontIcon className="material-icons" style={iconClasses} color={this.state.active === 'actors' ? '#1c84c2' : blueGrey300}>recent_actors</FontIcon>
          </FlatButton>
        </div>
        <div className={classNames('left-nav-item', {active: this.state.active === 'targets'})}>
          <FlatButton onClick={this.onSelect.bind(this, 'targets')} label={this.state.expanded ? 'Targets' : ''} style={buttonClasses} labelStyle={labelStyle}>
            <FontIcon className="material-icons" style={iconClasses} color={this.state.active === 'targets' ? '#1c84c2' : blueGrey300}>folder</FontIcon>
          </FlatButton>
        </div>
        <div className={classNames('left-nav-item', {active: this.state.active === 'settings'})}>
          <FlatButton onClick={this.onSelect.bind(this, 'settings')} label={this.state.expanded ? 'Settings' : ''} style={buttonClasses} labelStyle={labelStyle}>
            <FontIcon className="material-icons" style={iconClasses} color={this.state.active === 'settings' ? '#1c84c2' : blueGrey300}>settings</FontIcon>
          </FlatButton>
        </div>
      </div>
    );
  }
}
