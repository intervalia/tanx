var shotsId = 0;
var xOff = 70;
var yOff = 25;

function Shot(x, y, rotation, tankId) {
  this.id = shotsId++;
  this.tankId = tankId;
  this.distance = 0;
  this.velocity = 2;
  this.rotation = rotation;
  this.x = x + Math.cos(this.rotation) * xOff;
  this.y = y + Math.sin(this.rotation) * yOff;
  var $field = $(".field");
  this.el = $('<div class="shot" id="shot'+this.id+'"></div>');
  $field.append(this.el);
  this.render();
}

Shot.prototype.render = function() {
  this.el.css({
    "left": this.x+"px",
    "top": this.y+"px",
    "transform": "rotate("+this.rotation+"rad)"
  });
}

Shot.prototype.move = function() {
  this.x += Math.cos(this.rotation) * this.velocity;
  this.y += Math.sin(this.rotation) * this.velocity;
  this.distance++;
}

Shot.prototype.remove = function() {
  var $el = $(".field #shot"+this.id);
  $el.remove();
}
