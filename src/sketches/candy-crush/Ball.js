// kynd.info 2014
// http://paperjs.org/examples/candy-crash/

import Paper from 'paper';

const { Point, Path, Raster } = Paper;

class Ball {
  constructor(r, p, v, imgUrl, finalPos) {
    this.radius = r;
    this.point = p;
    this.vector = v;
    this.maxVec = 5;
    this.numSegment = Math.floor(r / 3 + 2);
    this.boundOffset = [];
    this.boundOffsetBuff = [];
    this.sidePoints = [];
    this.path = new Path({
      // fillColor: {
      //   hue: Math.random() * 360,
      //   saturation: 1,
      //   brightness: 1
      // },
      blendMode: 'lighter'
    });

    for (let i = 0; i < this.numSegment; i++) {
      this.boundOffset.push(this.radius);
      this.boundOffsetBuff.push(this.radius);
      this.path.add(new Point());
      this.sidePoints.push(
        new Point({
          angle: (360 / this.numSegment) * i,
          length: 1
        })
      );
    }

    const raster = new Raster(imgUrl);
    raster.position = p;
    raster.onLoad = event => {
      // raster.size = new Size(r * 2, r * 2);
      // const color = raster.getAverageColor(p);
      // color.alpha = 0.5;
      // this.path.fillColor = color;

      this.radius = Math.max(raster.width, raster.height) / 2;
    };

    this.raster = raster;

    this.raster.rotate(Math.random() * 360);
    this.rotateSpeed = (Math.random() - 0.5) * 5;
    const minRotateSpeed = 1;
    if (Math.abs(this.rotateSpeed) < minRotateSpeed) {
      this.rotateSpeed = Math.sign(this.rotateSpeed) * minRotateSpeed;
    }
  }

  iterate() {
    this.checkBorders();
    if (this.vector.length > this.maxVec) {
      this.vector = new Point({
        angle: this.vector.angle,
        length: this.maxVec
      });
    }
    this.point = this.point.add(this.vector);
    this.raster.position = this.point;
    this.raster.rotate(this.rotateSpeed);
    //this.updateShape();
  }

  checkBorders() {
    const size = Paper.view.size;
    if (this.point.x < -this.radius) {
      this.point.x = size.width + this.radius;
    }
    if (this.point.x > size.width + this.radius) {
      this.point.x = -this.radius;
    }
    if (this.point.y < -this.radius) {
      this.point.y = size.height + this.radius;
    }
    if (this.point.y > size.height + this.radius) {
      this.point.y = -this.radius;
    }
  }

  updateShape() {
    const segments = this.path.segments;
    for (let i = 0; i < this.numSegment; i++) {
      segments[i].point = this.getSidePoint(i);
    }

    this.path.smooth();
    for (let i = 0; i < this.numSegment; i++) {
      if (this.boundOffset[i] < this.radius / 4)
        this.boundOffset[i] = this.radius / 4;
      const next = (i + 1) % this.numSegment;
      const prev = i > 0 ? i - 1 : this.numSegment - 1;
      let offset = this.boundOffset[i];
      offset += (this.radius - offset) / 15;
      offset +=
        ((this.boundOffset[next] + this.boundOffset[prev]) / 2 - offset) / 3;
      this.boundOffsetBuff[i] = this.boundOffset[i] = offset;
    }
  }

  react(b) {
    const dist = this.point.getDistance(b.point);
    if (dist < this.radius + b.radius && dist !== 0) {
      const overlap = this.radius + b.radius - dist;
      const direc = this.point.subtract(b.point).normalize(overlap * 0.015);
      this.vector = this.vector.add(direc);
      b.vector = b.vector.subtract(direc);

      // this.calcBounds(b);
      // b.calcBounds(this);
      // this.updateBounds();
      // b.updateBounds();
    }
  }

  getBoundOffset(b) {
    const diff = this.point - b;
    const angle = (diff.angle + 180) % 360;
    return this.boundOffset[
      Math.floor((angle / 360) * this.boundOffset.length)
    ];
  }

  calcBounds(b) {
    for (let i = 0; i < this.numSegment; i++) {
      const tp = this.getSidePoint(i);
      const bLen = b.getBoundOffset(tp);
      const td = tp.getDistance(b.point);
      if (td < bLen) {
        this.boundOffsetBuff[i] -= (bLen - td) / 2;
      }
    }
  }

  getSidePoint(index) {
    return this.point.add(
      this.sidePoints[index].multiply(this.boundOffset[index])
    );
  }

  updateBounds() {
    for (let i = 0; i < this.numSegment; i++) {
      this.boundOffset[i] = this.boundOffsetBuff[i];
    }
  }

  /* chris */

  moveToFinalPos() {
    const raster = this.raster;
    raster.tweenTo(
      {
        position: Paper.view.center,
        rotation: 0
      },
      2000 + Math.random() * 3000
    );
  }
}

export default Ball;
