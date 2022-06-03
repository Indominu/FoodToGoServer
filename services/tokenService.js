const jwt = require('jsonwebtoken');
require("dotenv").config();

function CreateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: "5h",});
}

function VerifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        return err ? false : true;
    });
}

module.exports = {CreateToken, VerifyToken}