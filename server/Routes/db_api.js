const db = require("../database")

exports.post_intents = function(req, res) {
    let params = req.body;
    if (!params.name || !params.expressions || params.expressions.length === 0) {
        res.status(400).send({ "error": "Request needs a name (string), and an array with at least one expression." })
    }
    let insert = db.insertIntent(params);
    res.json({ response: insert });
};

exports.get_intents = function(req, res) {
    db.IntentsModel.find({}, function (err, data) {
        if (err) res.status(400).send({"error" : true, "message": err});
        res.json(data);
      });
}
