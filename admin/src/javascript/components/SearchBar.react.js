import * as React from "react";
import * as autoBind from "react-autobind";
import {
  ToolbarGroup,
  TextField,
} from "material-ui";

import DateFilter from "./DateFilter.react";
import CrudFilter from "./CrudFilter.react";

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showAdvanced: false,
      advancedAnchor: null,
      startDate: props.startDate,
      startTime: props.startTime,
      endDate: props.endDate,
      endTime: props.endTime,
      showCreate: true,
      showRead: false,
      showUpdate: true,
      showDelete: true,
    };

    autoBind(this);
  }

  handleSearchChange(event) {
    // This is purely for the UI.
    this.setState({
      searchQuery: event.target.value,
    });

    if (this.props.onQueryChange) {
      this.props.onQueryChange(event.target.value);
    }
  }

  render() {
    const flexStyle = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    };

    return (
      <ToolbarGroup style={flexStyle}>
        <TextField
          hintText="Search Events"
          style={{ width: "400px" }}
          onChange={this.handleSearchChange}
          value={this.props.query}
          />
        <DateFilter
          onDatesChange={this.props.onDatesChange}
          startDate={this.props.startDate}
          startTime={this.props.startTime}
          endDate={this.props.endDate}
          endTime={this.props.endTime} />
        <CrudFilter
          onCrudChange={this.props.onCrudChange}
          create={this.props.showCreate}
          read={this.props.showRead}
          update={this.props.showUpdate}
          delete={this.props.showDelete} />
      </ToolbarGroup>
    );
  }
}
