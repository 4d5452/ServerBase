const router = require('express').Router();

const SSE_HEADER = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
}

var connections = new Map();
var id = 0;

router.get('/', endpoint);
router.get('/connections', totalConnections);

module.exports = {
    endpoint: router,
    streamMessage: streamMessage
}

/************Functions */

function endpoint(req, res) {
    res.writeHead(200, SSE_HEADER);

    res.sseMessage = function(data) {
        res.write(`data: ${data}\n\n`);
    }

    res.write("event: open\n\n");

    res.id = `${++id}-${req.ip}`;

    addConnection(res.id, res);

    res.on('close', () => closeConnection(res.id));

    res.on('error', () => errorConnection(res.id));
};

function totalConnections(req, res) {
    res.json({connections: connections.size});
}

function addConnection(id, res) {
    connections.set(id, res);
}

function closeConnection(id) {
    connections.delete(id);
}

function errorConnection(id) {
    connections.delete(id);
}

function streamMessage(req, res, next) {
    res.sendStreamMessage = function(message) {
        connections.forEach((connection) => {
            connection.sseMessage(message);
        });
    }
    next();
}