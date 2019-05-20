import * as React from "react";
import * as moment from "moment";
import * as autoBind from "react-autobind";
import {
  MenuItem,
  RaisedButton,
  FlatButton,
  DropDownMenu,
  FontIcon,
  DatePicker,
  Popover,
} from "material-ui";
import { PopoverAnimationVertical } from "material-ui/Popover";

export default class DateFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      anchor: null,
      startDate: props.startDate,
      startTime: props.startTime,
      endDate: props.endDate,
      endTime: props.endTime,
    };

    autoBind(this);
  }

  handleShow(ev) {
    event.preventDefault();
    this.setState({
      show: true,
      anchor: ev.currentTarget,
    });
  }

  handleHide() {
    this.setState({
      show: false,
    });
  }

  handleClearDates() {
    this.setState({
      startDate: null,
      endDate: null,
      startTime: "Any time",
      endTime: "Any time",
    });
  }

  handleApplyDates() {
    if (this.props.onDatesChange) {
      this.props.onDatesChange(this.state.startDate, this.state.startTime, this.state.endDate, this.state.endTime);
    }
    this.setState({
      show: false,
    });
  }

  handleDateRangeStartDateChange(event, date) {
    this.setState({
      startDate: date,
    });
  }

  handleDateRangeEndDateChange(event, date) {
    this.setState({
      endDate: date,
    });
  }

  handleDateRangeStartTimeChange(event, key, payload) {
    this.setState({
      startTime: payload,
    });
  }

  handleDateRangeEndTimeChange(event, key, payload) {
    this.setState({
      endTime: payload,
    });
  }

  getAppliedDateLabel() {
    if (!this.props.startDate && !this.props.endDate) {
      return "All dates";
    }

    var label = "";
    if (this.props.startDate) {
      label = moment(this.props.startDate).format("L");
    } else {
      label = "First event";
    }

    label += " - ";

    if (this.props.endDate) {
      label += moment(this.props.endDate).format("L");
    } else {
      label += "Now";
    }

    return label;
  }

  render() {
    // TODO(zhaytee): i18n?
    let times = [
      <MenuItem key="anytime" value="Any time" primaryText="Any time" />,
    ];
    for (let i = 0; i < 24; i++) {
      let amPm;
      let hour = (i % 12) || 12;
      if (i < 12) {
        amPm = "AM";
      } else {
        amPm = "PM";
      }
      for (let j = 0; j < 2; j++) {
        let minute = j ? "30" : "00";
        let label = `${hour}:${minute} ${amPm}`;
        times.push(<MenuItem key={`${i}.${j}`} value={label} primaryText={label} />);
      }
    }

    const now = new Date();

    return (
      <div>
        <FlatButton
          label={this.getAppliedDateLabel()}
          labelPosition="before"
          onClick={this.handleShow}
          style={{ marginLeft: "15px" }}
          icon={<FontIcon className="material-icons">expand_more</FontIcon>} />
        <Popover
          open={this.state.show}
          anchorEl={this.state.anchor}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          targetOrigin={{ horizontal: "left", vertical: "top" }}
          onRequestClose={this.handleHide}
          animation={PopoverAnimationVertical}
          >
          <div style={{ padding: "20px", width: "460px" }}>
            <div>
              <span style={{ marginRight: "1em" }}>Date range:</span>
            </div>
            <div>
              <DatePicker
                name="picker.start"
                hintText="Start date"
                formatDate={(date) => { return moment(date).format("MMM Do YYYY"); } }
                value={this.state.startDate}
                autoOk={true}
                maxDate={now}
                container="inline"
                mode="landscape"
                onChange={this.handleDateRangeStartDateChange}
                />
            </div>
            <div style={{ marginTop: "-10px" }}>
              <DropDownMenu
                maxHeight={275}
                value={this.state.startTime}
                onChange={this.handleDateRangeStartTimeChange}
                >
                {times}
              </DropDownMenu>
            </div>
            <div>
              <DatePicker
                name="picker.end"
                hintText="End date"
                formatDate={(date) => { return moment(date).format("MMM Do YYYY"); } }
                value={this.state.endDate}
                autoOk={true}
                maxDate={now}
                container="inline"
                mode="landscape"
                onChange={this.handleDateRangeEndDateChange}
                />
            </div>
            <div style={{ marginTop: "-10px" }}>
              <DropDownMenu
                maxHeight={275}
                value={this.state.endTime}
                onChange={this.handleDateRangeEndTimeChange}
                >
                {times}
              </DropDownMenu>
            </div>
            <div style={{ paddingBottom: "5px", paddingTop: "20px" }}>
              <RaisedButton label="Clear" onClick={this.handleClearDates} style={{ marginRight: "10px" }} />
              <RaisedButton label="Apply" secondary={true} onClick={this.handleApplyDates} />
            </div>
          </div>
        </Popover>
      </div>
    );
  }
}
