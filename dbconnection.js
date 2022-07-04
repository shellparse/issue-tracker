require('dotenv').config();
const {MongoMemoryServer} =require('mongodb-memory-server');
const {MongoClient} = require("mongodb");
async function  main(callback){
    let client;
    if(process.env.LOCAL_TEST==="test"){
        try{
        const mongod = await MongoMemoryServer.create();
        const dbUri = mongod.getUri();
        console.log(dbUri);
        client= new MongoClient(dbUri);
        await client.connect();
        await callback(client);
        }catch(e){
            console.error(e)
        }
    }else{
        client=new MongoClient(process.env.MONGO_URI);
        try{
        await client.connect();
        await callback(client);
        }catch (e){
            console.error(e);
        }
    }
}
module.exports = main;