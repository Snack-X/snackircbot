var utils = require("./ircUtils");

module.exports = function() {
  return function(irc) {
    irc.on("welcome", function(e) {
      irc.chans = [];
    });

    irc.on("join", function(e) {
      var nick = e.nick;
      var channel = e.channel;

      if(nick !== irc.me) return;

      irc.chans.push(channel);
    });

    irc.on("part", function(e) {
      var nick = e.nick;
      var channel = e.channel;

      if(nick !== irc.me) return;

      var pos = irc.chans.indexOf(channel);
      irc.chans.splice(pos, 1);
    });

    irc.on("kick", function(e) {
      var nick = e.nick;
      var channel = e.channel;

      if(nick !== irc.me) return;

      var pos = irc.chans.indexOf(channel);
      irc.chans.splice(pos, 1);
    });
  };
};
