// const keystone = require('keystone');
// const PermissionType = require('./../enum/PermissionType');
// const Types = keystone.Field.Types;

/**
* Role Model
* ==========
*/

function createRoleModel () {
    const RoleList = new this.List('Role', {
        track: true
    });
    
	const allLists = this.lists;
    const Types = this.Field.Types;
    const permissionOptions = [{ value: 2, label: 'Editable' }, { value: 1, label: 'View Only' }, { value: 0, label: 'No Permission' }];
	
	let permissionSchema = {
        Role: { 
            type: Types.Select, 
            numeric: true,
            options: permissionOptions,
            default: 2,
            label: RoleList.label
        }
    };

	Object.keys(allLists).forEach(function (key) {
		permissionSchema[allLists[key].key] = { 
            type: Types.Select, 
            numeric: true,
            options: permissionOptions,
            default: 0,
            label: allLists[key].label,
            hideen: !!allLists[key].options.hideen
        };
	});

	RoleList.add(
        {
            name: { type: Types.Text, required: true, index: true },
        },
        'Permissions',
        permissionSchema
    );

    RoleList.register();
}

module.exports = createRoleModel;
