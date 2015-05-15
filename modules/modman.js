var information = {
  listener: {
    "message": onMessage
  },
  command: ["!명령어"],
  opCommand: ["-modman", "-module"]
};

var Client, Bot;

function onMessage(e) {
  var nick = e.from;
  var to = e.to;
  var text = e.message;
  var host = e.hostmask.hostname;

  /**
   *  MODMAN commands
   *    `-modman list`           list available modules
   *    `-modman reload`         reload list of modules
   *    `-modman info <name>`    read information of module <name>
   *
   *    `-module list`           list loaded modules
   *    `-module load <name>`    load module <name>
   *    `-module unload <name>`  unload module <name>
   *    `-module reload <name>`  reload module <name>
   */

  // commands are available to specific host
  var AVAILABLE_HOST = "irc.korsnack.kr";
  if(host !== AVAILABLE_HOST) return;

  var arr = text.split(" ");

  var cmd = arr[0];
  var subcmd = arr[1];
  var arg = arr[2];

  if(cmd === "-modman") {
    if(typeof subcmd === "undefined") {
      Client.send(to, "Error:MODMAN - Try `-modman list|reload|info`");
    }
    else if(subcmd === "list") {
      var list = Object.keys(Bot.getModuleList());
      var msg = list.join(", ");

      Client.send(to, "Available modules - " + msg);
    }
    else if(subcmd === "reload") {
      try {
        Bot.reloadModuleList();
        Client.send(to, "Module list reloaded.");
      }
      catch(e) {
        Client.send(to, e.message);
      }
    }
    else if(subcmd === "info") {
      if(typeof arg === "undefined") {
        Client.send(to, "Error:MODMAN - Try `-modman info <name>`");
      }
      else if(typeof Bot.getModuleList()[arg] === "undefined") {
        Client.send(to, "Error:MODMAN - Module does not exist");
      }
      else
        Client.send(to, Bot.getModuleList()[arg].information);
    }
  }
  else if(cmd === "-module") {
    if(typeof subcmd === "undefined") {
      Client.send(to, "Error:MODMAN - Try `-module list|load|unload|reload`");
    }
    else if(subcmd === "list") {
      var list = Object.keys(Bot.getModules());
      var msg = list.join(", ");

      Client.send(to, "Loaded modules - " + msg);
    }
    else if(subcmd === "load") {
      if(typeof arg === "undefined") {
        Client.send(to, "Error:MODMAN - Try `-module load <name>`");
      }
      else if(typeof Bot.getModuleList()[arg] === "undefined") {
        Client.send(to, "Error:MODMAN - Module does not exist");
      }
      else {
        try {
          Bot.loadModule(arg, Bot.getModuleList()[arg]);
          Client.send(to, arg + " loaded.");
        }
        catch(e) {
          Client.send(to, e.message);
        }
      }
    }
    else if(subcmd === "unload") {
      if(typeof arg === "undefined") {
        Client.send(to, "Error:MODMAN - Try `-module unload <name>`");
      }
      else if(typeof Bot.getModuleList()[arg] === "undefined") {
        Client.send(to, "Error:MODMAN - Module does not exist");
      }
      else {
        try {
          Bot.unloadModule(arg);
          Client.send(to, arg + " unloaded.");
        }
        catch(e) {
          Client.send(to, e.message);
        }
      }
    }
    else if(subcmd === "reload") {
      if(typeof arg === "undefined") {
        Client.send(to, "Error:MODMAN - Try `-module reload <name>`");
      }
      else if(typeof Bot.getModuleList()[arg] === "undefined") {
        Client.send(to, "Error:MODMAN - Module does not exist");
      }
      else {
        try {
          Bot.unloadModule(arg);
          Bot.loadModule(arg);
          Client.send(to, arg + " reloaded.");
        }
        catch(e) {
          Client.send(to, e.message);
        }
      }
    }
  }
  else if(cmd === "!명령어" || cmd === "!cmd" || cmd === "!도움말" || cmd === "!help") {
    var commands = [];
    for(var name in Bot.getModules()) {
      commands = commands.concat(Bot.getModules()[name].command);
    }

    Client.send(to, "Commands - " + commands.join(", "));
  }
  else if(cmd === "!cmdall") {
    var commands = [];
    for(var name in Bot.getModules()) {
      commands = commands.concat(Bot.getModules()[name].command);
      commands = commands.concat(Bot.getModules()[name].opCommand);
    }

    Client.send(to, commands.join(", "));
  }
}

module.exports = function(client, bot) {
  Client = client;
  Bot = bot;

  return information;
};
