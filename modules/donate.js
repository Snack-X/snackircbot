var path = require("path");

var information = {
  listener: {
    "message": onMessage,
  },
  command: ["!스낵기부", "!기부"],
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

  Client.send(to, "기업은행 205-068508-01-018 (예금주 - 노재민) / 감사합니다.");
}

module.exports = function(client, bot) {
  Client = client;
  Bot = bot;

  return information;
};
