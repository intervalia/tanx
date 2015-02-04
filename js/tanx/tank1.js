var t1dir = DIRECTION.STRAIGHT;

function tankBrain(intel) {
  var t1spd = SPEED.MAINTAIN;
  var t1shoot = false;
  var myId = intel.me.index;

  //log("Intel:", JSON.stringify(intel));

  var a = Math.round(Math.random() * 100);
  if (a < 25) {
    t1dir = DIRECTION.LEFT;
  }
  else if (a > 75) {
    t1dir = DIRECTION.RIGHT;
  }

  a = Math.round(Math.random() * 1000);
  if (a < 5) {
    t1spd = SPEED.STOP;
  }
  else if (a < 300) {
    t1spd = SPEED.SLOWER;
  }
  else if (a > 750) {
    t1spd = SPEED.FASTER;
  }

  if (intel.me.shots) {
    a = Math.round(Math.random() * 1000);
    if (a < 10) {
      t1shoot = true;
    }
  }

  return {
    "direction": t1dir,
    "speed": t1spd,
    "shoot": t1shoot
  };
}

module.exports.ai = tankBrain;
module.exports.name = "Random";
