const tagDb = require("./../data/helpers/tagDb.js");

const express = require("express");
const server = express();

const configureMiddleware = require('../config/middleware.js')
const apiRouter = require('../api/apiRouter.js');


configureMiddleware(server);

server.use('/api', apiRouter);


module.exports = server;
