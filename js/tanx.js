//http://www.mikechambers.com/blog/2011/03/21/javascript-quadtree-implementation/
var KEY_ENTER = 13;
var KEY_SPACE = 32;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var KEY_LEFT = 37;

var MAX_SHOT_DISTANCE = 190;
var LIMIT = 500;

var running = false;
var startTime, endTime;
var tanx = [];
var shots = [];
var tankAIs = [
  { "user": true }, // 0
  { "file": "tank1.js" }, // 1
  { "file": "tank1.js" }, // 2
  { "file": "tank1.js" }, // 3
  {  }, // 4
  {  }, // 5
  {  }, // 6
  {  } // 7
]
function log(str) {
  var output = str;
  var len = arguments.length;
  var i;
  for (i = 1; i < len; i++) {
    output += " " + arguments[i];
  }
  var $el = $("<p></p>").html(output).appendTo(".output");
  $el[0].scrollIntoView();
}

function loadTank(fileName, cb) {
  var AIInitFunction = undefined;
  var url = "js/tanx/"+fileName;
  $.ajax({
    "url": url,
    "type": "GET",
    "dataType": "text"
  })
  .done(function(ai) {
    var fnWrapper =
      'var module = {"exports":{}}, window=undefined, document=undefined, $=undefined, jQuery=undefined;\n'+
      'try {'+ai+';}\n'+
      'catch(ex) {}\n'+
      'return module.exports;\n';

    AIInitFunction = new Function(fnWrapper);
  })
  .always(function() {
    cb(AIInitFunction);
  });
}

function loadTankAIs() {
  tankAIs.forEach(function(tankAI, index) {
    tanx[index].name = "---";
    if (!tankAI.user && tankAI.file) {
      loadTank(tankAI.file, function(initFunction) {
        if (initFunction) {
          var retVal = initFunction();
          tankAI.fn = retVal.ai;
          tankAI.name = retVal.name || "--";
          tanx[index].name = tankAI.name;
        }
        tankAI.loaded = true;
      })
    }
    else {
      if (tankAI.user) {
        tanx[index].name = "Keyboard";
        tankAI.loaded = true;
      }
    }
  });
}

function cloneData(obj) {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  var newObj = {};
  for(var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = cloneData(obj[key]);
    }
  }
  return newObj;
}

function itemDistance(tank1, tank2)
{
  var xs = Math.pow(tank2.x - tank1.x, 2);
  var ys = Math.pow(tank2.y - tank1.y, 2);
  return Math.sqrt( xs + ys );
}

function itemAngle(tank1, tank2) {
  // Returns angle in radians
  return Math.atan2(tank2.y - tank1.y, tank2.x - tank1.x);
}

function processLogic() {
  var tankList = [];

  tanx.forEach(function(tank) {
    tankList.push(new IntelInfo(tank));
  });

  tanx.forEach(function(tank, index) {
    var data, intel = {
      "me": {
        index: index,
        life: tank.life,
        shots: tank.shots
      },
      "tankList": [],
      "shotList": [],
      "helpers": {
        "itemDistance": itemDistance,
        "itemAngle": itemAngle
      }
    };


    if (tank.life > 0) {
      var ai = tankAIs[tank.id];
      if (ai && ai.loaded && ai.fn) {
        tankList.forEach(function(tankInfo) {
          intel.tankList.push(cloneData(tankInfo));
        });

        intel.shotList = [];
        shots.forEach(function(shot) {
          intel.shotList.push(new IntelInfo(shot));
        });
        data = ai.fn(intel);
        var cmd = new Command(data.direction, data.speed, data.shoot);
        if (cmd.stop) {
          if (tank.velocity !== 0) {
            tank.velocity = 0;
            //console.log("stopping!");
          }
        }
        else {
          if (tank.velocity === 0) {
            tank.velocity = 1;
            //console.log("going!");
          }
        }

        if (tank.velocityInc !== cmd.velocityInc) {
          tank.velocityInc = cmd.velocityInc;
          //console.log("change inc:", cmd.velocityInc);
        }

        if (tank.rotationDir !== cmd.rotationDir) {
          tank.rotationDir = cmd.rotationDir;
          //console.log("change dir:", cmd.rotationDir);
        }

        if(cmd.shoot) {
          shoot(tank);
        }
      }
    }
  });
}

