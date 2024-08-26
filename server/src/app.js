const express = require('express');
const expressValidator = require('express-validator');
const parseurl = require('parseurl');
const path = require('path');
const admin = require('./models/admin')
const md5 = require('md5');
const cors = require('cors');
require('./db/mongoose');
const bodyParser = require('body-parser');
const electionName = require('./models/electionName');


const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', function(req, res) {
    res.json('Working ...');
});

app.get('/api/electionName', function(req, res) {
    var electionNames = []
    var electionOrganizers = []
    var electionIds = []
    var final = []
    electionName.find({}).then(item => {
        for (i = 0; i < item.length; i++){
            electionNames[i] = item[i].election_name ;
            electionIds[i] = item[i].election_id;
            electionOrganizers[i] = item[i].election_organizer;
            final.push({
                'election_id': item[i].election_id,
                'election_organizer': item[i].election_organizer,
                'election_name': item[i].election_name
            })
        }
        res.send(final);
    })
})

app.post('/api/electionName', async function(req, res) {
    electionName.create({
        election_id: Math.floor(Math.random() * 100),
        election_name: req.body.election_name,
        election_organizer: req.body.election_organizer,
        election_password: md5(req.body.election_password),
    }).then(election => {
        res.json(election);
    });
});

app.post('/api/adminLogin', async function(req, res) {
    admin.findOne({
        username: req.body.username,
        password: md5(req.body.password),
    }).then(election => {
        if(election === null){
            res.send(false);
        }else{
            res.send(true);
        }
    });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("Server is running on port " + port)
});