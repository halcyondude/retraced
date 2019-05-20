import * as React from "react";
import * as autoBind from "react-autobind";
import {
  Avatar,
  Chip,
} from "material-ui";
import Visibility from "material-ui/svg-icons/action/visibility";
import VisibilityOff from "material-ui/svg-icons/action/visibility-off";

export default class CrudFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      filters: [
        { key: 0, label: "create", active: this.props.create },
        { key: 1, label: "read", active: this.props.read },
        { key: 2, label: "update", active: this.props.update },
        { key: 3, label: "delete", active: this.props.delete },
      ],
    };

    autoBind(this);
  }

  handleCheck(crud, isChecked) {
    if (this.props.onCrudChange) {
      const cr = crud === "create" ? isChecked : this.props.create;
      const up = crud === "update" ? isChecked : this.props.update;
      const re = crud === "read" ? isChecked : this.props.read;
      const de = crud === "delete" ? isChecked : this.props.delete;
      this.props.onCrudChange(cr, re, up, de);
    }
  }

  updateFilterState(key) {
    const { filters } = this.state;
    const isActive = filters[key].active;
    filters[key].active = !isActive;
  }

  handleFilterClick(type, key, active) {
    this.updateFilterState(key);
    this.handleCheck(type, active);
  }

  renderFilterPill(pill) {
    return (
      <Chip
        className={`FilterPill ${pill.active ? "active" : ""}`}
        key={pill.key}
        onTouchTap={() => this.handleFilterClick(pill.label, pill.key, !pill.active)}
        style={{ margin: "4px", float: "left" }}
        >
        <Avatar
          backgroundColor="transparent"
          color={pill.active ? "#ffffff" : "#9E9E9E"}
          icon={pill.active ? <Visibility /> : <VisibilityOff />}
          />
        {pill.label} Actions
      </Chip>
    );
  }

  render() {
    const { filters } = this.state;
    return (
      <div style={{ display: "inherit" }}>
        <div className="flex-row flex1">
          {filters.map(this.renderFilterPill, this)}
        </div>
      </div>
    );
  }
}
