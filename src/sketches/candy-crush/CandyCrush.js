// kynd.info 2014
// http://paperjs.org/examples/candy-crash/

var balls = [];
var numBalls = 18;
for (var i = 0; i < numBalls; i++) {
  var position = Point.random() * view.size;
  var vector = new Point({
    angle: 360 * Math.random(),
    length: Math.random() * 10
  });
  var radius = Math.random() * 60 + 60;
  balls.push(new Ball(radius, position, vector));
}

function onFrame() {
  for (var i = 0; i < balls.length - 1; i++) {
    for (var j = i + 1; j < balls.length; j++) {
      balls[i].react(balls[j]);
    }
  }
  for (var i = 0, l = balls.length; i < l; i++) {
    balls[i].iterate();
  }
}
