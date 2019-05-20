import * as _ from 'lodash';
import * as React from 'react'; //eslint-disable-line no-unused-vars
var ValidationMixin = require('react-validation-mixin');

var FormMixin = {
  mixins: [ValidationMixin],

  handleChange: function(field, e) {
    var nextState = this.state;
    if (e.target.type === 'checkbox' || e.target.type === 'radio') {
      nextState[field] = e.target.checked;
    } else {
      nextState[field] = e.target.value;
    }
    // TODO: select???
    this.setState(nextState);
  },

  handleInputChange: function(field, value) {
    var nextState = this.state;
    nextState[field] = value;
    this.setState(nextState);
  },

  validationState(field) {
    if (!this.isValid(field)) {
      return 'error';
    }
  },

  getValidationErrorMessages: function() {
    var validationErrors = [];
    _.each(this.state.errors, function(errors) {
      if (errors && errors.length > 0) {
        validationErrors.push(errors[0]);
      }
    });
    return validationErrors;
  }
};

export default FormMixin;
