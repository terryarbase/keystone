var React = require('react');
var moment = require('moment');
var _ = require('underscore');
var dateFns = require('date-fns');

module.exports = React.createClass({
  displayName: 'Calendar',
  getInitialState: function() {
    return this.getData();
  },
  componentWillReceiveProps: function(nextProps) {
    const selectedDates = nextProps.selectedDates;
    const currentDates = this.props.selectedDates;
    if (selectedDates.length !== currentDates.length) {
      this.setState({
        selectedDate: selectedDates,
      });
    }
  },
  getFirstMonth: function(dates) {
    return !!dates.length ? moment(dates[0]) : moment();
  },
  getData: function() {
    var selected = this.props.selectedDates;
    if (!selected) {
      selected = [];
    } else if (!Array.isArray(selected)) {
      selected = [ selected ];
    }
   return {
      currentMonth: this.getFirstMonth(selected),
      selectedDate: selected,
    };
  },
  normalize: function(selected) {
    var newSelected = _.sortBy(selected, function(s) {
      return moment(s);
    });
    newSelected = _.uniq(newSelected, function(s) {
      return moment(s);
    });

    return newSelected;
  },
  onDateClick: function(day, isSelected) {
    var selected = this.state.selectedDate;
    if (isSelected) {
      selected = _.filter(selected, function(d) {
        return moment(d).format('YYYY-MM-DD') !== moment(day).format('YYYY-MM-DD');
      });
    } else {
      selected.push(day);
    }

    selected = this.normalize(selected);
    this.setState({
      // currentMonth: this.getFirstMonth(selected),
      selectedDate: selected,
    });
    this.props.valueChanged(selected);
  },
  onMonthClick: function() {
    var selected = this.state.selectedDate;
    const monthEnd = moment(this.state.currentMonth).endOf('month');
    const currentDate = moment();
    const diff = monthEnd.diff(currentDate, 'days');
    for(var i = 0 ; i < diff ; i++) {
      var cloned = currentDate.clone();
      selected.push(cloned);
      currentDate.add(1, 'day');
    }
    selected = this.normalize(selected);
    this.setState({
      // currentMonth: this.getFirstMonth(selected),
      selectedDate: selected,
    });
    this.props.valueChanged(selected);
  },
  nextMonth: function() {
    this.setState({
      currentMonth: moment(this.state.currentMonth).add(1, 'months'),
    });
  },

  prevMonth: function() {
    this.setState({
      currentMonth: moment(this.state.currentMonth).add(-1, 'months'),
    });
  },

  renderHeader: function() {
    const dateFormat = "MMMM YYYY";
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
    const dateFormat = "DDDD";
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
    var selected = this.state.selectedDate;
    if (!selected) {
      selected = [];
    } else if (!Array.isArray(selected)) {
      selected = [ selected ];
    }
    return !!_.find(selected, function(s) {
      return moment(s).format('YYYY-MM-DD') == moment(date).format('YYYY-MM-DD');
    });
  },

  renderCells: function() {
    const currentMonth = this.state.currentMonth;
    const monthStart = moment(currentMonth).startOf('month');
    // dateFns.startOfMonth(currentMonth);
    const monthEnd = moment(currentMonth).endOf('month');
    // dateFns.endOfMonth(monthStart);
    const startDate = moment(monthStart).startOf('week');
    // dateFns.startOfWeek(monthStart);
    const endDate = moment(monthEnd).endOf('week');
    // dateFns.endOfWeek(monthEnd);

    const dateFormat = "DD";
    const rows = [];

    var days = [];
    var day = startDate;
    var formattedDate = "";
    const onDateClick = this.onDateClick;
    while (day.isSame(endDate) || day.isBefore(endDate)) {
      for (var i = 0; i < 7; i++) {
        formattedDate = day.format(dateFormat);

        // dateFns.format(day, dateFormat);
        const cloneDay = day.clone();
        const isSelected = this.isSelected(day);
        days.push(
          <div
            className={`col cell ${
              !moment(day).isSame(monthStart, 'month')
                ? "disabled"
                : isSelected ? "selected" : ""
            }`}
            key={day}
            onClick={function() {
              onDateClick(cloneDay, isSelected);
            }}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
          </div>
        );
        day = day.add(1, 'day');
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
    var buttonText = "Select All Dates ("+moment(this.currentMonth.format('MMMM'))+")";
    return (
      <div className="calendar_container">
        <div className="calendar">
          {this.renderHeader()}
          {this.renderDays()}
          {this.renderCells()}
        </div>
        <input type="button"
          value={buttonText}
          className="calendar_selectAll"
          onClick={this.onMonthClick}
        />
      </div>
    );
  }
});
