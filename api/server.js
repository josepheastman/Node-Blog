const posts = require('./../data/helpers/postDb');
const tags = require('./../data/helpers/tagDb');
const users = require('./../data/helpers/userDb');

const express = require("express");
const server = express();

const cors = require('cors');
const morgan = require("morgan");
const helmet = require('helmet');

server.use(express.json());
server.use(morgan("short"));
server.use(helmet());
server.use(cors());

server.get('/', (req, res) => {
    res.json({ test: "Hello" })
})

module.exports = server;