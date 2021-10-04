// kynd.info 2014
// http://paperjs.org/examples/candy-crash/

import Paper from 'paper';
import Ball from './Ball';

const { Point, Raster, PointText, Color } = Paper;

class CandyCrush {
  constructor() {
    this.init();
  }

  init() {
    const view = Paper.view;
    const viewSizeWidth = view.size.width;
    const viewSizeHeight = view.size.height;
    const viewCenterX = view.center.x;
    const viewCenterY = view.center.y;

    const viewSizeWidthPortion = viewSizeWidth / 7;
    const viewSizeHeightPortion = viewSizeHeight / 3.5;

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
          y: finalPosY * 0.9
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
    const bgImg = new Raster(process.env.PUBLIC_URL + 'images/1883_tree.jpg');
    bgImg.opacity = 0;
    bgImg.position = view.center;
    bgImg.sendToBack();
    bgImg.onLoad = event => {
      bgImg.scale(
        viewSizeWidth / bgImg.width,
        viewSizeHeight / bgImg.height,
        view.center
      );
    };
    this.bgImg = bgImg;

    // set text
    const text = new PointText(view.center);
    this.text = text;
    text.content = "Season's Greetings!";
    text.opacity = 0;
    text.fontSize = 36;
    text.position = new Point(viewCenterX, viewCenterY * 0.65);
    this.textColorStop1 = new Color(1, 0, 0);
    this.textColorStop2 = new Color(0, 1, 0);
    this.textColorStop3 = new Color(0, 0, 1);
    //text.fillColor = new Color(1, 0, 0);
    this.setTextColorGrad();

    this.isFinalStage = false;

    this.tweenBgImgCurrent = null;
    this.tweenTextCurrent = null;
  }

  reset() {
    const time = 0.1;
    this.fadeBgImg(false, time);
    this.fadeText(false, time);
    this.isFinalStage = false;
  }

  start(transitionTime) {
    this.reset();

    setTimeout(_ => {
      this.isFinalStage = true;

      for (let ball of this.balls) {
        ball.moveToFinalPos();
      }

      setTimeout(_ => {
        const time = 2000;
        this.fadeBgImg(true, time);
        this.fadeText(true, time);
      }, 1000);
    }, transitionTime);
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
    } else {
      this.changeTextColorGrad();
    }
  }

  /* chris */

  fadeBgImg(isFadeIn, time) {
    if (this.tweenBgImgCurrent) {
      this.tweenBgImgCurrent.stop();
      this.tweenBgImgCurrent = null;
    }
    setTimeout(_ => {
      this.tweenBgImgCurrent = this.bgImg.tweenTo(
        {
          opacity: isFadeIn ? 1 : 0
        },
        time
      );
    }, 100);
  }

  fadeText(isFadeIn, time) {
    if (this.tweenTextCurrent) {
      this.tweenTextCurrent.stop();
      this.tweenTextCurrent = null;
    }
    this.tweenTextCurrent = this.text.tweenTo(
      {
        opacity: isFadeIn ? 1 : 0
      },
      time
    );
  }

  changeTextColorGrad(inc = 1) {
    this.textColorStop1.hue += inc;
    this.textColorStop2.hue += inc;
    this.textColorStop3.hue += inc;

    this.setTextColorGrad();
  }

  setTextColorGrad() {
    const text = this.text;
    text.fillColor = {
      gradient: {
        stops: [this.textColorStop1, this.textColorStop2, this.textColorStop3]
      },
      origin: text.bounds.topLeft,
      destination: text.bounds.bottomRight
    };
  }
}

export default CandyCrush;
