const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const request = require('request');
const rxjs = require('rxjs');


const app = express();
const apiRouter = express.Router();

const API_CONTEXT = "https://webauthn-back.herokuapp.com";

app.use(express.static(path.join(__dirname, '../dist')))
  .use('/api', apiRouter)
  .get('/*', function(req,res) {res.sendFile(path.join(__dirname,'../dist/index.html'));})
  .listen(PORT, () => { console.log(`Listening on ${ PORT }`);});

apiRouter.get('/get-challenge', (req, res, next) => {
  request.get(`${API_CONTEXT}/startRegistration`,(err, response, body) => {
    res.send(body);
  });
});

apiRouter.post('/register', (req, res, next) => {
  let opts = {
    method: 'POST',
    uri: `${API_CONTEXT}/finishRegistration`,
    body: req.body
  }
  request(opts,(err, response, body) => {
    console.log('response for finish Registration');
    console.log(response);
    console.log('Error');
    console.log(err);
    console.log(JSON.stringify(err));
    res.send(body);
  });
});