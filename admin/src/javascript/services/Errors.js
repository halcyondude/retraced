/*eslint-disable semi*/
import * as _ from 'lodash';
import * as React from 'react'; //eslint-disable-line no-unused-vars

var Errors = {
  toString: function(err, res, fields) {
    var apiErr = _.get(res, 'body.error');
    if (apiErr) {
      switch (apiErr.messageCode) {
      case 'NOT_FOUND':
        return 'Resource not found';
      case 'NOT_IMPLEMENTED':
        return 'Method not implemented';
      case 'INVALID_PASSWORD':
        return 'Invalid email or password';
      case 'EMAIL_EXISTS':
        return 'Email already exists';
      case 'NO_ACCESS':
        return 'Access denied';
      case 'INVALID_INVITE_CODE':
        return 'Invalid invitaion code';
      case 'SCHEMA_VIOLATION':
        var messages = _.flatten(_.map(_.get(apiErr, 'validations.body'), function(validation, i) {
          var field = validation.property.split('request.body.')[1];
          var fieldName = _.get(fields, field, field);
          return _.map(validation.messages, function(message, j) {
            return (
              <div key={'error-' + i + '-' + j}>
                &bull; "{fieldName}" {message}
              </div>
            );
          });
        }));
        return (
            <div>
              <h5>Schema violations:</h5>
              {messages}
            </div>
          );
      default:
        return apiErr.message;
      }
    }
    return err.toString();
  }
};

export default Errors;
