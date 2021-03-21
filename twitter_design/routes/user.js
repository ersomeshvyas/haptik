const crypto = require('crypto');
const config = require('../config');
const constant = require('../constant');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const redis_client = redis.createClient();

// Database connect
const mongo_connector = require('../utilities/mongo_connector');

// Login User
exports.login = async (req, res) => {
    let client = null;
    try {
    	const {email, password} = req.body;
    	const modified_password = crypto.createHash('md5').update(password).digest("hex");

        const { db, client: clientObj } = await mongo_connector.connectToServer();
        client = clientObj;

        const result = await db.collection(constant.user_collection).findOne({ email, password: modified_password });

        if(result != null) {
            // expires in 4 days
            const token = jwt.sign({'email': email, 'password': password}, config.secret, { expiresIn: 345600 });
            res.send({ "data": { token, "username":result.username }});
        } else {
            res.send({ "data": "", "error": constant.please_register});
        }
    } catch(e) {
        res.send({"data":"", "error": e.message});
    } finally {
        mongo_connector.closeConnection(client);
    }
};

// Check if email is present in database
exports.verifyUser = async (req, res, next) => {
    let client = null;
    try {
        const email = req.body.email;
        const { db, client: clientObj } = await mongo_connector.connectToServer();
        client = clientObj;

        const result = await db.collection(constant.user_collection).find({email}).toArray();
        if(result && result.length > 0){
            res.send({"data":"", "error": constant.email_already_present});
        } else {
            next();
        }
    } catch(e) {
        res.send({"data":"", "error": e.message});
    } finally {
        mongo_connector.closeConnection(client);
    }
};

// Check if username is present in database
exports.verifyUserName = async (req, res, next) => {
    let client = null;
    try {
        const username = req.body.username;
        const { db, client: clientObj } = await mongo_connector.connectToServer();
        client = clientObj;

        const result = await db.collection(constant.user_collection).find({username}).toArray();
        
        if(result && result.length > 0){
            res.send({"data":"", "error": constant.username_taken});
        } else {
            next();
        }
    } catch(e) {
        res.send({"data":"", "error": e.message});
    } finally {
        mongo_connector.closeConnection(client);
    }
};

exports.addUser = async (req, res) => {
    let client = null;
    try {
        const {email, password, username} = req.body;
        const encrypted_password = crypto.createHash('md5').update(password).digest("hex");
        const created_at = new Date();
        const { db, client: clientObj } = await mongo_connector.connectToServer();
        client = clientObj;

        await db.collection(constant.user_collection).insert({email, password: encrypted_password, username, 'followers': [], 'following': [], created_at});
        const token = jwt.sign({'email': email, 'password': password}, config.secret, { expiresIn: 345600 });
        res.send({ "data":constant.registration_success, token, username });
    } catch(e) {
        res.send({"data":"", "error": e.message});
    } finally {
        mongo_connector.closeConnection(client);
    }
};

exports.followUser = async (req, res) => {
    let client = null;
    try {
        const {username, following_user_name} = req.body;
        const newvalues = { 
            $addToSet: { 
                following: following_user_name 
            } 
        };
        const { db, client: clientObj } = await mongo_connector.connectToServer();
        client = clientObj;

        await db.collection(constant.user_collection).update({username}, newvalues);
        redis_client.get(following_user_name+'_followers', (err, reply) => {
            if(!reply) reply = '';
            const following_users = reply+","+username;
            redis_client.set(following_user_name+'_followers', following_users, () => {}) ;
        });
        res.send({"data": constant.follow_request});
    } catch(e) {
        res.send({"data":"", "error": e.message});
    } finally {
        mongo_connector.closeConnection(client);
    }
};

exports.storeTweet = async (req, res) => {
    let client = null;
    try {
        const {tweet, username} = req.body;
        const created_at = new Date();
        const { db, client: clientObj } = await mongo_connector.connectToServer();
        client = clientObj;
        
        await db.collection(constant.tweet_collection).insert({ username, tweet, created_at});
        res.send({ "data": constant.shared_tweet });
                    
        const followers = await get_user_followers(username);
        // fanout update to followers
        for(const follower of followers) {
            redis_client.lpush(`${follower}_tweetlist`, `${username}::${tweet}`, () => {});
        }
    } catch(e) {
        res.send({"data":"", "error": e.message});
    } finally {
        mongo_connector.closeConnection(client);
    }
};

exports.dashboard = async (req, res) => {
    let client = null;
    try {
        const limit = parseInt(req.body.limit);
        const offset = parseInt(req.body.offset);
        const username = req.body.username;

        if(offset < constant.max_redis_offset) {
            redis_client.lrange(username+'_tweetlist', offset, limit, (err, tweets) => {
                res.send({ "data": tweets });
            });
        } else {
            const { db, client: clientObj } = await mongo_connector.connectToServer();
            client = clientObj;
            const result = await db.collection(constant.tweet_collection).find({username}).toArray();
            const finalArray = new Array();
            for(const doc of result) {
                finalArray.push(`${doc.username}::${doc.tweet}`);
            }
            res.send({"data":finalArray});
        }
    } catch(e) {
        res.send({"data":"", "error": e.message});
    } finally {
        mongo_connector.closeConnection(client);
    }
};

const get_user_followers = (username) => {
    return new Promise((resolve, reject) => {
        redis_client.get(username+'_followers', (err, reply) => {
            if(!err) return resolve(reply.split(','));
            else reject({'message': JSON.stringify(err)});
        });
    });
};
