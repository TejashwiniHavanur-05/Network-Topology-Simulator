const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let devices=[];
let links=[];
let id=0;

let dragging=null;

class Device{

constructor(type,x,y){
this.id=id++;
this.type=type;
this.x=x;
this.y=y;
}

draw(){

ctx.beginPath();
ctx.arc(this.x,this.y,25,0,Math.PI*2);

if(this.type=="pc") ctx.fillStyle="#2ecc71";
if(this.type=="router") ctx.fillStyle="#e74c3c";
if(this.type=="switch") ctx.fillStyle="#3498db";

ctx.fill();
ctx.stroke();

ctx.fillStyle="black";
ctx.font="12px Arial";
ctx.fillText(this.type.toUpperCase(),this.x-20,this.y+40);

}

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

links.forEach(link=>{

ctx.beginPath();
ctx.moveTo(link.a.x,link.a.y);
ctx.lineTo(link.b.x,link.b.y);
ctx.strokeStyle="#555";
ctx.lineWidth=2;
ctx.stroke();

});

devices.forEach(d=>d.draw());

}

function addDevice(type){

let x=Math.random()*900+100;
let y=Math.random()*400+100;

devices.push(new Device(type,x,y));

draw();

}

function connect(a,b){

links.push({a,b});

}

function generateStar(){

links=[];

let center=devices[0];

for(let i=1;i<devices.length;i++){
connect(center,devices[i]);
}

draw();

}

function generateBus(){

links=[];

for(let i=0;i<devices.length-1;i++){
connect(devices[i],devices[i+1]);
}

draw();

}

function generateRing(){

links=[];

for(let i=0;i<devices.length;i++){

let next=(i+1)%devices.length;

connect(devices[i],devices[next]);

}

draw();

}

function generateMesh(){

links=[];

for(let i=0;i<devices.length;i++){

for(let j=i+1;j<devices.length;j++){

connect(devices[i],devices[j]);

}

}

draw();

}

function sendPacket(){

if(links.length==0) return;

let link=links[Math.floor(Math.random()*links.length)];

let t=0;

function animate(){

draw();

let x=link.a.x+(link.b.x-link.a.x)*t;
let y=link.a.y+(link.b.y-link.a.y)*t;

ctx.beginPath();
ctx.arc(x,y,8,0,Math.PI*2);
ctx.fillStyle="orange";
ctx.fill();

t+=0.02;

if(t<=1) requestAnimationFrame(animate);

}

animate();

}

function resetNetwork(){

devices=[];
links=[];

draw();

}

/* DRAG AND DROP */

canvas.addEventListener("mousedown",e=>{

let rect=canvas.getBoundingClientRect();

let x=e.clientX-rect.left;
let y=e.clientY-rect.top;

devices.forEach(d=>{

let dx=d.x-x;
let dy=d.y-y;

if(Math.sqrt(dx*dx+dy*dy)<25){
dragging=d;
}

});

});

canvas.addEventListener("mousemove",e=>{

if(dragging){

let rect=canvas.getBoundingClientRect();

dragging.x=e.clientX-rect.left;
dragging.y=e.clientY-rect.top;

draw();

}

});

canvas.addEventListener("mouseup",()=>{

dragging=null;

});
