const express = require('express')
const cors = require('cors')
var router = express.Router();
var api_controller = require('./Routes/api');
require('dotenv').config()

// for now not using docker for the server
// todo : move to env vars when switching to docker container
const SERVER_PORT = 5000;
/*
if (!process.env.SERVER_PORT ||
    !process.env.MONGO_CONNECTION_STRING) {
    console.log('Please check environment file. Missing variables');
    if (!process.env.SERVER_PORT) console.log('No port specified');
    if (!process.env.MONGO_CONNECTION_STRING) console.log('No Mongo specified');
}
*/
const app = express()
app.use(cors());
app.use(express.json());
app.use(require("body-parser").json())

app.get('/', (req, res) => {
    res.status(200).send("Hey");
});

router.get('/api/post', api_controller.get_post);
router.get('/api/post/:group', api_controller.get_post);
router.get('/api/group', api_controller.get_group);

router.post('/api/post', api_controller.post_post);
router.post('/api/group', api_controller.post_group);

app.use('/', router);

// all other endpoints are 404s
app.use(function (req, res, next) {
    res.status(404).json({"error": "404 - Not Found"});
});

app.listen(SERVER_PORT, () => console.log('Server started on ' + SERVER_PORT));
