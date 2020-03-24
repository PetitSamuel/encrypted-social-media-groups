/*
    Setup a database connection and define schemas and models.
*/

const mongoose = require('mongoose')

mongoose.connect('mongodb://user:password@localhost:27017/db', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => {
    console.log('SERVER CONNECTED TO DATABASE');
});

var Schema = mongoose.Schema;

var postSchema = new Schema({
    user: {
        type: String,
        required: true,
    },
    group: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    postedAt: { type: Date, default: Date.now },
});

var groupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    members: [String],
});

const PostModel = mongoose.model('posts', postSchema);
const GroupModel = mongoose.model('groups', groupSchema);

function insertPost(post) {
    var newPost = new PostModel(post);
    newPost.save(function (err, data) {
        if (err) return err;
        return true;
    });
}

function insertGroup(group) {
    var newGroup = new GroupModel(group);
    newGroup.save(function (err, data) {
        if (err) return err;
        return true;
    });
}

module.exports = {
    PostModel: PostModel,
    GroupModel: GroupModel,
    insertPost: insertPost,
    insertGroup: insertGroup,
}
