/**
 * Created by Lee on 2015-01-23.
 */

var mysql = require('mysql');
var mysqlConfig = require('../config/mysqlConfig');

/* DB POOL 생성 */
var pool = mysql.createPool({
    connectionLimit : mysqlConfig.dbPoolSize,
    host : mysqlConfig.host,
    port : mysqlConfig.port,
    user : mysqlConfig.userid,
    password : mysqlConfig.userpwd,
    database : mysqlConfig.userdb,
    charset : 'utf8_general_ci'
})

/* EXPORT */
module.exports = pool;