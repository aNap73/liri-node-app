var request = require('request');
require("dotenv").config();
//taken out as an instructor conscideration. -ant
//var chromeLauncher = require('chrome-launcher');

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});
var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: keys.twitter.consumer_key,
  consumer_secret: keys.twitter.consumer_secret,
  access_token_key: keys.twitter.access_token_key,
  access_token_secret: keys.twitter.access_token_secret
});
var fnTweets = function(srch){
  if (!srch){
    srch = 'Liri Justice'
  }
  var params = {screen_name: srch, count: 20};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    //console.log(tweets[0]);
    console.log(tweets[0].created_at);
    if (!error) {
      for (var tweet in tweets)
      {             
        console.log(srch + '@' + tweets[tweet].created_at + ':    ' + tweets[tweet].text + ' ' );
      }
      
    }
  });  
};
var fnSpot = function(srch){


  //    * This will show the following information about the song in your terminal/bash window
     
//      * Artist(s)
     
//      * The song's name
     
//      * A preview link of the song from Spotify
     
//      * The album that the song is from
//      * If no song is provided then your program will default to "The Sign" by Ace of Base.
if(!srch){
  //If no song
  fnSpotErr();
  return;
}
srch = '"' + srch + '"';

spotify.search(
    { type: 'track', query: srch }, 
    function(err, data) {
        if (err) {
        //If no song   
        console.log(err);
        fnSpotErr();
        return;
         }
        
        // if(!data.tracks.items[0].album.artists[0].name||
        //    !data.tracks.items[0].album.name||
        //    !data.tracks.items[0].name||
        //    !data.tracks.items[0].preview_url)
        // {
        //   //If no song
        //   //console.log('')
        //    fnSpotErr();
        //    return;
        //  }  
        // if(!data.tracks.items[0].name){
        //   //If no song
        //    fnSpotErr();
        //    return;
        //  }
        
         try{
          for(var trk in data.tracks.items){
        
            if('"' + data.tracks.items[trk].name + '"' === srch){
              console.log('Artists: ' + JSON.stringify(data.tracks.items[trk].album.artists[0].name,null,2));
              console.log('Song: ' + JSON.stringify(data.tracks.items[trk].name,null,2));
              console.log('Preview: ' + JSON.stringify(data.tracks.items[trk].preview_url,null,2));
              console.log('Album Name: ' + JSON.stringify(data.tracks.items[trk].album.name,null,2));
              break;
            }
          }
          //console.log(data.tracks.items[1].name);

          
          
          }catch(err){
            console.log(err);
            fnSpotErr();
            return;
          }  
})};


var fnSpotErr = function(){
  
    try {
      let srch = '"The Sign"';
      spotify.search({ type: 'track', query: srch }, 
                     function(err, data) {
      if (err) {   
        console.log('Error : ' + err);
        return;
      }
      try{
        let cnt = 0;
        console.log('Artists: ' + JSON.stringify(data.tracks.items[0].album.artists[0].name,null,2));
        console.log('Song: ' + JSON.stringify(data.tracks.items[0].name,null,2));
        console.log('Preview: ' + JSON.stringify(data.tracks.items[0].preview_url,null,2));
        console.log('Album Name: ' + JSON.stringify(data.tracks.items[0].album.name,null,2));
      }catch(err){
        console.log('Error : ' + err);
        return;
      } })
}catch(err){
  console.log('Error : ' + err);
  return;
}
};
var fnMovie = function(srch){
  if(!srch){srch='Mr. Nobody.'};
  request('https://www.omdbapi.com/?apikey=' + 'trilogy' + '&t=' + srch, function (error, response, body) {  
  if(error){
    console.log('error:', error); // Print the error if one occurred
    return;
  }  
  if(response.statusCode!==200){
    console.log('statusCode?:', response.statusCode);
  } 
    
    let bdyjson = JSON.parse(body);
    //        * Title of the movie. 
    console.log('Title:', bdyjson.Title);
    //        * Year the movie came out.    
    console.log('Year:', bdyjson.Year);
    //        * IMDB Rating of the movie.
    console.log('IMDB Rating:', bdyjson.imdbRating);
    //        * Rotten Tomatoes Rating of the movie.
    for (var Rat in bdyjson.Ratings){      
      if(bdyjson.Ratings[Rat].Source==='Rotten Tomatoes'){
        console.log(bdyjson.Ratings[Rat].Source, bdyjson.Ratings[Rat].Value);
        break;        
      }
    }
    //        * Country where the movie was produced.
    console.log('Country:', bdyjson.Country);
    //        * Language of the movie.
    console.log('Language:', bdyjson.Language);
    //        * Plot of the movie.
    console.log('Plot:', bdyjson.Plot);
    //        * Actors in the movie.
    console.log('Actors:', bdyjson.Actors);    
  });
};
var fnDoWhat = function(){
  console.log('Do What!' );
};
var command = process.argv[2];
var arguments = process.argv.slice(3).join(' '); 
if(!command){
  command="invalid"; 
};
switch(command)
{
  case 'my-tweets':
    fnTweets(arguments);
    break;
  case 'spotify-this-song':
    fnSpot(arguments);
    break;
  case 'movie-this':
    fnMovie(arguments);
    break;
  case 'do-what-it-says':
    fnDoWhat();
    break;
  default:
    console.log('Invalid Command...');
    console.log('VALID COMMANDS:');
    console.log('  my-tweets <@USER NAME>         - Displays last 20 tweets');
    console.log('  spotify-this-song <SONG NAME>   - Song info ');
    console.log('  movie-this <MOVIE NAME>         - Movie info');
    console.log('  do-what-it-says <NO ARGUMENT>   - follows commands in random.txt');
    
    break;
}


