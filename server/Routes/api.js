const db = require("../database")

/*
    Handle post submission.
*/
exports.post_post = async function (req, res) {
    let params = req.body;
    if (!params) {
        res.status(400).json({ "error": true, "message": "empty request body." });
        return;
    }
    if (!params.user) {
        res.status(400).json({ "error": true, "message": "Request needs a user field." });
        return;
    }
    if (!params.group) {
        res.status(400).json({ "error": true, "message": "Request needs a group field." });
        return;
    }
    if (!params.text) {
        res.status(400).json({ "error": true, "message": "Request needs a text field." });
        return;
    }
    let post = new db.PostModel({
        user: params.user,
        group: params.group,
        text: params.text,
    });
    const newPost = await post.save();
    if (newPost !== post) {
        res.status(400).json({ "error": true, "message": "Error when saving to db.", "details": newPost });
        return;
    }
    res.status(200).json(newPost);
};

/*
    Returns list of all posts of specified group.
    If group is empty, return all posts.
*/
exports.get_post = async function (req, res) {
    let dbQueryParam = {};
    let reqParams = req.params;
    let queryParams = req.query;
    if (reqParams.group) {
        dbQueryParam = { 'group': reqParams.group };
    }
    let offset = 0;
    let limit = 5;
    if(queryParams.offset) {
        offset = parseInt(req.query.offset);
    }
    if(queryParams.limit) {
        limit = parseInt(req.query.limit);
    }
    try {
        let posts = await db.PostModel.find(dbQueryParam).sort({postedAt: 'descending'}).skip(offset).limit(limit);
        res.status(200).json(posts);
        return;
    } catch (err) {
        res.status(400).send({ "error": true, "message": err });
        return;
    }
}

/*
    Add a member to a group. If group doesn't exist in db : create it. 
    If it exists, append to list of members (only if user not already present);
*/
exports.post_group = async function (req, res) {
    let params = req.body;
    if (!params.name) {
        res.status(400).json({ "error": true, "message": "name is a required parameter." })
        return;
    }
    if (!params.user) {
        res.status(400).json({ "error": true, "message": "user is a required parameter." })
        return;
    }
    let currentGroup = await db.GroupModel.findOne({ 'name': params.name });
    // If no groups found, make a new one
    if (!currentGroup) {
        const tmpGroup = new db.GroupModel({
            name: params.name,
            members: [params.user]
        });
        const newGroup = await tmpGroup.save();
        if (newGroup !== tmpGroup) {
            res.status(400).json({ "error": true, "message": "Error when saving to db.", "details": newGroup });
            return;
        }
        res.status(200).json(newGroup);
        return;
    }
    if (!currentGroup.members) {
        currentGroup.members = [];
    }
    if (currentGroup.members.includes(params.user)) {
        res.status(200).json(currentGroup);
        return
    }
    currentGroup.members.push(params.user);
    const updatedGroup = await currentGroup.save();
    if (updatedGroup !== currentGroup) {
        res.status(400).json({ "error": true, "message": "Error when saving to db.", "details": updatedGroup });
        return;
    }
    res.status(200).json(updatedGroup);
};

/*
    Remove a member from a group.
*/
exports.remove_group = async function (req, res) {
    let params = req.params;
    if (!params) {
        res.status(400).json({ "error": true, "message": "Invalid request." })
        return;
    }
    if (!params.group) {
        res.status(400).json({ "error": true, "message": "name is a required parameter." })
        return;
    }
    if (!params.user) {
        res.status(400).json({ "error": true, "message": "user is a required parameter." })
        return;
    }
    let currentGroup = await db.GroupModel.findOne({ 'name': params.group });
    // If no groups found, return
    if (!currentGroup || !currentGroup.members) {
        res.status(200).json({ "message": "success" });
        return;
    }
    const index = currentGroup.members.indexOf(params.user);
    if (index === -1) {
        res.status(200).json({ "message": "success" });
        return;
    }
    currentGroup.members.splice(index, 1);
    const updatedGroup = await currentGroup.save();
    if (updatedGroup !== currentGroup) {
        res.status(400).json({ "error": true, "message": "Error when saving to db.", "details": updatedGroup });
        return;
    }
    res.status(200).json({ "message": "success" });
};

exports.get_group = async function (req, res) {
    try {
        let groups = await db.GroupModel.find({});
        res.status(200).json(groups);
        return;
    } catch (err) {
        res.status(400).send({ "error": true, "message": err });
        return;
    }
}