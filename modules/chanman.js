var path = require("path");

var information = {
  listener: {
    "welcome": onWelcome,
    "message": onMessage,
    "invite": onInvite
  },
  command: [],
  opCommand: ["-list"]
};

var Client, Bot;

var Config = require(path.join(__dirname, "/chanman.json"));

function onWelcome(e) {
  for(var idx in Config.autojoin) {
    Client.join(Config.autojoin[idx]);
  }
}

function onMessage(e) {
  var nick = e.from;
  var to = e.to;
  var text = e.message;
  var host = e.hostmask.hostname;

  /**
   *  CHANMAN commands
   *    `-channel`           Currently joined channels
   *    `-users <#channel>`  Users at a channel where bot is inside (TODO)
   */

  // commands are available to specific host
  if(Config.hosts.indexOf(host) === -1) return;
  
  var arr = text.split(" ");

  var cmd = arr[0];

  if(cmd === "-list") {
    var channels = Client.chans.join(", ");

    Client.send(to, "Current channels - " + channels);
  }
  // else if(cmd === "-users") {
  //   var arg = arr[1];

  //   if(_.isUndefined(arg)) {
  //     Client.say(to, "Error:CHANMAN - Try `-userlist <#channel>`");
  //     return;
  //   }

  //   arg = arg.toLowerCase();

  //   if(_.isUndefined(Client.chans[arg])) {
  //     Client.say(to, "This bot is not at " + arg);
  //   }
  //   else {
  //     var users = Object.keys(Client.chans[arg].users).join(", ");
  //     Client.say(to, "Users at " + arg + " - " + users);
  //   }
  // }
}

function onInvite(e) {
  var channel = e.channel;

  // TODO: ignore

  Client.join(channel);
}

module.exports = function(client, bot) {
  Client = client;
  Bot = bot;

  return information;
};
