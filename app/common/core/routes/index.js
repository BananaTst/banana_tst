var express = require('express');
var router = express.Router();
var config = require('../../../../config');

// 默认页面
router.route('/')
    .get(function (req, res) {
        res.render(config.routes.welcome_path, { title: 'default' });
    });

// 默认页面
router.route('/home')
    .get(function (req, res) {
        res.render(config.routes.welcome_path, { title: 'home' });
    });

module.exports = router;
