var information = {
  listener: {
    "message": onMessage,
  },
  command: ["!핑", "!ping", "!퐁", "!pong"],
  opCommand: []
};

var Client, Bot;

function onMessage(e) {
  var nick = e.from;
  var to = e.to;
  var text = e.message;

  var arr = text.split(" ");

  var cmd = arr[0];

  if(information.command.indexOf(cmd) < 0) return;

  if(cmd === "!핑" || cmd === "!ping") {
    Client.send(to, nick + ", pong?");
  }
  else if(cmd === "!퐁" || cmd === "!pong") {
    Client.send(to, nick + ", ping?");
  }
}

module.exports = function(client, bot) {
  Client = client;
  Bot = bot;

  return information;
};
