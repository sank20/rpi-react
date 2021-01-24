import { Component } from "react";

class WandMovementCanvas extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // console.log(canvas);
    // canvas.width = 640;
    // canvas.height = 480;

    console.log("did mount");
    animateMovement();
  }
  render() {
    return (
      <p>
        <canvas id="canvas" width="300" height="300">
          Wand Movement
        </canvas>
      </p>
    );
  }
}
var x = 20;
var dx = 0;
var y = 150;
var dy = 1;
var direction = 1;
var delta = Math.random();
function animateMovement() {
  var canvas = document.querySelector("canvas");
  if (canvas) {
    var ctx = canvas.getContext("2d");
  }
  //   if (x < 300) {
  window.requestAnimationFrame(animateMovement);
  //   }
  //   ctx.globalCompositeOperation = "destination-over";
  ctx.clearRect(0, 0, 300, 300); // clear canvas
  ctx.fillStyle = "#ffffff";
  //   ctx.save();
  //   ctx.translate(150, 10);

  //   var time = new Date();
  //   ctx.rotate(
  //     ((2 * Math.PI) / 60) * time.getSeconds() +
  //       ((2 * Math.PI) / 60000) * time.getMilliseconds()
  //   );

  ctx.fillRect(x, y, 5, 5);
  //   for (let i = 0; i < 300; i++) {
  // ctx.fillRect(50 + i, 50 + i, 5, 5);
  // console.log("dot dikha kya?");
  //   }
  if ((direction > 0 && x >= 300) || (direction < 0 && x <= 0)) {
    direction = -direction;
  }
  if (direction > 0) {
    x += delta;
  } else {
    x -= delta;
  }
  y += Math.sin(dx) * 50;
  //   y++;
  dx++;
}
export default WandMovementCanvas;
