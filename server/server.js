const express = require('express')
const cors = require('cors')
var router = express.Router();
const api_controller = require("./Routes/api")
var db_api_controller = require('./Routes/db_api');
require('dotenv').config()

if (!process.env.SERVER_PORT ||
    !process.env.MONGO_CONNECTION_STRING) {
    console.log('Please check environment file. Missing variables');
    if (!process.env.SERVER_PORT) console.log('No port specified');
    if (!process.env.MONGO_CONNECTION_STRING) console.log('No Mongo specified');
}

const app = express()
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send("Hey");
});

router.post('/api/convert-csv-to-md', api_controller.convert_csv_to_md);
router.post('/api/intents', db_api_controller.post_intents);
router.get('/api/intents', db_api_controller.get_intents);

app.use('/', router);

// all other endpoints are 404s
app.use(function(req, res, next){
    res.status(404).send('Not found');
});

app.listen(process.env.SERVER_PORT, () => console.log('Server started on ' + process.env.SERVER_PORT));
