console.log('hello!');
const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use('/backend', express.static(`${process.cwd()}/backend`));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  console.log('sending the html');
  res.sendFile(__dirname + '/index.html');
});

app.post('/backend/send-new-tea', (req, res) => {

  let newTea = JSON.stringify(req.body);
  console.log(newTea);
  console.dir(newTea);
  fs.appendFile('database.json', newTea, err => {
    if (err) {
      console.log(err);
      return;
    }
  });
  
});

app.listen(port, function () {
 console.log('App listening on port: ' + port);
});
