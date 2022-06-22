const {MongoMemoryServer} =require('mongodb-memory-server');
const {MongoClient} = require("mongodb");
module.exports = async function  dbConnect(callback){
    let client;
    if(process.env.NODE_ENV==="test"){
        const mongod = await MongoMemoryServer.create();
        const dbUri = mongod.getUri();
        console.log(dbUri);
        client= new MongoClient(dbUri);
        await client.connect();
        await callback(client);
    }else{
        client=new MongoClient(process.env.MONGO_URI);
        await client.connect();
        await callback(client);
    }
}