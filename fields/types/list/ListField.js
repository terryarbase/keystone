/* eslint-disable react/jsx-no-bind */

var React = require('react');
var Field = require('../Field');
var _ = require('lodash');

var Domify = require('react-domify');


var i = 0;
function generateId () {
	return i++;
};

function ItemDom(option) {
	return (
		<div style={{
			borderTop: '2px solid #eee',
			paddingTop: 15,
		}}>
			{name && <input type="hidden" name={option.name} value={option.id}/>}
			
			{React.Children.map(children, child => {
				return React.cloneElement(child, {
					name,
					id,
					onRemove,
					t,
				});
			})}

			<div style={{ textAlign: 'right', paddingBottom: 10 }}>
				<input type="button" onClick={option.onRemove} value="Remove" />
			</div>
		</div>
	);
};

module.exports = Field.create({
	displayName: 'ListField',
	addItem () {
		var value = this.props.value;
		var onChange = this.props.onChange;
		onChange({
			path: this.props.path,
			value: _.concat([], value, 
				[
					{
						id: generateId(),
						_isNew: true,
					}
				]
			)
		});
	},
	removeItem (index) {
		var oldValue = this.props.value;
		var path = this.props.path;
		var onChange = this.props.onChange;
		var value = oldValue.slice(0, index).concat(oldValue.slice(index + 1));
		onChange({
			path: path,
			value: value,
		});
	},
	handleFieldChange (index, event) {
		var oldValue = this.props.value;
		var path = this.props.path;
		var onChange = this.props.onChange;
		var head = oldValue.slice(0, index);
		var item = _.assign({}, oldValue[index]);
		_.set(item, event.path, event.value)
		var tail = oldValue.slice(index + 1);
		var value = _.concat([], head, [item], tail);
		onChange({ path, value });
	},
	renderFieldsForItem (index, value) {
		return Object.keys(this.props.fields).map(function(path) {
			var field = this.props.fields[path];
			if (typeof Fields[field.type] !== 'function') {
				return React.createElement(InvalidFieldType, {
					type: field.type,
					path: field.path,
					key: field.path,
				});
			}

			var list = _.cloneDeep(this.props.list);
			list.fields = this.props.list.fields[this.props.path].fields;

			// cant get child state here, so imitate state from parent props data
			var state = {
				values: this.props.values[this.props.path][index],
			};

			var props = _.assign({}, field);
			props.list = list;
			props.path = field.path;
			props.value = value[field.path];
			props.values = value;
			props.onChange = this.handleFieldChange.bind(this, index);
			props.mode = 'edit';
			props.inputNamePrefix = this.props.path + '[' + index + ']';
			props.key = field.path;

			return React.createElement(Fields[field.type], props);
		}, this);
	},
	renderItems () {
		var value = this.props.value ? this.props.value : [];
		var path = this.props.path;
		var onAdd = this.addItem;
		return (
			<div>
				{
					value.map(function(value, index) {
						var id = value.id;
						var _isNew = value._isNew;
						var name = !_isNew ? path + '[' + index + '][id]' : null;
						var onRemove = function(e) {
							this.removeItem(index);
						}
						var props = {
							id: id,
							name: name,
							onRemove: onRemove,
						};
						return (
							<ItemDom key={id} {props}>
								{this.renderFieldsForItem(index, value)}
							</ItemDom>
						);
					})
				}
				<input type="button" value="Add" onClick={onAdd} />
			</div>
		);
	},
	renderUI () {
		var value = this.props.value;
		var required = this.props;
		var label = this.props.label ? this.props.label + '' + (required ? ' *' : '') : null;
		return (
			<div>
				<h3>{label}</h3>
				{this.shouldRenderField() ? (
					this.renderItems()
				) : (
					<Domify value={value} />
				)}
			</div>
		);
	},
});
