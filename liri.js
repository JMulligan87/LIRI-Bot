var axios = require("axios");
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api")
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var fs = require("fs");
var command = process.argv[2];
var input = process.argv[3];

var search = function (command, input) {
    switch (command) {
        case "concert-this":
            concertThis(input);
            break;
        case "spotify-this-song":
            spotifyThis(input);
            break;
        case "movie-this":
            movieThis(input);
            break;
        case "do-what-it-says":
            doIt(input);
            break;
    }
}

function concertThis(artist){
    var divider = "\n------------------------------------------------------------\n\n";

    var URL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(URL).then(function(response){
        var jsonData = response.data[0];

        //console.log(jsonData);

        var concertData = [
            "Venue: " + jsonData.venue.name,
            "Location: " + jsonData.venue.city,
            "Date: " + jsonData.datetime
        ].join("\n\n");

        fs.appendFile("log.txt", concertData + divider, function(err) {
            if (err) throw err;
            console.log(concertData);
          });
    })
}




search(command, input);