const {MongoMemoryServer} =require('mongodb-memory-server');
const {MongoClient} = require("mongodb");
module.exports = async function  dbConnect(){
    let client;
    if(process.env.NODE_ENV==="test"){
        const mongod = await MongoMemoryServer.create();
        const dbUri = mongod.getUri();
        client= new MongoClient(dbUri);
        await client.connect();
        return client;
    }else{
        client=new MongoClient(process.env.MONGO_URI);
        await client.connect();
        return client;
    }
}