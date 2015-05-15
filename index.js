var net = require("net");
var path = require("path");
var irc = require("slate-irc");

var Config = require(path.join(__dirname, "/config.json"));
var Stream, Client;

(function() {

  var trackChannel = require(path.join(__dirname, "/plugin/trackChannel"));

  Stream = net.connect({
    host: Config.irc.host,
    port: Config.irc.port
  });

  Client = irc(Stream);

  Client.use(trackChannel());

})();

////////////////////////////////////////////////////////////////////////////////
// BOT BODY, MODULE MANAGEMENT

// node module unloading
// ref : http://stackoverflow.com/a/14801711

require.uncache = function(moduleName) {
  require.searchCache(moduleName, function(mod) {
    delete require.cache[mod.id];
  });

  Object.keys(module.constructor._pathCache).forEach(function(cacheKey) {
    if(cacheKey.indexOf(moduleName) > 0)
      delete module.constructor._pathCache[cacheKey];
  });
};

require.searchCache = function(moduleName, callback) {
  var mod = require.resolve(moduleName);

  if (mod && ((mod = require.cache[mod]) !== undefined)) {
    (function run(mod) {
      mod.children.forEach(function(child) { run(child); });
      callback(mod);
    })(mod);
  }
};

var Bot = (function() {
  var Modules = {};
  var ModuleListFile = "/modules.json";
  var ModuleList = require(path.join(__dirname, ModuleListFile));

  function reloadModuleList() {
    require.uncache(path.join(__dirname, ModuleListFile));
    ModuleList = require(path.join(__dirname, ModuleListFile));
    return true;
  }

  function loadModule(name) {
    var file = ModuleList[name];
    if(typeof file === "undefined")
      throw new Error("Error:MODMAN - Module does not exist");

    // load module
    Modules[name] = require(path.join(__dirname, file))(Client, Bot);

    // register event
    for(var eventName in Modules[name].listener) {
      var eventListener = Modules[name].listener[eventName];

      Client.on(eventName, eventListener);
    }

    return true;
  }

  function unloadModule(name) {
    var file = ModuleList[name];
    if(typeof file === "undefined")
      throw new Error("Error:MODMAN - Module does not exist");

    // unregister event
    for(var eventName in Modules[name].listener) {
      var eventListener = Modules[name].listener[eventName];

      Client.removeListener(eventName, eventListener);
    }

    // unload module
    require.uncache(path.join(__dirname, file));

    return true;
  }

  return {
    reloadModuleList: reloadModuleList,
    loadModule: loadModule,
    unloadModule: unloadModule,

    getModules: function() { return Modules; },
    getModuleList: function() { return ModuleList; }
  };
})();

// autoload modules
for(var name in Bot.getModuleList()) {
  try {
    Bot.loadModule(name);
  }
  catch(e) {
    console.error("Error:SYSTEM - Failed to load module " + name);
    console.error(e.message);
  }
}

////////////////////////////////////////////////////////////////////////////////
// ENTRY POINT

Client.on("errors", function(e) {
  console.error(e);
});

Client.nick(Config.bot.nick);
Client.user(Config.bot.userName, Config.bot.realName);
