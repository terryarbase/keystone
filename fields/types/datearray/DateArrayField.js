/* global Pikaday */
var _ = require('underscore'),
	React = require('react'),
	moment = require('moment'),
	DayPicker = require('react-day-picker'),
	Field = require('../Field');

module.exports = Field.create({
	displayName: 'DateArrayField',
	// set default properties
	getDefaultProps: function() {
		return {
			format: 'YYYY-MM-DD',
			value: []
		};
	},

	// getInitialState: function() {
	// 	var value = this.props.value;
	// 	if (!value) {
	// 		value = [];
	// 	} else if (!_.isArray(value)) {
	// 		value = [ value ];
	// 	}
	// 	return {
	// 		values: value.map(i => moment(i)),
	// 	};
	// },
	
	// componentWillReceiveProps: function(nextProps) {
	// 	var value = nextProps.value;
	// 	if (!value) {
	// 		value = [];
	// 	} else if (!_.isArray(value)) {
	// 		value = [ value ];
	// 	}
	// 	if (value.join('|') !== _.pluck(this.state.values, 'value').join('|')) {
	// 		this.setState({
	// 			values: value.map(newItem)
	// 		});
	// 	}
	// },

	// componentWillUpdate: function() {
	// 	var value = this.props.value;
	// 	if (!value) {
	// 		value = [];
	// 	} else if (!_.isArray(value)) {
	// 		value = [ value ];
	// 	}
	// 	value.forEach(function (val, i) {
	// 		// Destroy each of our datepickers
	// 		if (this.props.pickers[i]) {
	// 			this.props.pickers[i].destroy();
	// 		}
	// 	}, this);
	// },

	// componentDidUpdate: function() {
	// 	var value = this.props.value;
	// 	if (!value) {
	// 		value = [];
	// 	} else if (!_.isArray(value)) {
	// 		value = [ value ];
	// 	}
	// 	value.forEach(function (val, i) {
	// 		var dateInput = this.getDOMNode().getElementsByClassName('datepicker_' + this.state.values[i].key)[0];
	// 		// Add a date picker to each updated field
	// 		this.props.pickers[i] = new Pikaday({
	// 			field: dateInput,
	// 			format: this.props.format,
	// 			onSelect: function(date) {//eslint-disable-line no-unused-vars
	// 				if (this.props.onChange && this.props.pickers[i].toString() !== val.value) {
	// 					this.props.value[i] = this.props.pickers[i].toString();
	// 					this.props.onChange(this.props.pickers[i].toString());
	// 				}
	// 			}.bind(this)
	// 		});
	// 	}, this);
	// },

	// componentDidMount: function() {
	// 	var value = this.props.value;
	// 	if (!value) {
	// 		value = [];
	// 	} else if (!_.isArray(value)) {
	// 		value = [ value ];
	// 	}
	// 	value.forEach(function (val, i) {
	// 		var dateInput = this.getDOMNode().getElementsByClassName('datepicker_' + this.state.values[i].key)[0];
	// 		if (this.props.pickers[i]) this.props.pickers[i].destroy();
	// 		this.props.pickers[i] = new Pikaday({
	// 			field: dateInput,
	// 			format: this.props.format,
	// 			onSelect: function(date) {//eslint-disable-line no-unused-vars
	// 				if (this.props.onChange && this.props.pickers[i].toString() !== val.value) {
	// 					this.props.value[i] = this.props.pickers[i].toString();
	// 					this.props.onChange(this.props.pickers[i].toString());
	// 				}
	// 			}.bind(this)
	// 		});
	// 	}, this);
	// },
	
	// addItem: function() {
	// 	var newValues = this.state.values.concat(newItem(''));
	// 	this.setState({
	// 		values: newValues
	// 	});
	// 	this.valueChanged(_.pluck(newValues, 'value'));
	// },
	
	removeItem: function(i) {
		var newValues = _.without(this.state.values, i);
		// this.setState({
		// 	values: newValues
		// });
		this.valueChanged(_.pluck(newValues, 'value'));
	},
	
	updateItem: function(i, event) {
		var updatedValues = this.state.values;
		var updateIndex = updatedValues.indexOf(i);
		updatedValues[updateIndex].value = this.cleanInput ? this.cleanInput(event.target.value) : event.target.value;
		this.valueChanged(_.pluck(updatedValues, 'value'));
	},

	handleDayClick(day, op) {
		var selected = op.selected;
		var selectedDays = this.props.value;
		if (selected) {
		  const selectedIndex = selectedDays.findIndex(selectedDay =>
		    moment(day).isSame(moment(selectedDay), 'day')
		  );
		  selectedDays.splice(selectedIndex, 1);
		} else {
		  selectedDays.push(day);
		}
		this.valueChanged(selectedDays);
	}
	
	valueChanged: function(value) {
		this.props.onChange({
			path: this.props.path,
			value,
		});
	},

	// handleBlur: function(e) {//eslint-disable-line no-unused-vars
	// 	if (this.state.value === this.props.value) return;
	// 	this.picker.setMoment(moment(this.state.value, this.props.format));
	// },
	
	renderItem: function(i) {
		/* eslint-disable no-script-url */
		return (
			<div key={i.key} className='field-item'>
				<a href="javascript:;" className='field-item-button btn-cancel' onClick={this.removeItem.bind(this, i)}>&times;</a>
				<input className={'form-control multi datepicker_' + i.key} type='text' name={this.getInputName(this.props.path)} value={i.value} onChange={this.updateItem.bind(this, i)} autoComplete='off' />
			</div>
		);
	},
	
	renderField: function () {
		var value = this.props.value;
		if (!value) {
			value = [];
		} else if (!_.isArray(value)) {
			value = [ value ];
		}
		value = value.map(i => moment(i));
		return (
			<div>
				<DayPicker
		          selectedDays={value}
		          onDayClick={this.handleDayClick}
		        />
	        </div>
		);
	}
});
