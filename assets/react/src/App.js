import './App.css';
import React, { useState, useEffect, useRef } from 'react';

function App() {
  var [strokeStyle, setStrokeStyle] = useState('#ACD3ED');
  var [lineWidth, setLineWidth] = useState(5);
  var [ctx, setCtx] = useState(null);
  const canvas = useRef(null);
  var [undoStack, setUndoStack] = useState([]);
  var [redoStack, setRedoStack] = useState([]);

  var coord = { x: 0, y: 0 };

  useEffect(() => {
    canvas.current = document.getElementById('my_canvas')
    setCtx(canvas.current.getContext('2d'));
  }, [])

  useEffect(() => {
    if (ctx !== null) {
      const resize = () => {
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
      }
      window.addEventListener("resize", resize);
      resize();
    }
  }, [ctx])

  function reposition(event) {
    coord = {
      x: event.clientX - canvas.current.offsetLeft + 4,
      y: event.clientY - canvas.current.offsetTop + 20
    }
  }

  function loadCanvas(dataURL) {
    // clear current image
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    // load image from data url
    var imageObj = new Image();
    imageObj.src = dataURL;
    imageObj.onload = function () {
      if (undoStack.length !== 0)
        ctx.drawImage(this, 0, 0);
    };
  }

  function draw(event) {
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = strokeStyle;
    ctx.moveTo(coord.x, coord.y);
    reposition(event);
    ctx.lineTo(coord.x, coord.y);
    ctx.stroke();
  }

  function start(event) {
    canvas.current.addEventListener("mousemove", draw);
    reposition(event);
  }

  function stop(event) {
    canvas.current.removeEventListener("mousemove", draw);
    let dataURL = canvas.current.toDataURL();
    setUndoStack(prev => ([...prev, dataURL]))
    setRedoStack([]);
  }

  function undoCanvasAction(event) {
    setRedoStack(prev => ([...prev, undoStack[undoStack.length - 1]]))
    var tempArr = [...undoStack];
    tempArr.pop();
    setUndoStack(tempArr);
    // apply the new snapshot
    loadCanvas(tempArr[tempArr.length - 1]);
  }

  function redoCanvasAction(event) {
    setUndoStack(prev => ([...prev, redoStack[redoStack.length - 1]]))
    var tempArr = [...redoStack];
    loadCanvas(tempArr[tempArr.length - 1]);
    tempArr.pop();
    setRedoStack(tempArr);
    // apply the new snapshot
  }

  return (
    <div className="App">
      <div id="toolbox">
        <button id='undo' disabled={undoStack.length === 0} onClick={(e) => undoCanvasAction(e)}><i className="fas fa-undo"></i></button>
        <button id='redo' disabled={redoStack.length === 0} onClick={(e) => redoCanvasAction(e)}><i className="fas fa-redo"></i></button>
        <button id='erase'><i className="fas fa-eraser"></i></button>
        <input type="color" id="colorPicker" value={strokeStyle} onChange={(e) => setStrokeStyle(e.target.value)} />
      </div>
      <canvas
        id='my_canvas'
        ref={canvas}
        onMouseDown={(e) => start(e)}
        onMouseUp={(e) => stop(e)}
      >
      </canvas>
    </div>
  );
}

export default App;
