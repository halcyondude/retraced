import * as React from 'react';
import AceEditor from 'react-ace';

import Loading from '../components/Loading.react';

import ActorActions from '../actions/ActorActions';
import AlertActions from '../actions/AlertActions';

import 'brace/mode/javascript';
import 'brace/theme/github';

export default class Actor extends React.Component {
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
    const actorId = this.props.params.id;
    ActorActions.get(projectId, actorId, this.handleGetComplete);
  }

  handleGetComplete(err, actor) {
    if (err) {
      AlertActions.error('Error fetching actor: ' + err);
      return;
    }

    this.setState({actor: actor});
  }

  handleSessionChange() {

  }

  render() {
    if (!this.state.actor) {
      return (
        <Loading />
      );
    }

    return (
      <div>
        <div className='main-section'>
          <h3>Raw Actor</h3>
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
              value={JSON.stringify(this.state.actor, null, 2)} />
          </div>
        </div>
      </div>
    );
  }
}
