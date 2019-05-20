import * as React from 'react';
import * as Reflux from 'reflux';
import * as reactMixin from 'react-mixin';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import AlertActions from '../actions/AlertActions';
import FilterActions from '../actions/FilterActions';
import FilterStore from '../stores/FilterStore';

export default class SearchToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.unsubscribe = [];
    this.state = {
      filters: [],
      selectedFilterId: ''
    };

    this.binder('handleFiltersChanged', 'handleUpdateFilter');
  }

  binder(...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    );
  }

  componentDidMount() {
    this.unsubscribe.push(FilterStore.listen(this.handleFiltersChanged));
    this.listenTo(FilterActions.loadError, this.handleFilterLoadError);
    FilterActions.load(this.props.projectId);
  }

  componentWillUnmount() {
    this.unsubscribe.forEach((u) => u());
  }

  handleFiltersChanged() {
    const filters = FilterStore.getFiltersForProject(this.props.projectId);
    this.setState({filters});
    this.forceUpdate();
  }

  handleFilterLoadError(errMsg) {
    AlertActions.error('Error loading filters', errMsg);
  }

  handleAddFilter() {
    this.state.appliedFilters.push({type: 'filter', value: '0'});
    this.setState({appliedFilters: this.state.appliedFilters});
  }

  handleUpdateFilter(e, i, v) {
    const filter = this.state.filters.find((f) => f.id === v);
    this.setState({selectedFilterId: v});
    this.props.onFilterChange(filter);
  }

  render() {
    const filterItems = this.state.filters.map((f) => {
      return <MenuItem key={f.id} value={f.id} primaryText={f.name} />;
    });
    filterItems.unshift(<MenuItem key='' value='' primaryText='Select a filter' />);

    return (
      <div style={{height: '100vh', position: 'fixed', backgroundColor: '#f4f4f4', paddingLeft: '20px', width: '310px', overflow: 'hidden'}}>
        <h4>Filters</h4>
        <DropDownMenu
          style={{width: '100%'}}
          value={this.state.selectedFilterId}
          onChange={this.handleUpdateFilter}>
          {filterItems}
        </DropDownMenu>
      </div>
    );
  }
}

reactMixin(SearchToolbar.prototype, Reflux.ListenerMixin);
