var express = require('express');
var router = express.Router();

//引入分路由模块
var user = require('./user')
var address = require('./address')

//注册各个分路由
user(router)
address(router)

module.exports = router;
