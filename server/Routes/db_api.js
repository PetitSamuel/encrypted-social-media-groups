const db = require("../database")

exports.post_post = function(req, res) {
    let params = req.body;
    let insert = db.insertPost(params);
    res.json({ response: insert });
};

exports.get_post = function(req, res) {
    let queryParam = {};
    if(req.params.group) {
        queryParam = {'group': req.params.group};
    }
    db.PostModel.find(queryParam, function (err, data) {
        if (err) res.status(400).send({"error" : true, "message": err});
        res.json(data);
      });
}

exports.post_group = function(req, res) {
    let params = req.body;
    let insert = db.insertGroup(params);
    res.json({ response: insert });
};

exports.get_group = function(req, res) {
    db.GroupModel.find({}, function (err, data) {
        if (err) res.status(400).send({"error" : true, "message": err});
        res.json(data);
      });
}