// 10. Make it so liri.js can take in one of the following commands:

//     * `my-tweets`

//     * `spotify-this-song`

//     * `movie-this`

//     * `do-what-it-says`

// ### What Each Command Should Do

// 1. `node liri.js my-tweets`

//    * This will show your last 20 tweets and when they were created at in your terminal/bash window.

// 2. `node liri.js spotify-this-song '<song name here>'`

//    * This will show the following information about the song in your terminal/bash window
     
//      * Artist(s)
     
//      * The song's name
     
//      * A preview link of the song from Spotify
     
//      * The album that the song is from

//    * If no song is provided then your program will default to "The Sign" by Ace of Base.
   
//    * You will utilize the [node-spotify-api](https://www.npmjs.com/package/node-spotify-api) package in order to retrieve song information from the Spotify API.
   
//    * Like the Twitter API, the Spotify API requires you sign up as a developer to generate the necessary credentials. You can follow these steps in order to generate a **client id** and **client secret**:

//    * Step One: Visit <https://developer.spotify.com/my-applications/#!/>
   
//    * Step Two: Either login to your existing Spotify account or create a new one (a free account is fine) and log in.

//    * Step Three: Once logged in, navigate to <https://developer.spotify.com/my-applications/#!/applications/create> to register a new application to be used with the Spotify API. You can fill in whatever you'd like for these fields. When finished, click the "complete" button.

//    * Step Four: On the next screen, scroll down to where you see your client id and client secret. Copy these values down somewhere, you'll need them to use the Spotify API and the [node-spotify-api package](https://www.npmjs.com/package/node-spotify-api).

// 3. `node liri.js movie-this '<movie name here>'`

//    * This will output the following information to your terminal/bash window:

//      ```
//        * Title of the movie.
//        * Year the movie came out.
//        * IMDB Rating of the movie.
//        * Rotten Tomatoes Rating of the movie.
//        * Country where the movie was produced.
//        * Language of the movie.
//        * Plot of the movie.
//        * Actors in the movie.
//      ```

//    * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
     
//      * If you haven't watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>
     
//      * It's on Netflix!
   
//    * You'll use the request package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use `trilogy`.

// 4. `node liri.js do-what-it-says`
   
//    * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
     
//      * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
     
//      * Feel free to change the text in that document to test out the feature for other commands.

// ### BONUS

// * In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.

// * Make sure you append each command you run to the `log.txt` file. 

// * Do not overwrite your file each time you run a command.

// - - -

// ### Minimum Requirements

// Attempt to complete homework assignment as described in instructions. If unable to complete certain portions, please pseudocode these portions to describe what remains to be completed. Adding a README.md as well as adding this homework to your portfolio are required as well and more information can be found below.

// - - -

// ### Create a README.md

// Add a `README.md` to your repository describing the project. Here are some resources for creating your `README.md`. Here are some resources to help you along the way:

// * [About READMEs](https://help.github.com/articles/about-readmes/)

// * [Mastering Markdown](https://guides.github.com/features/mastering-markdown/)

// - - -

// ### Add To Your Portfolio

// After completing the homework please add the piece to your portfolio. Make sure to add a link to your updated portfolio in the comments section of your homework so the TAs can easily ensure you completed this step when they are grading the assignment. To receive an 'A' on any assignment, you must link to it from your portfolio.

// - - -

// ### One More Thing

// If you have any questions about this project or the material we have covered, please post them in the community channels in slack so that your fellow developers can help you! If you're still having trouble, you can come to office hours for assistance from your instructor and TAs.

// **Good Luck!**