function processTanx() {
  tanx.forEach(function(tank) {
    tank.move();
    tank.render();
  });
}

function processShots() {
  shots.forEach(function(shot, idx) {
    shot.move();
    shot.render();
  });

  for (var i = shots.length - 1; i > -1; i--) {
    var shot = shots[i];
    if (shot.distance > MAX_SHOT_DISTANCE) {
      shot.remove();
      shots.splice(i, 1);
    }
    else {
      var shotDead = false;
      tanx.forEach(function(tank) {
        var dist = itemDistance(tank, shot);
        if (dist < 10) {
          tank.decLife();
          shotDead = true;
          log("Tank", tank.id, "hit by tank", shot.tankId);
          tanx[shot.tankId].incScore();
        }
      });

      if (shotDead) {
        shot.remove();
        shots.splice(i, 1);
      }
    }
  }
}

function shoot(tank) {
  shot = tank.shoot();
  if (shot) {
    shots.push(shot);
  }
}

function pause() {
  running = false;
  endTime = (new Date()).valueOf()
  log( "Time run:", Math.round((endTime-startTime)/1000), "s");
}

function run() {
  startTime = (new Date()).valueOf()
  running = true;
  tick();
}

function displayScores() {
  tanx.forEach(function(tank) {
    var $score = $(".scores #score"+tank.id);
    var $name = $score.find(".name");
    var $value = $score.find(".value");

    $name.text(tank.id+":"+tank.name);
    $value.text(tank.score);
  });
}

function tick() {
  if (running) {
    processLogic();
    processTanx();
    processShots();
    displayScores();
    window.requestAnimationFrame(tick);
  }
}

$(document).ready(function() {
  var i, $scores = $(".scores");
  for( i = 0; i < 8; i++) {
    var tank = new Tank(Math.random()*LIMIT,Math.random()*LIMIT,1,Math.random()*6.28318531);
    tanx.push(tank);
    $scores.append('<span class="score-set" id="score'+i+'"><span class="name">name</span><span class="value">value</span></span>')
  }
  loadTankAIs();

  $(document).on({
    "keydown": keyDownHandler,
    "keyup": keyUpHandler,
  });
  $("#decLife").on("click", function() {
    tanx[0].decLife();
  })
  $("#toggleBtn").on("click", function() {
    var $btn = $("#toggleBtn");
    if (running) {
      pause();
      $btn.text("Run");
    }
    else {
      run();
      $btn.text("Pause");
    }
  })
});

function keyDownHandler(evt) {
  switch(evt.which) {
    case KEY_LEFT:
      tanx[0].rotationDir=-.1;
      break;

    case KEY_RIGHT:
      tanx[0].rotationDir=.1;
      break;

    case KEY_UP:
      tanx[0].velocityInc = 0.1;
      break;

    case KEY_DOWN:
      tanx[0].velocityInc = -0.1;
      break;

    case KEY_ENTER:
      tanx[0].velocity=0;
      tanx[0].velocityInc = 0;
      break;

    case KEY_SPACE:
      shoot(tanx[0], 0);
      break;

    default:
      return;
  }

  return false;
}

function keyUpHandler(evt) {
  switch(evt.which) {
    case KEY_LEFT:
    case KEY_RIGHT:
      tanx[0].rotationDir=0;
      break;

    case KEY_UP:
    case KEY_DOWN:
      tanx[0].velocityInc=0;
      break;

    default:
      return;
  }

  return false;
}
