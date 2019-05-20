import * as React from 'react';
import * as moment from 'moment';
import * as _ from 'lodash';
import AceEditor from 'react-ace';
import * as autoBind from "react-autobind";

import "brace/mode/javascript";
import "brace/theme/github";

import {
  FlatButton,
  RefreshIndicator,
  Toolbar,
  Dialog,
} from "material-ui";

import EventActions from '../actions/EventActions';
import EventStore from '../stores/EventStore';
import SessionStore from '../stores/SessionStore';

import NoEvents from '../components/NoEvents.react';
import SearchEmpty from '../components/SearchEmpty.react';
import SearchBar from '../components/SearchBar.react';
import EventsTable from '../components/EventsTable.react';
import Loading from '../components/Loading.react';
import EventsPager from '../components/EventsPager.react';

// TODO(zhaytee): This should be client-configurable
const resultsPerPage = 25;

export default class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      exportDialogOpen: false,
      currentPage: 0,
      pageCount: 0,
      searchCount: 0,
      initialFetchStarted: false,
      initialFetchCount: -1,
      waitingForSearchCompletion: false,
      dateRangeStartTime: "Any time",
      dateRangeEndTime: "Any time",
      showCreate: true,
      showRead: false,
      showUpdate: true,
      showDelete: true,
    };

    this.performNewDeepSearchDebounced = _.debounce((q) => {
      this.performNewDeepSearch(q);
    }, 300);    

    autoBind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // If the date/time ranges change, start a new search
    var startNewSearch = false;
    startNewSearch = startNewSearch || (this.state.dateRangeStartDate !== prevState.dateRangeStartDate);
    startNewSearch = startNewSearch || (this.state.dateRangeStartTime !== prevState.dateRangeStartTime);
    startNewSearch = startNewSearch || (this.state.dateRangeEndDate !== prevState.dateRangeEndDate);
    startNewSearch = startNewSearch || (this.state.dateRangeEndTime !== prevState.dateRangeEndTime);
    startNewSearch = startNewSearch || (this.state.showCreate !== prevState.showCreate);
    startNewSearch = startNewSearch || (this.state.showRead !== prevState.showRead);
    startNewSearch = startNewSearch || (this.state.showUpdate !== prevState.showUpdate);
    startNewSearch = startNewSearch || (this.state.showDelete !== prevState.showDelete);

    if (startNewSearch) {
      this.performNewDeepSearch();
    }
  }

  componentWillUnmount() {
    //SessionStore.removeChangeListener(this.onSessionChange);
    //EventStore.removeChangeListener(this.onEventsChange);
  }

  componentDidMount() {
    var token = this.props.params.token;
    SessionStore.listen(this.onSessionChange);
    EventStore.listen(this.onEventsChange);

    // Initial events fetch.
    this.setState({
      initialFetchStarted: true,
    });
    this.performNewDeepSearch("");
  }

  onSessionChange() {
    if (SessionStore.isLoaded()) {
      this.history.replaceState(null, "/");
    } else if (!SessionStore.isAuthenticated()) {
      this.history.replaceState(null, "/");
    }
  }

  onEventsChange(events) {
    const newPage = events.offset / resultsPerPage;
    let newState = {
      events: events.events,
      searchCount: events.totalResultCount,
      pageCount: Math.floor(events.totalResultCount / resultsPerPage),
      currentPage: newPage,
      exportDialogOpen: false,
    };
    if (this.state.initialFetchStarted && this.state.initialFetchCount === -1) {
      newState.initialFetchCount = events.events.length;
    }
    if (this.state.waitingForSearchCompletion) {
      newState.waitingForSearchCompletion = false;
    }
    this.setState(newState);
  }

  handleExportDialogOpen() {
    this.setState({
      exportDialogOpen: true,
    });
  }

  handleExportDialogClose() {
    this.setState({
      exportDialogOpen: false,
    });
  }

  handleSearchChange(query) {
    // This is purely for the UI.
    this.setState({
      searchQuery: query,
    });

    // This is for the eventual request.
    this.performNewDeepSearchDebounced(query);
  }

  handleCancelSearchClicked() {
    this.setState({
      searchQuery: "",
    });
    this.performNewDeepSearch("");
  }


  // -_-
  handlePageNavClickedPrev() {
    this.handlePageNavClicked(-1);
  }

  handlePageNavClickedNext() {
    this.handlePageNavClicked(1);
  }

  handlePageNavClicked(delta) {
    const newPage = this.state.currentPage + delta;
    const params = {
      query: {
        search_text: this.state.searchQuery || "",
        length: resultsPerPage,
        offset: newPage * resultsPerPage,
        create: this.state.showCreate,
        read: this.state.showRead,
        update: this.state.showUpdate,
        delete: this.state.showDelete,
      },
    };

    let times = this.currentTimeRanges();
    if (times.startTime) {
      params.query.start_time = times.startTime;
    }
    if (times.endTime) {
      params.query.end_time = times.endTime;
    }

    EventActions.search(
      params,
      this.props.params.projectId,
    );
    this.setState({
      waitingForSearchCompletion: true,
    });
  }


  handleDatesChange(startDate, startTime, endDate, endTime) {
    this.setState({
      dateRangeStartDate: startDate,
      dateRangeStartTime: startTime,
      dateRangeEndDate: endDate,
      dateRangeEndTime: endTime,
    });
  }

  handleCrudChange(cr, re, up, de) {
    this.setState({
      showCreate: cr,
      showRead: re,
      showUpdate: up,
      showDelete: de,
    });
  }

  handleExportClicked() {
    this.setState({
      exportDialogOpen: true,
      currentQueryDescriptor: this.generateQueryDescriptor(),
    });
  }

  // This is what gets saved to the "saved exports" database.
  // If you change anything, bump the version field and add a migration somewhere.
  generateQueryDescriptor() {
    const times = this.currentTimeRanges();
    // version 1
    return {
      showCreate: this.state.showCreate,
      showRead: this.state.showRead,
      showUpdate: this.state.showUpdate,
      showDelete: this.state.showDelete,
      searchQuery: this.state.searchQuery || "",
      startTime: times.startTime,
      endTime: times.endTime,
    };
  }

  currentTimeRanges() {
    let result = {};
    let startDate = this.state.dateRangeStartDate;
    if (startDate) {
      let s = moment(startDate);
      let startDateAdjusted = `${s.get("year")}-${s.get("month") + 1}-${s.get("date")}`;
      let startTime = "12:00 AM";
      if (this.state.dateRangeStartTime && this.state.dateRangeStartTime !== "Any time") {
        startTime = this.state.dateRangeStartTime;
      }
      let start = `${startDateAdjusted} ${startTime}`;
      result.startTime = moment(start, "YYYY-MM-DD hh:mm a").valueOf();
    }
    let endDate = this.state.dateRangeEndDate;
    if (endDate) {
      let e = moment(endDate);
      let endDateAdjusted = `${e.get("year")}-${e.get("month") + 1}-${e.get("date")}`;
      let endTime = "11:59 PM";
      if (this.state.dateRangeEndTime && this.state.dateRangeEndTime !== "Any time") {
        endTime = this.state.dateRangeEndTime;
      }
      let end = `${endDateAdjusted} ${endTime}`;
      result.endTime = moment(end, "YYYY-MM-DD hh:mm a").valueOf();
    }
    return result;
  }

  performNewDeepSearch(searchText) {
    const token = this.props.params.token;
    const params = {
      query: {
        search_text: searchText,
        length: resultsPerPage,
        create: this.state.showCreate,
        read: this.state.showRead,
        update: this.state.showUpdate,
        delete: this.state.showDelete,
      },
    };

    let times = this.currentTimeRanges();
    if (times.startTime) {
      params.query.start_time = times.startTime;
    }
    if (times.endTime) {
      params.query.end_time = times.endTime;
    }

    EventActions.search(
      params,
      this.props.params.projectId,
    );
    this.setState({
      waitingForSearchCompletion: true,
    });
  }

  handleEventZoomDialogClose() {
    this.setState({
      zoomedEvent: null,
    });
  }

  zoomEvent(event) {
    this.setState({
      zoomedEvent: event,
    });
  }

  render() {
    if (this.state.initialFetchCount === -1) {
      return (
        <div className="row" style={{ position: "absolute", "left": "50%", top: "50%" }}>
          <RefreshIndicator size={100} left={-50} top={-50} status="loading" loadingColor="#039BE5" />
        </div>
      );
    } else if (this.state.initialFetchCount === 0) {
      return (
        <div className="flex1" style={{ marginLeft: "auto", marginRight: "auto", display: "block", width: "600px" }}>
          <NoEvents projectId={this.props.params.projectId} />
        </div>
      );
    }

    let zoomedEventContents;
    if (this.state.zoomedEvent) {
      // The raw event is a JSON string, but we want to reformat it all pretty-like.
      const rawObj = JSON.parse(this.state.zoomedEvent.raw);
      const raw = JSON.stringify(rawObj, null, 2);
      zoomedEventContents = (
        <AceEditor
          mode="javascript"
          theme="github"
          width="100%"
          height="100vh"
          readOnly={true}
          showGutter={false}
          showPrintMargin={false}
          editorProps={{ $blockScrolling: true }}
          value={raw}
          />
      );
    }

    return (
      <div style={{ padding: "20px 0 0" }} className="flex-column flex1">
        <div style={{ width: "100%", height: "100%" }} className="flex-column flex1">
          <Toolbar style={{ height: "72px", backgroundColor: "#fff", padding: "24px 24px 30px" }}>
            <SearchBar
              query={this.state.searchQuery}
              onQueryChange={this.handleSearchChange}
              startDate={this.state.dateRangeStartDate}
              startTime={this.state.dateRangeStartTime}
              endDate={this.state.dateRangeEndDate}
              endTime={this.state.dateRangeEndTime}
              onDatesChange={this.handleDatesChange}
              showCreate={this.state.showCreate}
              showRead={this.state.showRead}
              showUpdate={this.state.showUpdate}
              showDelete={this.state.showDelete}
              onCrudChange={this.handleCrudChange}
              />
          </Toolbar>
          {this.state.events.length ?
            <EventsTable
              projectId={this.props.params.projectId}
              events={this.state.events}
              viewOutput={this.zoomEvent}
              />
            :
            <div className="flex1" style={{ marginLeft: "auto", marginRight: "auto", marginBottom: "2em", display: "block", width: "600px" }}>
              <SearchEmpty />
            </div>
          }
          <Toolbar style={{ height: "auto", padding: "24px", backgroundColor: "#ccc" }}>
            <EventsPager
              pageCount={this.state.pageCount}
              currentPage={this.state.currentPage}
              searchCount={this.state.searchCount}
              isLoading={this.state.waitingForSearchCompletion}
              onBack={this.handlePageNavClickedPrev}
              onNext={this.handlePageNavClickedNext}
              onExport={this.handleExportClicked}
              />
          </Toolbar>

          <Dialog
            title="Raw Event Payload"
            open={!!this.state.zoomedEvent}
            onRequestClose={this.handleEventZoomDialogClose}
            actions={<FlatButton label="Close" primary={true} onClick={this.handleEventZoomDialogClose} />}>
            {zoomedEventContents}
          </Dialog>

        </div>
      </div>
    );
  }
}