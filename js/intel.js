function IntelInfo(item) {
  this.x = item.x;
  this.y = item.y;
  this.velocity = item.velocity;
  this.rotation = item.rotation;
}

var DIRECTION = {
  "LEFT": "LEFT",
  "STRAIGHT": "STRAIGHT",
  "RIGHT": "RIGHT"
};

var SPEED = {
  "STOP": "STOP",
  "SLOWER": "SLOWER",
  "MAINTAIN": "MAINTAIN",
  "FASTER": "FASTER"
}
