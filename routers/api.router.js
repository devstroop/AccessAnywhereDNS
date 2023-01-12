const express = require('express');
const recordApiRouter = require('./api/record.api.router');
const apiRouter = express.Router();

apiRouter.use('/record', recordApiRouter);

module.exports = apiRouter;
