const {MongoClient, ServerApiVersion} = require('mongodb');
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@cluser0.rutj9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1});

exports.select = async (table, query) => {
    try {
        await client.connect();
        const database = client.db(process.env.DB_NAME);
        let collection = database.collection(table);

        if (query) {
            collection = await collection.findOne(query);
        }

        return collection;
    } finally {
        await client.close();
    }
}

exports.insert = async (table, query) => {
    try {
        await client.connect();
        const database = client.db(process.env.DB_NAME);
        const collection = database.collection(table);

        if (Array.isArray(query)) {
            const options = {ordered: true};
            await collection.insertMany(query, options);
        } else {
            await collection.insertOne(query);
        }

    } finally {
        await client.close();
    }
}