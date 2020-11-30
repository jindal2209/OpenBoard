var canvas = document.querySelector(".board");
var tool = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


function myfunc(event){
	var x = event.clientX;
	var y = event.clientY;
	tool.strokeStyle = "red";
	tool.lineTo(x,y)
	tool.stroke();
}

function clearCanvas(){
	tool.clearRect(0,0,window.innerWidth,window.innerHeight);
}