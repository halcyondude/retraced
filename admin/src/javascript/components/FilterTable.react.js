import * as React from 'react';

import IconButton from 'material-ui/IconButton';

import NoFilters from '../components/NoFilters.react';
import CardTable from '../components/CardTable.react';
import FilterDialog from '../components/FilterDialog.react';

import FilterStore from '../stores/FilterStore';
import FilterActions from '../actions/FilterActions';
import AlertActions from '../actions/AlertActions';
import SessionStore from '../stores/SessionStore';

export default class FilterTable extends React.Component {
  constructor(props) {
    super(props);

    this.unsubscribe = [];
    this.state = {
      filterDialogOpen: false,
      filterDialogFilter: null
    };

    this.binder('onSessionChanged', 'onFiltersLoaded');
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  componentDidMount() {
    this.unsubscribe.push(SessionStore.listen(this.onSessionChanged));
  }

  componentWillUnmount() {
    this.unsubscribe.forEach((u) => u());
  }

  loadFilters() {
    FilterActions.load(this.props.params.projectId, this.onFiltersLoaded);
  }

  onFiltersLoaded(errMsg) {
    if (errMsg) {
      AlertActions.error('Error loading filters', errMsg);
      return;
    }
    this.forceUpdate();
  }

  onSessionChanged() {
    this.loadFilters();
  }

  render() {
    if (!FilterStore.hasFilters()) {
      return (
        <div style={{marginLeft: 'auto', marginRight: 'auto', display: 'block', width: '600px'}}>
          <NoFilters projectId={this.props.projectId} onShowCreateFilter={this.props.onShowCreateFilter} />
        </div>
      );
    }

    const filters = this.props.filters || [];
    const rows = filters.map((filter) => [
      <IconButton
        iconClassName='material-icons action-icon'
        tooltipPosition='bottom-center'
        onClick={this.handleFilterEdit.bind(this, filter.id)}>mode_edit</IconButton>,
      filter.name
    ]);
    rows.unshift(['', 'Name']);

    return (
      <div>
        <CardTable
          headerText='Filters'
          tableClassName='filters-table'
          rows={rows}
          rowKey={(i) => i ? filters[i - 1].id : ''}
          onAdd={this.props.onShowCreateFilter} />
        <FilterDialog
          open={this.state.filterDialogOpen}
          filter={this.state.filterDialogFilter}
          onCancel={this.handleFilterDialogCancel}
          onUpdate={this.handleFilterDialogUpdate}
          onDelete={this.handleFilterDialogDelete} />
      </div>
    );
  }
}
