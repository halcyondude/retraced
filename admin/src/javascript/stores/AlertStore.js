import * as Reflux from 'reflux';
import AlertActions from '../actions/AlertActions';
import * as _ from 'lodash';

var defaultState = {
  loaded: false,
  alert: {
    severity: 'danger',
    title: '',
    body: '',
    visible: false
  }
};

var AlertStore = Reflux.createStore({
  listenables: [AlertActions],

  init: function() {
    this.alert = _.cloneDeep(defaultState);
  },

  getInitialState: function() {
    return this.alert;
  },

  onError: function(title, body) {
    var alert = {
      severity: 'danger',
      title: title,
      body: body,
      visible: true
    };
    this.trigger(alert);
  },

  onSuccess: function(title, body) {
    var alert = {
      severity: 'success',
      title: title,
      body: body,
      visible: true
    };
    this.trigger(alert);
  },

  onDismiss: function() {
    this.alert.visible = false;
    this.trigger(this.alert);
  }
});

export default AlertStore;
