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
  
  fs.readFile('backend/database.json', (err, data) => {
    if (err){
      throw err;
      }else{
        //pulls existing file, converts buffer to string
        let oldFile = data.toString();
        //grabs form data (buffer) and makes an object out of it
        let newTea = JSON.stringify(req.body);
        newTea = JSON.parse(newTea);
        //combine form data with existing data, then overwrites old file with new
        let combinedFile = JSON.parse(oldFile).teas;
        combinedFile.push(newTea);
        let newFile = {
          "teas": combinedFile
        };
        //overwrite old database file with updated
        fs.writeFile('backend/database.json', JSON.stringify(newFile), err => {
          if (err) {
            console.log(err);
            return;
          }
        });
      }
  });


  
});

app.listen(port, function () {
 console.log('App listening on port: ' + port);
});
