/* eslint-disable react/jsx-no-bind */

var React = require('react');
var Field = require('../Field');

var i = 0;
function generateId () {
	return i++;
};

function ItemDom(props) {
	var name = props.name;
	var id = props.id;
	var onRemove = props;onRemove
	return (
		<div style={{
			borderTop: '2px solid #eee',
			paddingTop: 15,
		}}>
			{name && <input type="hidden" name={name} value={id} />}
			
			{React.Children.map(props.children, function(child) {
				console.log(child, name, id, onRemove);
				return React.cloneElement(child, {
					name,
					id,
					onRemove,
				});
			})}

			<div style={{ textAlign: 'right', paddingBottom: 10 }}>
				<input type="button" value="Remove" onClick={onRemove} />
			</div>
		</div>
	);
}

module.exports = Field.create({
	displayName: 'ListField',
	addItem () {
		var value = this.props.value;
		var onChange = this.props.onChange;
		onChange({
			path: this.props.path,
			value: [].concat(value, 
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
		var item = oldValue[index];
		item[event.path] = event.value;
		var tail = oldValue.slice(index + 1);
		var value = [].concat(head, item, tail);
		onChange({ path, value });
	},
	renderFieldsForItem (index, value) {
		var FieldTypes = this.props.FieldTypes;
		return Object.keys(this.props.fields).map(function(path) {
			var field = this.props.fields[path];
			if (typeof FieldTypes[field.type] !== 'function') {
				return React.createElement(InvalidFieldType, {
					type: field.type,
					path: field.path,
					key: field.path,
				});
			}

			var list = Object.assign({}, this.props.list);
			list.fields = this.props.list.fields[this.props.path].fields;

			// cant get child state here, so imitate state from parent props data
			var state = {
				values: this.props.values[this.props.path][index],
			};

			var props = field;
			props.list = list;
			props.path = field.path;
			props.value = value[field.path];
			props.values = value;
			props.onChange = this.handleFieldChange.bind(this, index);
			props.mode = 'edit';
			props.inputNamePrefix = this.props.path + '[' + index + ']';
			props.key = field.path;

			return React.createElement(FieldTypes[field.type], props);
		}, this);
	},
	renderItems () {
		var value = this.props.value ? this.props.value : [];
		var path = this.props.path;
		var onAdd = this.addItem;
		var self = this;
		return (
			<div>
				{
					value.map(function(value, index) {
						var id = value.id;
						var _isNew = value._isNew;
						var name = !_isNew ? path + '[' + index + '][id]' : null;
						var onRemove = function(e) {
							self.removeItem(index);
						}
						return (
							<ItemDom key={id} id={id} name={name} onRemove={onRemove}>
								{self.renderFieldsForItem(index, value)}
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
		var required = this.props.required;
		var label = this.props.label ? this.props.label + '' + (required ? ' *' : '') : null;
		return (
			<div>
				<h3>{label}</h3>
				{this.renderItems()}
			</div>
		);
	},
});
