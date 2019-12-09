var React = require('react');
var moment = require('moment');
var _ = require('underscore');
var dateFns = require('date-fns');

module.exports = React.createClass({
  displayName: 'Calendar',
  getInitialState: function() {
    return this.getData();
  },

  getData: function() {
    var selected = this.props.selectedDates;
    if (!selected) {
      selected = [];
    } else if (!Array.isArray(selected)) {
      selected = [ selected ];
    }
    var currentMonth = !!selected.length ? moment(selected[0]) : moment();
   return {
      currentMonth: currentMonth,
      selectedDate: selected,
    };
  },

  onDateClick: function(day) {
    this.setState({
      selectedDate: day
    });
  },

  nextMonth: function() {
    this.setState({
      currentMonth: moment(this.state.currentMonth).add(1, 'months'),
    });
  },

  prevMonth: function() {
    this.setState({
      currentMonth: moment(this.state.currentMonth).add(1, 'months'),
    });
  },

  renderHeader: function() {
    const dateFormat = "MMMM yyyy";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{
            moment(this.state.currentMonth).format(dateFormat)
          }</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  },

  renderDays: function() {
    const dateFormat = "dddd";
    const days = [];

    let startDate = moment(this.state.currentMonth).startOf('week');
    // dateFns.startOfWeek(this.state.currentMonth);
    const weeks = [
      'SU',
      'MO',
      'TU',
      'WE',
      'TH',
      'FR',
      'SA',
    ];
    for (let i = 0; i < weeks.length; i++) {
      // var dayStr = dateFns.format(dateFns.addDays(startDate, i), dateFormat);
      // dayStr = dayStr.substr(0, 3);
      days.push(
        <div className="col col-center" key={i}>
          {weeks[i]}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  },

  isSelected: function(date) {
    var selected = this.props.selectedDates;
    if (!selected) {
      selected = [];
    } else if (!Array.isArray(selected)) {
      selected = [ selected ];
    }
    return !!_.find(selected, function(s) {
      return moment(s).isSame(moment(date), 'day');
    });
  },

  renderCells: function() {
    const currentMonth = this.state.currentMonth;
    const selectedDate = this.state.selectedDate;
    const monthStart = moment(currentMonth).startOf('month');
    // dateFns.startOfMonth(currentMonth);
    const monthEnd = moment(currentMonth).endOf('month');
    // dateFns.endOfMonth(monthStart);
    const startDate = moment(monthStart).startOf('week');
    // dateFns.startOfWeek(monthStart);
    const endDate = moment(monthEnd).endOf('week');
    // dateFns.endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";
    const onDateClick = this.onDateClick;
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = moment(day).format(dateFormat);
        // dateFns.format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              !moment(day).isSame(monthStart, 'month')
                ? "disabled"
                : this.isSelected(day) ? "selected" : ""
            }`}
            key={day}
            onClick={function() {
              onDateClick(moment(cloneDay));
            }}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  },

  render: function() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
      </div>
    );
  }
});
