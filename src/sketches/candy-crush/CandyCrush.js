// kynd.info 2014
// http://paperjs.org/examples/candy-crash/

import Paper from 'paper';
import Ball from './Ball';

const { Point, Raster } = Paper;

class CandyCrush {
  constructor() {
    const view = Paper.view;
    const viewSizeWidth = view.size.width;
    const viewSizeHeight = view.size.height;
    const viewCenterX = view.center.x;
    const viewCenterY = view.center.y;

    const viewSizeWidthPortion = viewSizeWidth / 7;
    const viewSizeHeightPortion = viewSizeHeight / 4;

    const finalPosY = viewCenterY + viewSizeHeightPortion;

    const ballInfos = [
      {
        imgUrl: 'set1/sponge.png',
        finalPos: {
          x: viewCenterX - 2.4 * viewSizeWidthPortion,
          y: finalPosY
        }
      },
      {
        imgUrl: 'set1/didi.png',
        finalPos: {
          x: viewCenterX + 3 * viewSizeWidthPortion,
          y: finalPosY
        }
      },
      {
        imgUrl: 'set1/cumulus.png',
        finalPos: {
          x: viewCenterX - 1.6 * viewSizeWidthPortion,
          y: finalPosY
        }
      },
      {
        imgUrl: 'set1/break.png',
        finalPos: {
          x: viewCenterX + 2.25 * viewSizeWidthPortion,
          y: finalPosY
        }
      },
      {
        imgUrl: 'set1/phoebe.png',
        finalPos: {
          x: viewCenterX - 0.85 * viewSizeWidthPortion,
          y: finalPosY
        }
      },
      {
        imgUrl: 'set1/violet.png',
        finalPos: {
          x: viewCenterX + 1.5 * viewSizeWidthPortion,
          y: finalPosY
        }
      },
      {
        imgUrl: 'set1/sunny.png',
        finalPos: {
          x: viewCenterX + 0.75 * viewSizeWidthPortion,
          y: finalPosY
        }
      },
      {
        imgUrl: 'set1/drtin.png',
        finalPos: {
          x: viewCenterX + 0 * viewSizeWidthPortion,
          y: finalPosY
        }
      }
    ].map(({ imgUrl, ...rest }) => ({
      imgUrl: process.env.PUBLIC_URL + 'images/' + imgUrl,
      ...rest
    }));

    this.balls = [];

    const { width: viewWidth, height: viewHeight } = Paper.view.size;

    const ballRadiusStandard = Math.min(viewWidth, viewHeight) / 10;
    const ballSpeedStandard = 5;

    const balls = [];
    for (let ballInfo of ballInfos) {
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
      balls.push(
        new Ball(radius, position, vector, ballInfo.imgUrl, ballInfo.finalPos)
      );
    }

    this.balls = balls;

    // set background image
    const bgImg = new Raster(process.env.PUBLIC_URL + 'images/1883.jpg');
    bgImg.position = view.center;
    bgImg.sendToBack();
    bgImg.onLoad = event => {
      bgImg.scale(
        viewSizeWidth / bgImg.width,
        viewSizeHeight / bgImg.height,
        view.center
      );
      bgImg.opacity = 0;
    };
    this.bgImg = bgImg;

    this.isFinalStage = false;

    setTimeout(_ => {
      this.isFinalStage = true;

      for (let ball of balls) {
        ball.moveToFinalPos();
      }

      setTimeout(_ => {
        this.fadeInBgImg();
      }, 1000);
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

  /* chris */

  fadeInBgImg() {
    this.bgImg.tweenTo(
      {
        opacity: 1
      },
      2000
    );
  }
}

export default CandyCrush;
