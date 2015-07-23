var exec = require("child_process").exec;

var information = {
  listener: {
    "message": onMessage,
  },
  command: [],
  opCommand: ["-exec"]
};

var Client, Bot;

var Config = require(path.join(__dirname, "/exec.json"));

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

  if(text.indexOf("-exec") !== 0) return;

  var content = text.split(" ").slice(1).join(" ");

  exec(content, function(err, stdout, stderr) {
    var out = stdout.split("\n");
    for(var i = 0 ; i < 5 ; i++) {
      if(out.length <= i) break;

      Client.send(to, out[i]);
    }
  });
}

module.exports = function(client, bot) {
  Client = client;
  Bot = bot;

  return information;
};
