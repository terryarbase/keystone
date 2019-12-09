var React = require('react'),
	Field = require('../Field'),
	ArrayFieldMixin = require('../../mixins/DateArrayField'),
	Calendar = require('../../components/Calendar');

module.exports = Field.create({
	
	displayName: 'DateArrayField',
	
	// mixins: [ArrayFieldMixin]
	getDefaultProps: function() {
		return {
			format: 'yyyy-MM-dd',
			pickers: []
		};
	},

	// getInitialState: function() {
	// 	var value = this.props;
	// 	if (!value) {
	// 		value = [];
	// 	} else if (!Array.isArray(value)) {
	// 		value = [ value ];
	// 	}
	// 	return {
	// 		values: value.map(newItem)
	// 	};
	// },
	
	addItem: function() {
		var value = this.props;
		if (!value) {
			value = [];
		} else if (!Array.isArray(value)) {
			value = [ value ];
		}
		var newValues = value.concat(newItem(''));
		this.valueChanged(_.pluck(newValues, 'value'));
	},
	
	removeItem: function(i) {
		var value = this.props;
		if (!value) {
			value = [];
		} else if (!Array.isArray(value)) {
			value = [ value ];
		}
		var newValues = _.without(value, i);
		this.valueChanged(_.pluck(newValues, 'value'));
	},
	
	updateItem: function(i, event) {
		var value = this.props;
		if (!value) {
			value = [];
		} else if (!Array.isArray(value)) {
			value = [ value ];
		}
		var updatedValues = value;
		var updateIndex = updatedValues.indexOf(i);
		updatedValues[updateIndex].value = this.cleanInput ? this.cleanInput(event.target.value) : event.target.value;
		this.valueChanged(_.pluck(updatedValues, 'value'));
	},
	
	valueChanged: function(values) {
		this.props.onChange({
			path: this.props.path,
			value: values
		});
	},
	renderItem: function(i) {
		console.log(i);
		/* eslint-disable no-script-url */
		return (
			<div key={i} className='field-item'>
				<a href="javascript:;" className='field-item-button btn-cancel' onClick={this.removeItem.bind(this, i)}>&times;</a>
				<input className={'form-control multi datepicker_' + i} type='text' name={this.getInputName(this.props.path)} value={i} onChange={this.updateItem.bind(this, i)} autoComplete='off' />
			</div>
		);
		/* eslint-enable */
	},
	
	renderField: function () {
		var value = this.props;
		const dates = [];
		if (!value) {
			value = [];
		} else if (!Array.isArray(value)) {
			value = [ value ];
		}
		value.forEach(function(v) {
			dates.push(moment(v));
		});
		return (
			<div>
				<Calendar selectedDates={dates} />
				{value.map(this.renderItem)}
			</div>
		);
	}
});
