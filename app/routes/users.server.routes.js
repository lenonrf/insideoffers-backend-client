'use strict';


module.exports = function(app) {

    var users = require('../../app/controllers/users');
	var auth = require('../../app/controllers/authorization');

    app.route('/')
        .get(auth.hasRole('admin'), users.index);

    app.route('/user/me')
        .get(auth.isAuthenticated(), users.me);
       

    app.route('/user/:id')
        .get(auth.isAuthenticated(), users.show);

        
    app.route('/user/')
        .post(users.create);


};


/*


var express = require('express');


var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

module.exports = router;

*/