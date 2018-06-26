const express = require('express');
const qs = require('qs');
const request = require('superagent');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.post('/linkedinaccesstoken', function (req, res) {

  var AUTH_REQUEST_DATA = {
    'grant_type': 'authorization_code',
    'code': req.body.code,
    'redirect_uri': req.body.redirect_uri,
    'client_id': req.body.client_id,
    'client_secret': req.body.client_secret
  };

  request.post('https://www.linkedin.com/oauth/v2/accessToken')
    .send(qs.stringify(AUTH_REQUEST_DATA))
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .accept('application/json')
    .end(function(err, response){
      res.send(response.body.access_token);
  });
});

app.post('/linkedinuserdeatils', function (req, res) {

  request.get('https://api.linkedin.com/v1/people/~:(first-name,last-name,public-profile-url,location,headline,picture-url,positions,summary,num-connections)')
    .query({
      'oauth2_access_token': req.body.oauth2_access_token,
      'format': 'json'
    }).end(function(err, response){
      res.send(JSON.parse(response.text));
    });
});

app.listen(port,function(){
  console.log("Listening to " + port);
});
