import Paper from "paper";

const draw1 = () => {
  let myPath = new Paper.Path();

  Paper.view.onMouseDown = (event) => {
    myPath.strokeColor = "white";
    myPath.strokeWidth = 3;
  };

  Paper.view.onMouseDrag = (event) => {
    myPath.add(event.point);
  };

  Paper.view.draw();
};

export default draw1;