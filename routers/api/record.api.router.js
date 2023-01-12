const express = require('express');
const Record = require('../../models/record.model');
const recordApiRouter = express.Router();
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'a1b2c3d4e5f6g7h8i9';

recordApiRouter.post('/create', async (req, res) => {
    try {
        const { serial, domainName, target, port, token, adminToken } = req.body;

        if (adminToken !== ADMIN_TOKEN) {
            return res.status(400).json({ msg: 'You\'re not authorized to create record!' });
        }
        const existingRecord = await Record.findOne({ serial });
        if (existingRecord) {
            return res.status(400).json({ msg: 'Record with same serial already exists!' });
        }

        let record = Record({
            serial,
            domainName,
            target,
            port,
            token
        });
        record = await record.save();
        res.json(record);
    }
    catch (e) {
        res.status(500).send({ error: e.message });
    }
});

recordApiRouter.get('', async (req, res) => {
    try {
        const { serial } = req.query;
        const existingRecord = await Record.findOne({ serial });
        if (!existingRecord) {
            return res.status(400).json({ msg: 'Record with this serial does not exists!' });
        }
        existingRecord.token = '****************';
        res.send(existingRecord);
    }
    catch (e) {
        res.status(500).send({ error: e.message });
    }
});

recordApiRouter.post('/update', async (req, res) => {
    try {
        const { serial, token, target, port, adminToken } = req.body;
        let existingRecord = await Record.findOne({ serial });
        if (!existingRecord) {
            return res.status(400).json({ msg: 'Record with this serial does not exists!' });
        }
        if (existingRecord.token !== token && adminToken !== ADMIN_TOKEN) {
            return res.status(400).json({ msg: 'You\'re not authorized to update record!' });
        }
        existingRecord.target = target;
        existingRecord.port = port;
        existingRecord = await existingRecord.save();
        res.send(existingRecord);
    }
    catch (e) {
        res.status(500).send({ error: e.message });
    }
});

recordApiRouter.get('/delete', async (req, res) => {
    try {
        const { serial, adminToken } = req.query;
        if (adminToken !== ADMIN_TOKEN) {
            return res.status(400).json({ msg: 'You\'re not authorized to update record!' });
        }
        let existingRecord = await Record.findOne({ serial });
        if (!existingRecord) {
            return res.status(400).json({ msg: 'Record with this serial does not exists!' });
        }
        existingRecord = await existingRecord.remove();
        res.send({ msg: 'Record deleted successfully!' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

module.exports = recordApiRouter;
