const Log = require('log');
const log = new Log('debug');

exports.send_error = function(error, res, status, code) {
    log.error(error);
    res.status(status).json({
        error: true,
        date: new Date(),
        code: code ? error.code : error
    });
}
