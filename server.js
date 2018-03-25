const express = require('express');
const app = express();
const sse = require('./sse');

const port = 50001;
var connections = new Map();
var connected = 0; //TODO: max number connections
var value = 0;

app.use(sse);
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});

app.get('/', (req, res) => res.send("Value Server"));

app.get('/connections', (req, res) => res.json({connections: connections.size}));

app.get('/value', (req, res) => res.json({value: value}));

app.get('/increment', (req, res) => {
    value = value + 1;
    sendMessage("[Value] Modified");

    res.status(200).send("Ok");
});

app.get('/decrement', (req, res) => {
    value = value -1;
    sendMessage("[Value] Modified");

    res.status(200).send("Ok");
});

app.get('/stream', (req, res) => {
    res.sseSetup();
    res.write("event: open\n\n");
    res.id = `${++connected}-${req.ip}`;
    connections.set(res.id, res);
    res.on('close', () => {
        console.log(`Closed: ${res.id}`);
        connections.delete(res.id);
    });
    res.on('error', () => {
        console.log(`Error: ${res.id}`);
        connections.delete(res.id);
    });
});

function sendMessage(message) {
    connections.forEach((connection) => {
        connection.sseSend(message);
    });
}

app.listen(port, () => console.log(`Value App listening on port ${port}`));

/*********************FUNCTIONS***********************/