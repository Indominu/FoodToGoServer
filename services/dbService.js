const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@cluser0.rutj9.mongodb.net/?retryWrites=true&w=majority`;
let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
let dbo;

;(async () => {
    client = await client.connect();
    dbo = client.db(process.env.DB_NAME);
})()

exports.select = async (table, key) => {
    //client = await client.connect();
    //const dbo = client.db(process.env.DB_NAME);
    let collection = await dbo.collection(table)
    //const user = await dbo.collection("Users").findOne({name: 'Foobar'});
    //await client.close();

    if (key) {
        collection = await collection.findOne(key);
    }

    return collection;
}

exports.insert = async (table, data) => {
    await dbo.collection(table).insertOne(data)
}