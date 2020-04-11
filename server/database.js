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

var postSchema = new Schema({
    user: {
        type: String,
        required: true,
        index: true,
    },
    group: {
        type: String,
        required: true,
        index: true,
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
        index: true,
        unique: true
    },
    members: [{
        name: {
            type: String,
            required: true,
        },
        public_key: {
            type: String,
            required: true,
        }
    }],
});

var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    public_key: {
        type: String,
        required: true,
        unique: true,
    },
    private_key: {
        type: String,
        required: true,
        unique: true,
    },
});

async function getUserByUsername(username) {
    return await UserModel.findOne({ username: username });
}
async function getGroupUsers(groupName) {
    return await GroupModel.findOne({ name: groupName });
}
const PostModel = mongoose.model('posts', postSchema);
const GroupModel = mongoose.model('groups', groupSchema);
const UserModel = mongoose.model('users', userSchema);

module.exports = {
    PostModel: PostModel,
    GroupModel: GroupModel,
    UserModel: UserModel,
    getUserByUsername: getUserByUsername,
    getGroupUsers: getGroupUsers,
}
