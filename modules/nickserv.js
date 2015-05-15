var path = require("path");

var information = {
  listener: {
    "welcome": onWelcome
  },
  command: [],
  opCommand: []
};

var Client, Bot;

var Config = require(path.join(__dirname, "/nickserv.json"));

function onWelcome(e) {
  Client.send(Config.to, "identify " + Config.id + " " + Config.pw);
}

module.exports = function(client, bot) {
  Client = client;
  Bot = bot;

  return information;
};
