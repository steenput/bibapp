const Log = require('log');
const log = new Log('debug');

exports.sendError = function(error, res, status, message) {
    log.error(error);
    res.status(status).json({
        error: true,
        date: new Date(),
        message: message
    });
}
