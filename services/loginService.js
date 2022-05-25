const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbService = require('./dbService');
require("dotenv").config();

function Login(body) {
    dbService.select('Users', {email: body.username}, async (user) => {
        const result = {isLoggedIn: false, token: '', status: 401};
        if (user && (await bcrypt.compare(body.password, user.password))) {

            result.isLoggedIn = true
            result.status = 200
            result.token = jwt.sign(
                {user_id: user._id, name: user.name},
                process.env.JWT_SECRET_KEY,
                {
                    expiresIn: "5h",
                }
            );
        }

        return result;
    })
}

function Register(body) {
    dbService.select('Users', {email: body.username}, async (user) => {

        const result = {newUserCreated: false, token: '', status: 409};

        if (!user) {
            result.status = 200;
            result.newUserCreated = true;
            body.password = await bcrypt.hash(body.password, 10);

            dbService.insert('Users', body);
        }

        return result;
    })
}

module.exports = {Login, Register}