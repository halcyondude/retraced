import * as React from 'react';

import FilterTable from '../components/FilterTable.react';
import FilterDialog from '../components/FilterDialog.react';

import FilterActions from '../actions/FilterActions';
import FilterStore from '../stores/FilterStore';
import AlertActions from '../actions/AlertActions';

export default class Filters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: props ? props.params : this.props.params,
      filterDialogOpen: false
    };

    this.binder(
      'handleFiltersChanged',
      'handleCreateFilter',
      'handleFilterDialogCancel'
    );
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  componentDidMount() {
    FilterActions.load(this.props.params.projectId);
    this.listenTo(FilterActions.loadSuccess, this.handleFiltersChanged);
    this.listenTo(FilterActions.loadError, this.handleFilterLoadError);
    this.listenTo(FilterActions.createSuccess, this.handleFiltersChanged);
    this.listenTo(FilterActions.createError, this.handleFilterCreateError);
    this.listenTo(FilterActions.updateSuccess, this.handleFiltersChanged);
    this.listenTo(FilterActions.deleteSuccess, this.handleFiltersChanged);
  }

  handleFiltersChanged() {
    this.handleFilterDialogCancel();
    this.forceUpdate();
  }

  handleFilterLoadError(errMsg) {
    AlertActions.error('Error loading filters', errMsg);
  }

  handleCreateFilter() {
    this.setState({
      filterDialogOpen: true
    });
  }

  handleFilterDialogCancel() {
    this.setState({
      filterDialogOpen: false
    });
  }

  handleFilterDialogCreate(filter) {
    FilterActions.create(filter.name, filter.conditions);
  }

  handleFilterCreateError(errMsg) {
    AlertActions.error('Error createing the filter', errMsg);
  }

  render() {
    var filters;
    if (FilterStore.isLoaded()) {
      filters = FilterStore.getFiltersForProject(this.props.params.projectId);
    }

    // really this isn't good at all...
    if (this.props.location.pathname.endsWith('/filters')) {
      return (
        <div>
          <FilterTable
            projectId={this.props.params.projectId}
            filters={filters}
            onShowCreateFilter={this.handleCreateFilter} />
          <FilterDialog
            open={this.state.filterDialogOpen}
            onCreate={this.handleFilterDialogCreate}
            onCancel={this.handleFilterDialogCancel} />
        </div>
      );
    } else {
      return (
        <div className="content">
          {this.props.children}
        </div>
      );
    }
  }
}

