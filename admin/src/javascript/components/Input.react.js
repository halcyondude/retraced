import * as React from 'react';

var Input = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired
  },

  getValue: function() {
    var node = this.refs.input;
    if (node.isCheckboxOrRadio()) {
      return node.getChecked();
    } else {
      return node.getValue();
    }
    // TODO: select
  },

  handleOnChange: function() {
    if (this.props.onChange) {
      this.props.onChange(this.props.name, this.getValue());
    }
  },

  render: function() {
    return (
      <div>input</div>
    );
  }
});

export default Input;
