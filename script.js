window.onload = function () {
  // elements
  const canvas = document.getElementById("my_canvas");
  const ctx = canvas.getContext("2d");
  const undoButton = document.getElementById('undo');
  const redoButton = document.getElementById('redo');
  const eraseButton = document.getElementById('erase');
  const clearButton = document.getElementById('clearScreen');
  const colorPicker = document.getElementById('colorPicker');

  // variables
  let coord = { x: 0, y: 0 };
  let lineWidth = 5;
  let strokeStyle = '#ACD3ED';

  colorPicker.value = strokeStyle;

  // stacks
  var undo_stack = [];
  var redo_stack = [];

  // add event listeners
  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mouseup", stop);
  window.addEventListener("resize", resize);

  function checkStacks() {
    if (undo_stack.length === 0) {
      undoButton.disabled = true;
    }
    else {
      undoButton.disabled = false;
    }

    if (redo_stack.length === 0) {
      redoButton.disabled = true;
    }
    else {
      redoButton.disabled = false;
    }
  }
  checkStacks();

  function resize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
  }
  resize();

  function reposition(event) {
    coord.x = event.clientX - canvas.offsetLeft + 4;
    coord.y = event.clientY - canvas.offsetTop + 20;
  }

  function loadCanvas(dataURL) {
    // clear current image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // load image from data url
    var imageObj = new Image();
    imageObj.src = dataURL;
    imageObj.onload = function () {
      if (undo_stack.length !== 0)
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
    // empty redo stack
    redo_stack = [];
    checkStacks();
    canvas.addEventListener("mousemove", draw);
    reposition(event);
  }

  function stop() {
    canvas.removeEventListener("mousemove", draw);
    // add the snapshot in undo stack
    let dataURL = canvas.toDataURL();
    undo_stack.push(dataURL);
    checkStacks();
  }

  function undoCanvasAction(event) {
    redo_stack.push(undo_stack.pop());
    // apply the new snapshot
    loadCanvas(undo_stack[undo_stack.length - 1]);
    checkStacks();
  }

  function redoCanvasAction(event) {
    undo_stack.push(redo_stack.pop());
    // apply the new snapshot
    loadCanvas(undo_stack[undo_stack.length - 1]);
    checkStacks();
  }

  function clearCanvasAction(event) {
    let lastSnapshot = undo_stack.pop();
    undo_stack = [];
    redo_stack = [];
    loadCanvas();
    checkStacks();
  }

  function changeCanvasPenColor(event) {
    strokeStyle = colorPicker.value;
  }

  undoButton.onclick = undoCanvasAction;

  redoButton.onclick = redoCanvasAction;

  clearButton.onclick = clearCanvasAction;

  eraseButton.onclick = function eraseCanvasAction() {
    strokeStyle = 'white';
  }

  colorPicker.onchange = changeCanvasPenColor;

  document.onkeydown = function (event) {
    var evtobj = window.event ? event : e
    if (evtobj.keyCode == 90 && evtobj.ctrlKey)
      undoCanvasAction()
    if (evtobj.keyCode == 89 && evtobj.ctrlKey)
      redoCanvasAction()
  }


}