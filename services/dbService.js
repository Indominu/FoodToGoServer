const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@cluser0.rutj9.mongodb.net/?retryWrites=true&w=majority`;
let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

exports.login = async () => {
    client = await client.connect();
    const dbo = client.db(process.env.DB_NAME);
    const user = await dbo.collection("Users").findOne({name: 'Foobar'});
    await client.close();
    return user
}