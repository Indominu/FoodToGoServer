const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbService = require('./dbService');
require("dotenv").config();

function Login(body) {
    return dbService.select('Users', {userName: body.userName}).then(async (user) => {
        const result = {actionSuccess: false, token: '', status: 401};
        if (user && (await bcrypt.compare(body.password, user.password))) {

            result.actionSuccess = true
            result.status = 200
            result.token = jwt.sign({user_id: user._id, name: user.userName},
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
    return dbService.select('Users', {userName: body.userName}).then(async (user) => {
        const result = {actionSuccess: false, token: '', status: 409};

        if (!user) {
            result.status = 200;
            result.actionSuccess = true;
            body.password = await bcrypt.hash(body.password, 10);

            dbService.insert('Users', body);
        }

        return result;
    })
}

module.exports = {Login, Register}