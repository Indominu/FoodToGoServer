const express = require("express");
const bodyParser = require('body-parser');
const {Login, Register, AddFranchise, SearchFranchise} = require('./services/loginService');
const {VerifyToken} = require("./services/tokenService");

const nonTokenRequiredPaths = ['/Login', '/Register'];

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use((request, response, next) => {
    const validToken = VerifyToken(request?.headers?.authorization?.split(' ')[1]);
    const tokenRequiredPath = nonTokenRequiredPaths?.includes(request?.path);

    if (!validToken && !tokenRequiredPath) {
        response.status(401).json({actionSuccess: false, msg: 'Missing, invalid or expired token'});
        return;
    }
    next();
});

const testArr = {
    id: 0,
    title: "Works"
}

app.get("/", (request, response) => {
    console.log('test1');
    response.status(200).json(testArr);
});

app.post("/SearchFranchise", (request, response) => {
    const body = request.body;
    SearchFranchise(body).then((result) => {
        const {['status']: status, ...data} = result;
        response.status(status).json(data);
    });});

app.get("/images/:name", (request, response) => {
    const name = request.params.name;
    response.status(200).json(testArr.find((test) => test.id === name));
});

app.post("/Login", (request, response) => {
    const body = request.body;
    Login(body).then((result) => {
        const {['status']: status, ...data} = result;
        response.status(status).json(data);
    })
});

app.post("/Register", (request, response) => {
    const body = request.body;
    Register(body).then((result) => {
        const {['status']: status, ...data} = result;
        response.status(status).json(data);
    })
});

app.post("/AddFranchise", (request, response) => {
    AddFranchise(request.body).then((result) => {
        const {['status']: status, ...data} = result;
        response.status(status).json(data);
    });
});

app.put("/todos/:id", (request, response) => {
    const todo = todos.find((todo) => todo.id === request.params.id);
    if (todo) {
        const {title, desc, completed} = request.body;
        todo.title = title;
        todo.desc = desc;
        todo.completed = completed;
        response.status(200).json({msg: "Todo updated sucessfully"});
        return;
    }
    response.status(404).json({msg: "Todo not found"});
});

app.delete("/todos/:id", (request, response) => {
    const todoIndex = todos.findIndex((todo) => (todo.id = request.params.id));
    if (todoIndex) {
        todos.splice(todoIndex, 1);
        response.status(200).json({msg: "Todo deleted successfully"});
    }
    response.status(404).json({msg: "Todo not found"});
});

app.listen(port, () => {
    console.log(`Server listening at https://localhost:${port}`);
});