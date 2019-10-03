var keystone = require('../../../');
var CMS = require(global.__base + "/enum/CMS");
var Utility = require(global.__base + '/helper/Utility');

exports = module.exports = function(req, res) {

	var cmsOptionStr = Utility.enumToKeystonOptionStr(CMS);
	var cmsOption = cmsOptionStr.split(",");

	keystone.render(req, res, 'home', {
		section: 'home',
		page: 'home',
		cmsOption : cmsOption,
		title: keystone.get('name') || 'Keystone',
		orphanedLists: keystone.getOrphanedLists()
	});

};
