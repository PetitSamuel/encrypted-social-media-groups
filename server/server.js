const express = require('express');
const cors = require('cors');
const routes = require('./routes').router;
const body_parser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();
const app = express()

if (!process.env.SERVER_PORT ||
    !process.env.MONGO_CONNECTION_STRING) {
    console.log('Please check environment file. Missing variables');
    if (!process.env.SERVER_PORT) console.log('No port specified');
    if (!process.env.MONGO_CONNECTION_STRING) console.log('No Mongo specified');
}

app.use(cors());
app.use(express.json());
app.use(body_parser.json())
app.use('/api', routes);

app.get('/', (req, res) => {
    res.status(200).send('Welcom to the backend');
});
// all other endpoints are 404s
app.use(function (req, res, next) {
    res.status(404).json({ 'error': '404 - Not Found' });
});

app.listen(process.env.SERVER_PORT, () => console.log('Server started on ' + process.env.SERVER_PORT));
