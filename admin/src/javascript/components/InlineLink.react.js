import * as React from 'react';
import { Link } from 'react-router';

export default class InlineLink extends React.Component {
  render() {
    return (
      <Link to={this.props.href}>{this.props.children}</Link>
    );
  }
}
