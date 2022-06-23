'use strict';
const apiRoutes         = require('./routes/api.js');
const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
let app = express();
const dbConnect = require("./dbconnection.js");
const cors = require('cors');
require('dotenv').config();
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');


app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({origin: '*'})); //For FCC testing purposes only
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
dbConnect(async (client)=>{
  await apiRoutes(app,client);
}).catch((e)=>{
  app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });
})


//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
