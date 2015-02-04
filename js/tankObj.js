var START_SHOT_COUNT = 100;
var MAX_SPEED = 1.5;
var tanxId = 0;

function Tank(x, y, velocity, rotation) {
  this.life = 10;
  this.id = tanxId++;
  this.x = x;
  this.y = y;
  this.velocity = velocity;
  this.velocityInc = 0;
  this.rotation = rotation;
  this.rotationDir = 0;
  this.shots = START_SHOT_COUNT;
  this.score = 0;
  $field = $(".field");
  this.el = $('<div class="tank" id="tank'+this.id+'"></div>');
  $field.append(this.el);
}

Tank.prototype.render = function() {
  this.el
  .css({
    "left": this.x+"px",
    "top": this.y+"px",
    "transform": "rotate("+this.rotation+"rad)"
  })
  .attr("lives", this.life)
  .attr("num", this.id);
};

Tank.prototype.move = function() {
  this.rotation += this.rotationDir;
  this.velocity += this.velocityInc;
  if (this.velocity > MAX_SPEED) {
    this.velocity = MAX_SPEED;
  }
  else
  if (this.velocity < -MAX_SPEED) {
    this.velocity = -MAX_SPEED;
  }

  this.x += Math.cos(this.rotation) * this.velocity;
  this.y += Math.sin(this.rotation) * this.velocity;
  if (this.x < 1) {
    this.x = 1;
  }
  if (this.y < 1) {
    this.y = 1;
  }
  if (this.x > LIMIT) {
    this.x = LIMIT;
  }
  if (this.y > LIMIT) {
    this.y = LIMIT;
  }
};

Tank.prototype.remove = function() {
  var $el = $(".field #tank"+this.id);
  $el.remove();
};

Tank.prototype.decLife = function(count) {
  count = count || 1;
  if (this.life > 0) {
    this.life -= count;
    if (this.life <= 0) {
      this.life = 0;
      this.remove();
    }
  }
};

Tank.prototype.incScore = function() {
  this.score++;
};

Tank.prototype.shoot = function() {
  if (this.shots > 0) {
    this.shots--;
    return new Shot(this.x, this.y, this.rotation, this.id);
  }
  else {
    return false;
  }
};
