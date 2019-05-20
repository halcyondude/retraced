import * as React from 'react';
import AceEditor from 'react-ace';

import Loading from '../components/Loading.react';

import EventActions from '../actions/EventActions';
import AlertActions from '../actions/AlertActions';

import 'brace/mode/javascript';
import 'brace/theme/github';

export default class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      event: null
    };

    this.binder('handleSessionChange', 'handleGetComplete');
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  componentDidMount() {
    const projectId = this.props.params.projectId;
    const eventId = this.props.params.id;
    EventActions.get(projectId, eventId, this.handleGetComplete);
  }

  handleGetComplete(err, ev) {
    if (err) {
      AlertActions.error('Error fetching event: ' + err);
      return;
    }

    this.setState({event: ev});
  }

  handleSessionChange() {

  }

  render() {
    if (!this.state.event) {
      return (
        <Loading />
      );
    }

    // The raw event is a JSON string, but we want to reformat it all pretty-like.
    const rawObj = JSON.parse(this.state.event.raw);
    const raw = JSON.stringify(rawObj, null, 2);

    return (
      <div>
        <div className='main-section'>
          <h3>Raw Event</h3>
          <div style={{width: '100%', height: '100%', paddingLeft: '20px', paddingRight: '20px'}}>
            <AceEditor
              mode="javascript"
              theme="github"
              width="100%"
              height="100vh"
              readOnly={true}
              showGutter={false}
              showPrintMargin={false}
              editorProps={{$blockScrolling: true}}
              value={raw} />
          </div>
        </div>
      </div>
    );
  }
}
