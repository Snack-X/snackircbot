var information = {
  listener: {
    "message": onMessage,
  },
  command: ["!수능", "!수능2014", "!수능2015", "!수능2016"],
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

  var csatDate = {
    2014: new Date(2013, 10,  7, 8, 40, 0, 0),
    2015: new Date(2014, 10, 13, 8, 40, 0, 0),
    2016: new Date(2015, 10, 12, 8, 40, 0, 0)
  };

  var now = new Date();
  var yearNow = now.getFullYear() + 1;

  var match = cmd.match(/!수능(\d+)/), year;
  if(match === null) {
    var csatThis = csatDate[yearNow];

    if(now.getTime() < csatThis.getTime()) {
      year = yearNow;
    }
    else {
      year = yearNow + 1;
    }
  }
  else {
    year = parseInt(match[1], 10);
  }

  var csat = csatDate[year];
  var diff = Math.ceil((csat.getTime() - now.getTime()) / 1000);

  if(diff < 0) {
    Client.send(to, "" + year + " 수능이 시작되었거나 종료되었습니다.");
    return;
  }

  var lsec = diff % 60;
  diff = (diff - lsec) / 60;
  var lmin = diff % 60;
  diff = (diff - lmin) / 60;
  var lhour = diff % 24;
  diff = (diff - lhour) / 24;
  var lday = diff;

  Client.send(to, "" + year + " 수능까지 "+lday+"일 "+lhour+"시간 "+lmin+"분 "+lsec+"초 남았습니다.");
}

module.exports = function(client, bot) {
  Client = client;
  Bot = bot;

  return information;
};
