const cryptojs = require('hybrid-crypto-js');
const db = require("./database")
const entropy = "jq9413t0Bui1qc-jo5oywXGkkO2ARZPjcxQst-PuPqitGF7rlh";

const RSA = cryptojs.RSA;
const Crypt = cryptojs.Crypt;

const crypt = new Crypt({ entropy: entropy });
const rsa = new RSA({ entropy: entropy });

async function generateKeys() {
    const keyPair = await rsa.generateKeyPairAsync();
    if (!keyPair || !keyPair.publicKey || !keyPair.privateKey) {
        console.log("Error generating RSA Keys!");
        return null;
    }
    return keyPair;
}

async function getUserOrCreate(username) {
    let user = await db.getUserByUsername(username);
    // user not in db: create it
    if (!user) {
        const keyPair = await generateKeys();
        if (!keyPair) {
            return null;
        }
        const tmpUser = new db.UserModel({
            username: username,
            public_key: keyPair.publicKey,
            private_key: keyPair.privateKey,
        });

        user = await tmpUser.save();
        if (user !== tmpUser) {
            // error occured
            return null;
        }
    }
    return user;
}

exports.getUserPublicKey = async function getUserPublicKey(username) {
    const user = await getUserOrCreate(username);
    return user.public_key;
}

exports.getUserPrivateKey = async function getUserPrivateKey(username) {
    const user = await getUserOrCreate(username);
    return user.private_key;
}

exports.encryptMessageWithSignature = function encryptMessageWithSignature(publicKeys, message, signature) {
    return crypt.encrypt(publicKeys, message, signature);
}
exports.decryptMessage = function decryptMessage(privateKey, encrypted) {
    try {
        return crypt.decrypt(privateKey, encrypted);
    } catch (err) {
        return {
            message: JSON.parse(encrypted).cipher
        };
    }
}
exports.getSignature = function getSignature(privateKey, message) {
    return crypt.signature(privateKey, message);
}

exports.verifySignature = function verifySignature(publicKey, signature, message) {
    return crypt.verify(
        publicKey,
        signature,
        message,
    );
}