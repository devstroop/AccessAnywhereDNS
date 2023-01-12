const mongoose = require('mongoose');
const express = require('express');
const apiRouter = require('./routers/api.router');
const Record = require('./models/record.model');
const dns = require('native-dns'),
    util = require('util'),
    server = dns.createServer();

const PORT = process.env.PORT || 3000;
const DB = process.env.DB || 'mongodb+srv://root:lyhvnpsDYuzZLiC4@accessanywheredns.jkk6eqi.mongodb.net/?retryWrites=true&w=majority';

server.on('request', async (request, response) => {
    const question = request.question[0];
    console.log(request);

    const record = await Record.findOne({ domainName: question.name });
    if(record){
        response.additional.push(dns.SRV({
            name: question.name,
            target: record.target,
            port: record.port,
            weight: record.weight,
            priority: record.priority,
            ttl: record.ttl
        }));
    }

    response.send();
});

server.on('error', (err, buff, req, res) => {
    console.log(err.stack);
});

mongoose.set('strictQuery', true);
mongoose.connect(DB)
    .then(() => {
        console.log('✔ Database connected!');
    })
    .catch((e) => {
        console.log('✖ ' + e.stack)
    });

const app = express();
app.use(express.json());
app.use('/api', apiRouter);
app.listen(PORT, '0.0.0.0', () => {
    console.log('✔ Express server started!');
});
server.serve(53, '0.0.0.0');
console.log('✔ DNS server started!');
