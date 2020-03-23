/*
    Setup a database connection and define schemas and models.
*/

const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => {
    console.log('SERVER CONNECTED TO DATABASE');
});

var Schema = mongoose.Schema;

var intentsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    expressions: [String],
});

const IntentsModel = mongoose.model('intents', intentsSchema);

function insertIntent(intent) {
    // new instance
    var newIntent = new IntentsModel(intent);
    // save to db
    newIntent.save(function (err, data) {
        if (err) return err;
        return true;
    });
}

module.exports = {
    db: db,
    IntentsModel: IntentsModel,
    insertIntent: insertIntent,
}
