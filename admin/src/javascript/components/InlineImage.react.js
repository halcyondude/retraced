import * as React from 'react';
import Chip from 'material-ui/Chip';

import {orange800, white} from 'material-ui/styles/colors';

export default class InlineImage extends React.Component {
  render() {
    if (this.props.alt === 'warning') {
      return (
        <Chip backgroundColor={orange800} labelColor={white} style={{display: 'inline-block'}}>{this.props.title}</Chip>
      );
    }

    // Don't support inline images
    return (
      <span></span>
    );
  }
}





