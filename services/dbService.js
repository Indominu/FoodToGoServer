const {MongoClient, ServerApiVersion} = require('mongodb');
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@cluser0.rutj9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1});

exports.select = async (table, query, onlyOne) => {
    try {
        await client.connect();
        const database = client.db(process.env.DB_NAME);
        let collection = database.collection(table);

        if (onlyOne) {
            collection = await collection.findOne(query);
        } else {
            collection = await collection.find(query).toArray();
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

exports.update = async (table, query, data) => {
    try {
        await client.connect();
        const database = client.db(process.env.DB_NAME);
        const collection = database.collection(table);

        if (Array.isArray(data)) {
            await collection.updateMany(query, {$set: data});
        } else {
            await collection.updateOne(query, {$set: data});
        }

    } finally {
        await client.close();
    }
}

exports.join = async (table, query) => {
    try {
        await client.connect();
        const database = client.db(process.env.DB_NAME);
        const collection = database.collection(table);

        return await collection.aggregate(query).toArray();
    } finally {
        await client.close();
    }
}