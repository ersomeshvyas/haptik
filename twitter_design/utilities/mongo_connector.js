const MongoClient = require('mongodb').MongoClient;

let _db;
const url = "mongodb://localhost:27017/twitter";

module.exports = {
  connectToServer: function() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url,  { useNewUrlParser: true }, function( err, client ) {
        if(!err && client){
          return resolve({client,db:client.db("twitter")});
        }
        return reject(err);
      });
    })
  },

  getDb: function() {
    return _db;
  },

  closeConnection:async (client) => {
    if(client){
      try{
        client.close();
        return true;
      }catch(e){
        throw new Error(e.message);
      }
    }
  }
};