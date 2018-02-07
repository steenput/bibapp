const axios = require('axios');
const fs = require('fs');
const Log = require("log");
// const log = new Log("debug", fs.createWriteStream("fse.log"));
const log = new Log("debug");

const express = require('express');
const app = express();

app.get("/", function(req, res) {
    log.debug("request url", req.url);
    log.debug("request params", req.params);
    res.type('json');
    let test = {
        id: 42,
        name: "bob"
    }
    res.status(200).end(JSON.stringify(test));
});

app.all("*", function(req, res) {
	log.error("Requested:", req.url);
	res.status(404).send("404 Page not found.");
});

app.listen(8080);
