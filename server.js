const express = require('express');
const app = express();
const fs = require('fs');

app.use('/', express.static(`${process.cwd()}/`));

app.get('/', (req, res) => {
  app.sendFile('index.html');
});

app.post('/send-new-tea', (req, res) => {

  //let newTea = req.body;
  console.log(req.body);
  /*fs.appendFile('database.json', newTea, err => {
    if (err) {
      console.log(err);
      return;
    }
  });
  */
});
