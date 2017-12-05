'use strict';

module.exports = {
	
	app: {
		title: 'yhall',
		description: '',
		keywords: 'yhall'
	},
	
	port: process.env.PORT || 3012,
	templateEngine: 'swig',
	sessionSecret: 'yhall',
	sessionCollection: 'sessions',

};
