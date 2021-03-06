const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app);
var fs = require('fs');
const port = process.env.PORT || 3001;
server.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
});

// List of events
const events = [];
const interested = [];
jsonStr ='[]';
app.use(express.static(__dirname+"/public"));
var obj = JSON.parse(jsonStr);
// Needed to process body parameters for POST requests
app.use(bodyParser.urlencoded({ extended: true }));

// Default endpoint
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/EventNowIndex.html");
});

// Inserting an event
app.post('/insertData', (req, res) => {
    const params = req.body;
    var local = params.location.split(" ");

    var array = {"group": params.group, "name": params.name, "lat": parseFloat(local[0]), "long": parseFloat(local[1]), "start": new Date(params.starttime).valueOf(), "end": new Date(params.endtime).valueOf()};
    events.push(array);
    obj.push(array);

  //  console.log(JSON.stringify(obj));
    fs.writeFile("EventList.json", JSON.stringify(obj), function(err) {
    if (err) {
        console.log(err);
    }
    });
    res.redirect('/');
});

// Gets all the events in the array
app.get('/getData', (req, res) => {

    res.send(events);
});

// TODO: Write a GET request to /count that checks iterates through
//       the array and sends how many of a certain ice cream event
//       exists to the response.
//       Use req.query.event to grab the event parameter.
app.get('/count', (req, res) => {
    const event = req.query.event;
    let count = events.length;
    /*for (let i = 0; i < events.length; i++) {
        if (events[i][0] == event) {
            count++;
        }
    } */
    res.send(count.toString());
});

// TODO: Write a GET request to /randomevent that sends a random
//       event from our array to the response.
app.get('/randomEvent', (req,res) => {
  const event = events[getRandomNumber()];
    res.send(event[0]);
});

app.get('/findEvent', (req,res) => {
    const keywords = req.query.keywords;
    for (let i = 0; i < events.length; i++) {
        if (events[i]["name"].includes(keywords)) {
            interested.push(events[i]);
        }
    }
    res.send(interested);
});


// Method that gets a random index from the events array
function getRandomNumber() {
    const num = Math.floor(Math.random() * events.length);
    return num;
}
