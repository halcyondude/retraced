import * as React from 'react';
import * as numeral from 'numeral';
import NavigationArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import NavigationArrowForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import {
  ToolbarGroup,
  FlatButton,
  CircularProgress,
} from 'material-ui';

// props: currentPage, searchCount, pageCount, waiting, onPrevious, onNext
export default class EventsPager extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const flexStyle = {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    };
    const page = this.props.currentPage + 1;
    const plural = this.props.searchCount != 1 ? 's' : '';
    let count = numeral(this.props.searchCount).format('0,0');
    if (this.props.searchCount === 0) {
      count = 'No';
    }
    const readout = `Page ${page} of ${this.props.pageCount || 1} (${count} event${plural} found)`;

    const prevEnabled = !this.props.waiting && this.props.currentPage > 0;
    const nextEnabled = !this.props.waiting && this.props.currentPage < this.props.pageCount - 1;
    let prevStyle = { verticalAlign: 'middle' };
    if (!prevEnabled) {
      prevStyle.fill = 'rgb(171, 171, 171)';
    }
    let nextStyle = { verticalAlign: 'middle' };
    if (!nextEnabled) {
      nextStyle.fill = 'rgb(171, 171, 171)';
    }

    let refreshStyle = {};
    if (!this.props.waiting) {
      refreshStyle.visibility = 'hidden';
    }

    return (
      <ToolbarGroup style={flexStyle}>
        <FlatButton style={{ height: '51px' }} disabled={!prevEnabled} onClick={this.props.onPrevious}>
          <NavigationArrowBackIcon style={prevStyle} />
        </FlatButton>
        <CircularProgress style={refreshStyle} />
        <FlatButton style={{ height: '51px' }} disabled={!nextEnabled} onClick={this.props.onNext}>
          <NavigationArrowForwardIcon style={nextStyle} />
        </FlatButton>
        <span>{readout}</span>
      </ToolbarGroup>
    )
  }
}