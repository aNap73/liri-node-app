# liri-node-app
###SETTING UP LIRI
After cloning this project from git.hub you will need to follow these steps:

1) run npm i in the current directory to pull in a fresh copy of the required packages.
2) you will need to create api accounts at spotify and twitter
3) you will need to create a .env file with the following in it:

SPOTIFY_ID=<yourvalueshere>
SPOTIFY_SECRET=<yourvalueshere>	
TWITTER_CONSUMER_KEY=<yourvalueshere>
TWITTER_CONSUMER_SECRET=<yourvalueshere>
TWITTER_ACCESS_TOKEN_KEY=<yourvalueshere>
TWITTER_ACCESS_TOKEN_SECRET=<yourvalueshere>

###USING LIRI
This application is a command line node app that has 5 functions:

VALID COMMANDS:
  my-tweets <@USER NAME>         - Displays last 20 tweets
  spotify-this-song <SONG NAME>   - Song info
  movie-this <MOVIE NAME>         - Movie info
  do-what-it-says <NO ARGUMENT>   - follows commands in random.txt

to access a function you may type in console for example:

#node liri

this will give you the help from liri her self. 
you may recognize it as the text above (VALID COMMANDS)

#node liri my-tweets

this will default to applications own tweets under the user name Liri Justice.

you may also access Liri's tweets with the following example:  

#node liri my-tweets Liri Justice

Liri can also help you learn about a new song or hear a 30 second clip of it for example.

#node liri spotify-this-song Thriller

Liri can tell you about a new movie.

#node liri movie-this ready player one

Liri can even run a set of commands in batch mode.

Simply edit the random.txt file in the directory Liri lives in.

For example try changing the random.txt file to the following:

#spotify-this-song,"I Want It That Way"
#spotify-this-song,"Thriller"
#spotify-this-song,"Never Gonna Give You Up"
#my-tweets

then try running:

#node liri do-what-it-says

this will get information about the songs (I Want It That Way, Thriller and Never Gonna Give you Up) and get you Liri Justice's last 20 tweets.

How have we lived our lives without this.