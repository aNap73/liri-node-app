var fs = require('fs');
var request = require('request');
require("dotenv").config();
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
    
    //console.log(tweets[0].created_at);
    if (!error) {
      for (var tweet in tweets)
      {  
        let tme = tweets[tweet].created_at;
        let dTme = new Date(tme);     
        MyLog(srch + '@' + dTme.toLocaleString("en-US") + ':    ' + tweets[tweet].text + ' ' );
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

spotify.search(
    { type: 'track', query: srch }, 
    function(err, data) {
        if (err) {
        //If no song   
        MyLog(err);
        fnSpotErr();
        return;
         }
         let bFound = false;     
         try{
          for(var trk in data.tracks.items){
            // MyLog('"' + data.tracks.items[trk].name +'"');
            // MyLog('"' + srch.substring(0,srch.length-1) +'"');
            
            if(data.tracks.items[trk].name  === srch){
              MyLog('Artists: ' + JSON.stringify(data.tracks.items[trk].album.artists[0].name,null,2));
              MyLog('Song: ' + JSON.stringify(data.tracks.items[trk].name,null,2));
              MyLog('Preview: ' + JSON.stringify(data.tracks.items[trk].preview_url,null,2));
              MyLog('Album Name: ' + JSON.stringify(data.tracks.items[trk].album.name,null,2));
              bFound = true;
              break;
            }
          }
          
          }catch(err){
            MyLog(err);
            fnSpotErr();
            return;
          }  
          if(!bFound){
            MyLog('NOT FOUND');
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
        MyLog('Error : ' + err);
        return;
      }
      try{
        let cnt = 0;
        MyLog('Artists: ' + JSON.stringify(data.tracks.items[0].album.artists[0].name,null,2));
        MyLog('Song: ' + JSON.stringify(data.tracks.items[0].name,null,2));
        MyLog('Preview: ' + JSON.stringify(data.tracks.items[0].preview_url,null,2));
        MyLog('Album Name: ' + JSON.stringify(data.tracks.items[0].album.name,null,2));
      }catch(err){
        MyLog('Error : ' + err);
        return;
      } })
}catch(err){
  MyLog('Error : ' + err);
  return;
}
};
var fnMovie = function(srch){
  if(!srch){srch='Mr. Nobody.'};
  request('https://www.omdbapi.com/?apikey=' + 'trilogy' + '&t=' + srch, function (error, response, body) {  
  if(error){
    MyLog('error:', error); // Print the error if one occurred
    return;
  }  
  if(response.statusCode!==200){
    MyLog('statusCode?:', response.statusCode);
  }     
    let bdyjson = JSON.parse(body);
    //        * Title of the movie. 
    MyLog('Title:', bdyjson.Title);
    //        * Year the movie came out.    
    MyLog('Year:', bdyjson.Year);
    //        * IMDB Rating of the movie.
    MyLog('IMDB Rating:', bdyjson.imdbRating);
    //        * Rotten Tomatoes Rating of the movie.
    for (var Rat in bdyjson.Ratings){      
      if(bdyjson.Ratings[Rat].Source==='Rotten Tomatoes'){
        MyLog(bdyjson.Ratings[Rat].Source, bdyjson.Ratings[Rat].Value);
        break;        
      }
    }
    //        * Country where the movie was produced.
    MyLog('Country:', bdyjson.Country);
    //        * Language of the movie.
    MyLog('Language:', bdyjson.Language);
    //        * Plot of the movie.
    MyLog('Plot:', bdyjson.Plot);
    //        * Actors in the movie.
    MyLog('Actors:', bdyjson.Actors);    
  });
};
var fnDoWhat = function(){
  fs.readFile('./random.txt','utf8', function(err, data) {
  var arrData = data.split('\n');
  for (var wrk in arrData){
    if(arrData[wrk].indexOf(',')<0){
      arrData[wrk] += ",";
    }
    var arrPair = arrData[wrk].split(',');
    
    if(!arrPair[1]){
      arrPair[1]='""';
    } 
    if(arrPair[1]){
    let cmd = arrPair[0];
    let arg = arrPair[1].split('"').join('');
    
    arg = arg.substring(0,arg.length-1);
    if(cmd){
      if(cmd.length>5){processcommand(cmd,arg);}
    
    }
  }
  }});
  
};
var processcommand = function (command,arguments){
  let tme = Date.now();
  let dTme = new Date(tme);  
  
  
  MyLog('@' + dTme.toLocaleString("en-US") + ':' + command, arguments);
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
      MyLog('Invalid Command: '  + command);
      MyLog('VALID COMMANDS:');
      MyLog('  my-tweets <@USER NAME>         - Displays last 20 tweets');
      MyLog('  spotify-this-song <SONG NAME>   - Song info ');
      MyLog('  movie-this <MOVIE NAME>         - Movie info');
      MyLog('  do-what-it-says <NO ARGUMENT>   - follows commands in random.txt');
      break;
  }
}
var MyLog = function(one,two){
  let d = new Date();
  
  if(one&&two){
    console.log(one,two);
    fs.appendFile('mylog.txt', one + ' ' + two + '\n', function (err) {
      if (err) throw err;      
    });
  }else if(one){
    console.log(one);
    fs.appendFile('mylog.txt', one + '\n', function (err) {
      if (err) throw err;      
    });
  }else if(two){
    console.log(two);
    fs.appendFile('mylog.txt', two + '\n', function (err) {
      if (err) throw err;      
    });
  }

}
//---RUN STARTS HERE
var command = process.argv[2];
var arguments = process.argv.slice(3).join(' '); 
processcommand(command, arguments);

