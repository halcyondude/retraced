import * as React from "react";
import * as autoBind from "react-autobind";
import { Paper } from "material-ui";

export default class SearchEmpty extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    return (
      <Paper zDepth={1} className="no-events">
        <p>
          No events were found.
        </p>
        <p>
          Try some different search criteria!
        </p>
        <p>
          For more information, check out our <a href="http://docs.retraced.io">documentation</a>.
        </p>
      </Paper>
    );
  }
}
