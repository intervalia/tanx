function Command(direction, speed, shoot) {
  this.stop = false;
  this.velocityInc = 0;
  this.rotationDir = 0;

  switch(direction) {
    case DIRECTION.LEFT:
      this.rotationDir = -0.1;
      break;

    case DIRECTION.RIGHT:
      this.rotationDir = +0.1;
      break;
  }
  switch(speed) {
    case SPEED.STOP:
      this.stop = true;
      break;

    case SPEED.SLOWER:
      this.velocityInc = -0.1;
      break;

    case SPEED.FASTER:
      this.velocityInc = +0.1;
      break;
  }

  this.shoot = !!shoot;
}
