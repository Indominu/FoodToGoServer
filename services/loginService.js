const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbService = require('./services/dbService');
require("dotenv").config();

export function Login(body) {
    dbService.select('Users', body.username, async (user) => {
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

export function Register(body) {
    dbService.select('Users', body.username, async (user) => {

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