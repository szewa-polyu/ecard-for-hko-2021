// kynd.info 2014
// http://paperjs.org/examples/candy-crash/

import Paper from 'paper';
import Ball from './Ball';

const { Point } = Paper;

class CandyCrush {
  constructor() {
    const imgUrls = [
      'set1/sponge.png',
      'set1/didi.png',
      'set1/cumulus.png',
      'set1/break.png',
      'set1/violet.png',
      'set1/phoebe.png',
      'set1/sunny.png',
      'set1/drtin.png'
    ].map(imgUrl => process.env.PUBLIC_URL + 'images/' + imgUrl);
    const numBalls = imgUrls.length;

    this.balls = [];

    const { width: viewWidth, height: viewHeight } = Paper.view.size;

    const ballRadiusStandard = Math.min(viewWidth, viewHeight) / 10;
    const ballSpeedStandard = 5;

    const balls = [];
    for (let i = 0; i < numBalls; i++) {
      const randomPoint = Point.random();
      const position = new Point(
        randomPoint.x * viewWidth,
        randomPoint.y * viewHeight
      );
      const vector = new Point({
        angle: 360 * Math.random(),
        length: Math.random() * ballSpeedStandard
      });
      const radius = Math.random() * ballRadiusStandard + ballRadiusStandard;
      balls.push(new Ball(radius, position, vector, imgUrls[i]));
    }

    this.balls = balls;

    this.isFinalStage = false;
    setTimeout(_ => {
      this.isFinalStage = true;

      for (let ball of balls) {
        ball.moveToFinalPos();
      }
    }, 5000);
  }

  onFrame() {
    if (!this.isFinalStage) {
      const numBalls = this.balls.length;
      const balls = this.balls;
      for (let i = 0; i < numBalls - 1; i++) {
        for (let j = i + 1; j < numBalls; j++) {
          balls[i].react(balls[j]);
        }
      }
      for (let ball of balls) {
        ball.iterate();
      }
    }
  }
}

export default CandyCrush;
