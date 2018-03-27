const router = require('express').Router();

var value = 0;

router.get('/', (req, res) => res.json({value: value}));

router.get('/increment', function(req, res) {
    value = value + 1;
    res.sendStreamMessage("[Value] Modified");

    res.status(200).json({});
});

router.get('/decrement', function(req, res) {
    value = value -1;
    sse.sendStreamMessage("[Value] Modified");

    res.status(200).json({});
});

module.exports = router;