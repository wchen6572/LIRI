require("dotenv").config();

var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var userCommand = process.argv[2];
var secondCommand = process.argv[3];

for (var i = 4; i < process.argv.length; i++) {
    secondCommand += '+' + process.argv[i];
}


var getSpotify = function spotify(inputs) {

	var spotify = new Spotify(keys.spotify);
		if (!secondCommand){
        	secondCommand = 'The Sign';
    	}
		spotify.search({ type: 'track', query: secondCommand }, function(err, data) {
			if (err){
	            console.log('Error occurred: ' + err);
	            return;
	        }

	        var songInfo = data.tracks.items;
	        console.log("Artist(s): " + songInfo[0].artists[0].name);
	        console.log("Song Name: " + songInfo[0].name);
	        console.log("Preview Link: " + songInfo[0].preview_url);
	        console.log("Album: " + songInfo[0].album.name);
	});
}


function userChoice(userCommand) {

    switch (userCommand) {

        case "concert-this":
            getBand();
            break;

        case "spotify-this-song":
            getSpotify();
            break;

        case "movie-this":
            getMovie();
            break;

        case "do-what-it-says":
            doWhat();
            break;
    }

  
    function getBand() {

        var artist = secondCommand;
        var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

        request(queryUrl, function (error, response, body) {

            if (!error) {
                var body = JSON.parse(body);
                for (i = 0; i < 4; i++){
                    console.log('================================');
                    // console.log(i)
                    console.log("Venue Name: "+ body[i].venue.name);
                    console.log("Venue Location: "+ body[i].venue.city + "," +  body[i].venue.country);
                    time = body[i].datetime
                    var convertTime = moment(time).format("YYYY-MM-DD");
                    console.log("Date of Event: " + convertTime);
                    console.log('===================================');  
                }


            } else {
                
                console.log("Error occurred.")
            }

        });
    }

    function getMovie() {
        var movieName = secondCommand;
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";

        request(queryUrl, function (error, response, body) {

            if (!error) {
                var body = JSON.parse(body);


                console.log('================ Movie Info ================');
                console.log("Title: " + body.Title);
                console.log("Release Year: " + body.Year);
                console.log("IMdB Rating: " + body.imdbRating);
                console.log("Rotten Tomatoes Rating: " + body.Ratings[2].Value);
                console.log("Country: " + body.Country);
                console.log("Language: " + body.Language);
                console.log("Plot: " + body.Plot);
                console.log("Actors: " + body.Actors);             
                console.log('===================================');

            } else {
                
                console.log("Error occurred.")
            }
            
            if (movieName === "Mr. Nobody") {
                console.log("-----------------------");
                console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
                console.log("It's on Netflix!");
            }
        });
    }


    function doWhat() {

            fs.readFile('random.txt', "utf8", function(error, data){
            

                var command = data.split(",");
                // console.log(command);
                
                if (command[0] === "spotify-this-song") 
                {
                  var argument = command[1].trim();
                    // console.log(argument);
                    getSpotify(argument);
                } 
 
                });
            
            };
    



}   

userChoice(userCommand);
