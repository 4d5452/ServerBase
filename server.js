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
app.use('/stream', sse.endpoint);
// give all endpoints a way to send message through
app.use(sse.streamMessage);

app.get('/', (req, res) => res.send("Value Server"));

app.use('/value', value);

app.listen(port, () => console.log(`Value App listening on port ${port}`));

/*********************FUNCTIONS***********************/