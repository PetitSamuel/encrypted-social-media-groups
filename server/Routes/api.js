const db = require("../database")
const key = require('../encryption');

exports.post_submission = async function (req, res) {
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
    const group = await db.getGroupUsers(params.group);
    if (!isUserInGroup(group, params.user)) {
        res.status(400).json({ "error": true, "message": "Cannot post in a group user is not it." });
        return;
    }
    const publicKeys = getGroupPublicKeys(group);
    const privateKey = await key.getUserPrivateKey(params.user);
    const signature = key.getSignature(privateKey, params.text);
    const message = key.encryptMessageWithSignature(publicKeys, params.text, signature);
    let post = new db.PostModel({
        user: params.user,
        group: params.group,
        text: message,
    });
    const newPost = await post.save();
    if (newPost !== post) {
        res.status(400).json({ "error": true, "message": "Error when saving to db.", "details": newPost });
        return;
    }
    newPost.text = params.text;
    res.status(200).json(newPost);
};

function isUserInGroup(group, username) {
    if (!group || !group.members) return false;
    for (const user of group.members) {
        if (user.name === username) return true;
    }
    return false;
}

function getGroupPublicKeys(group) {
    const publicKeys = [];
    for (const member of group.members) {
        publicKeys.push(member.public_key);
    }
    return publicKeys;
}

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
    if (!queryParams.user) {
        res.status(401).json({ "Unauthorized": "No user specified" });
        return;
    }
    const username = queryParams.user;
    if (queryParams.offset) {
        offset = parseInt(req.query.offset);
    }
    if (queryParams.limit) {
        limit = parseInt(req.query.limit);
    }
    try {
        var posts = await db.PostModel.find(dbQueryParam).sort({ postedAt: 'descending' }).skip(offset).limit(limit);
    } catch (err) {
        res.status(400).send({ "error": true, "message": err });
        return;
    }
    const privateKey = await key.getUserPrivateKey(username);
    for (const post of posts) {
        post.text = key.decryptMessage(privateKey, post.text).message;
    }
    res.status(200).json(posts);
    return;
}

/*
    Add a member to a group. If group doesn't exist in db : create it. 
    If it exists, append to list of members (only if user not already present);
*/
exports.update_group = async function (req, res) {
    let params = req.body;
    if (!params.group_name) {
        res.status(400).json({ "error": true, "message": "group_name is a required parameter." })
        return;
    }
    if (!params.username) {
        res.status(400).json({ "error": true, "message": "username is a required parameter." })
        return;
    }
    const username = params.username.toLowerCase();
    const groupName = params.group_name.toLowerCase();
    let currentGroup = await db.GroupModel.findOne({ 'name': groupName });
    const userPublicKey = await key.getUserPublicKey(username);
    // If no groups found, make a new one
    if (!currentGroup) {
        const tmpGroup = new db.GroupModel({
            name: groupName,
            members: [
                {
                    name: username,
                    public_key: userPublicKey,
                }
            ],
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
    if (currentGroup.members.findIndex(item => item.name === username) !== -1) {
        res.status(200).json(currentGroup);
        return
    }
    currentGroup.members.push({ name: username, public_key: userPublicKey });
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
    if (!params.group_name) {
        res.status(400).json({ "error": true, "message": "group_name is a required parameter." })
        return;
    }
    if (!params.username) {
        res.status(400).json({ "error": true, "message": "username is a required parameter." })
        return;
    }
    let currentGroup = await db.GroupModel.findOne({ 'name': params.group_name });
    // If no groups found, return
    if (!currentGroup || !currentGroup.members) {
        res.status(200).json({ "message": "success" });
        return;
    }
    const index = currentGroup.members.findIndex(item => item.name === params.username);
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