/*
@author Joshua Malek
@date 2018
@node v8.11.3
@npm v6.1.0
*/
//require discord.js package to do all discord related activities
const Discord = require('discord.js');

//create enviroments for each bot client
const listen = new Discord.Client();
const relay = new Discord.Client();

//import config file
const config = require('./config.json');

//logins
//listen is the "listener" who passes on the message to the relayer
listen.on('ready', () => {
  console.log(`Logged in as ${listen.user.tag}!`);
});
//relay is the "relayer" who takes the message from the listener and relays it
relay.on('ready', () => {
  console.log(`Logged in as ${relay.user.tag}!`);
});


//function to replace string id's with usernames
function rep(str,replaceWhat,replaceTo){
    var re = new RegExp(replaceWhat, 'g');
    return str.replace(re,replaceTo);
}

//function to replace mention id's with usernames
function mention(message, array){
  var id = "";
  var newid = "";
  for(var i = 0; i < array.length; i++){
    id = "<@"+array[i].id+">";
    newid = "@"+array[i].username;
    message = rep(message,id,newid);
  }
  return message;
}

//server scraping
listen.on('message', msg => {
  //formatted version of usernames, "**" adds bold
  var name = "**"+msg.author.username+"**";
  var message = msg.content;
  //if there is a tag in the message content, replace
  //all tags with usernames
  if(msg.mentions.users.array().length > 0){
    message = mention(message, msg.mentions.users.array());
  }
  //If you want to duplicate all messages sent from a specific channel, use this
  if (msg.channel.id == config.channel_id) {
    console.log("a message was sent to _your channel_, sending to duplicate");
    relay.channels.get(config.channel_dupe_id).send(message);
  }
});

//async logins to discord, using config tokens
listen.login(config.listen_token);
relay.login(config.relay_token);
