var request = require("request");

var information = {
  listener: {
    "message": onMessage,
  },
  command: ["!방송"],
  opCommand: []
};

var Client, Bot;

function onMessage(e) {
  var nick = e.from;
  var to = e.to;
  var text = e.message;

  if(text.indexOf("!방송") < 0) return;

  request.get("http://127.0.0.1:50100/status-json.xsl", function(err, res, body) {
    if(err) {
      console.log(err);
      Client.say(to, "Error!");
      return;
    }

    if(res.statusCode !== 200) {
      console.log(res.statusCode);
      Client.say(to, "Error " + res.statusCode + "!");
      return;
    }

    var result = JSON.parse(body);
    var information = result.icestats.source.title;

    Client.send(to, "♬ " + information);
  });
}

module.exports = function(client, bot) {
  Client = client;
  Bot = bot;

  return information;
};
