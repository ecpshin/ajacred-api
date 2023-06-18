require('dotenv').config({ path: './.env' });
const { v4: uuidV4 } = require('uuid');
const express = require('express');
const cors = require('cors');
const server = express();
const routes = require('./routes');

server.use(cors());
server.use(express.json());
server.use(routes);

server.listen(process.env.APP_PORT, function(){
    console.log("Lintening POR: " + process.env.APP_PORT);
});
