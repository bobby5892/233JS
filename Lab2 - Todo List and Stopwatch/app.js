var express = require("express");
var app = express();

app.get('/', function (req, res) {
    res.send("test");
});

var server = app.listen(80, function () {
    console.log("listening on port %d ", server.address().port);
});