var axios = require("axios");
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api")
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var fs = require("fs");
var command = process.argv[2];
var input = process.argv[3]

var options = function (command, input) {
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

function concertThis(artist) {
    var divider = "\n------------------------------------------------------------\n\n";

    var URL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(URL).then(function (response) {
        var jsonData = response.data[0];

        //console.log(jsonData);
        //moment = moment().format("L")

        var concertData = [
            "Venue: " + jsonData.venue.name,
            "Location: " + jsonData.venue.city,
            "Date: " + moment(jsonData.datetime).format("L")
        ].join("\n\n");

        fs.appendFile("log.txt", concertData + divider, function (err) {
            if (err) throw err;
            console.log(concertData);
        });
    })
}

function spotifyThis(song) {
    var divider = "\n------------------------------------------------------------\n\n";

    if (!song) {
        song = "The Sign";
    }

    spotify
        .search({ type: 'track', query: song })
        .then(function (response) {
            // console.log(response);
            for (var i =0; i < 5; i++){
                var data = response.tracks.items[i];
                var tracks = [
                    "Artist(s): " + data.artists[0].name,
                    "Song Name: " + data.name,
                    "Album Name: " + data.album.name,
                    "Preview Link: " + data.preview_url
                ].join("\n\n");

                fs.appendFile("log.txt", tracks + divider, function (err) {
                    if (err) throw err;
                    console.log(tracks);
                });
            }
        })
        .catch(function (err) {
            console.log(err);
        });

}

function movieThis(movie) {
    if(!movie){
        movie = "Mr Nobody"
    }
    var divider = "\n------------------------------------------------------------\n\n";
    var URL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";
    axios.get(URL).then(function (response) {
        var jsonData = response.data;
        //console.log(jsonData);
        var movieData = [
            "Movie Title: " + jsonData.Title,
            "Release Year: " + jsonData.Year,
            "IMDB Rating: " + jsonData.imdbRating,
            "Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value,
            "Country: " + jsonData.Country,
            "Language: " + jsonData.Language,
            "Plot: " + jsonData.Plot,
            "Actors: " + jsonData.Actors
        ].join("\n\n");

        fs.appendFile("log.txt", movieData + divider, function (err) {
            if (err) throw err;
            console.log(movieData);
        });
    })
}

function doIt(){
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) throw error;
        random = data.split(",");
        
        if (random[0]== "spotify-this-song") {
           spotifyThis(random[1])
        }
    });
}

options(command, input);