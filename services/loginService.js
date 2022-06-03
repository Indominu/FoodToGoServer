const bcrypt = require('bcryptjs');
const dbService = require('./dbService');
require("dotenv").config();
const {CreateToken} = require('./tokenService');

function Login(body) {
    return dbService.select('Users', {userName: body.userName}, true).then(async (user) => {
        const result = {actionSuccess: false, token: '', status: 401};

        if (user && (await bcrypt.compare(body.password, user.password))) {

            result.actionSuccess = true
            result.status = 200
            result.token = CreateToken({user_id: user._id, name: user.userName});
        }

        return result;
    })
}

function Register(body) {
    return dbService.select('Users', {userName: body.userName}, true).then(async (user) => {
        const result = {actionSuccess: false, token: '', status: 409};

        if (!user) {
            result.status = 200;
            result.actionSuccess = true;
            result.token = CreateToken({user_id: user._id, name: body.userName});
            body.password = await bcrypt.hash(body.password, 10);

            dbService.insert('Users', body);
        }

        return result;
    })
}

function AddFranchise(body) {
    const {['products']: products, ...franchise} = body;

    return dbService.select('Franchise', {name: franchise.name}, true).then(async (dbFranchise) => {
        const result = {actionSuccess: false, msg: '', status: 409};

        if (!dbFranchise) {
            result.status = 200;
            result.actionSuccess = true;
            result.msg = `${body.name} was added`;

            products.map((item) => item.franchise = franchise.name)

            await dbService.insert('Franchise', franchise);
            await dbService.insert('Products', products);
        }

        return result;
    })
}

function SearchFranchise(body) {
    const query = [
        {$match: body},
        {
            $lookup:
                {
                    from: "Products",
                    localField: "name",
                    foreignField: "franchise",
                    as: "Products"
                }
        }
    ];

    return dbService.join('Franchise', query).then(async (franchisees) => {
        const result = {actionSuccess: false, msg: '', status: 409};

        result.status = 200;
        result.actionSuccess = true;
        result.franchisees = franchisees;

        return result;
    })
}

module.exports = {Login, Register, AddFranchise, SearchFranchise}