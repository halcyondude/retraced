import * as React from "react";
import { browserHistory } from "react-router";
import { CircularProgress } from "material-ui";

import SessionActions from "../actions/SessionActions";

export default class LoginCallback extends React.Component {
  componentDidMount() {
    // Note: this doubles as a login and signup function.
    SessionActions.login({
      externalAuthPayload: window.location.hash,
      cb: () => {
        browserHistory.push("/");
      },
    });
  }

  render() {
    return (
      <div>
        <CircularProgress mode="indeterminate" />
      </div>
    );
  }
}
