const express = require("express");
const loginService = require('./services/loginService');
const {Register} = require("./services/loginService");

const app = express();
const port = process.env.PORT || 5000;

app.use((req, res, next) => {
    console.log('The time is: ' + Date.now())
    next();
})

const testArr = {
    id: 0,
    title: "Works"
}

app.get("/", (request, response) => {
    console.log('test1');
    response.status(200).json(testArr);
});

app.get("/images/:name", (request, response) => {
    const name = request.params.id;
    response.status(200).json(testArr.find((test) => test.id === name));
});

app.post("/Login", (request, response) => {
    const body = request.body;
    loginService.Login(body, (result) => {
        response.status(result.status).json(result);
    });
});

app.post("/Register", (request, response) => {
    const body = request.body;
    loginService.Register(body, (result) => {
        response.status(result.status).json(result);
    });
});

app.post("/:action", (request, response) => {
    const action = request.params.action;
    const body = request.body;

    if (action === ":Login") {
        dbService.login().then(user => response.status(200).json(user))
    } else {
        //response.status(401).json({msg: "Failed to login"});
        response.status(201).json({msg: "Todo created successfully"});
    }
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