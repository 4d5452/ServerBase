const express = require('express');
const app = express();
const sse = require('./sse/sse');
const value = require('./value/value');

const port = 50001;

app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});

// register the stream subscriber endpoint
app.get('/stream', sse.endpoint);
// give all endpoints a way to send stream event
app.use(sse.streamMessage);
app.get('/stream/connections', sse.totalConnections);

app.get('/', (req, res) => res.send("Value Server"));

app.use('/value', value);

app.get('/increment', (req, res) => {
    value = value + 1;
    sse.sendMessage("[Value] Modified");

    res.status(200).json({});
});

app.get('/decrement', (req, res) => {
    value = value -1;
    sse.sendMessage("[Value] Modified");

    res.status(200).json({});
});

app.listen(port, () => console.log(`Value App listening on port ${port}`));

/*********************FUNCTIONS***********************/