const express = require('express');
const cors = require('cors');
const {v4: uuidv4} = require('uuid');
const bodyParser = require("body-parser");

const app = express();
const port = 3001;

const name = "test";
const identifier = "+491604020977";

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const serviceSid = 'KSdec77e7fba68ef872c739bc61da70d05';
let sessionSid;

app.post('/create-session', (req, res) => {
    console.log("creating session...");
    client.proxy.services(serviceSid)
        .sessions
        .create({uniqueName: uuidv4()})
        .then(session => {
            sessionSid = session.sid
            console.log("sessionSid: ", sessionSid);
            res.send(sessionSid);
        }).catch((error) => console.log(error));
});

app.post('/register', (req, res) => {
    let name = req.body.name;
    let number = req.body.number;

    createParticipant(name, number, res);
})

app.post('/request-number', (req, res) => {
    createParticipant(name, identifier, res);
})

function createParticipant(name, identifier, response) {
    console.log("Creating new participant...");

    let proxyIdentifier;
    client.proxy.services(serviceSid)
        .sessions(sessionSid)
        .participants
        .create({friendlyName: name, identifier: identifier})
        .then(participant => {
            proxyIdentifier = participant.proxyIdentifier;
            console.log("proxyIdentifier: ", proxyIdentifier);
            response.send({proxyIdentifier: proxyIdentifier});
        }).catch((error) => console.log(error));
}
