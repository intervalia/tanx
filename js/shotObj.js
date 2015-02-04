var shotsId = 0;

function Shot(x, y, rotation, tankId) {
  this.id = shotsId++;
  this.tankId = tankId;
  this.distance = 0;
  this.velocity = 2;
  this.rotation = rotation;
  this.x = (x+10) + Math.cos(this.rotation) * 2;
  this.y = (y+10) + Math.sin(this.rotation) * 2;
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
