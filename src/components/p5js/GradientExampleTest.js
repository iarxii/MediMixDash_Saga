// this is a p5js sketch that creates a gradient background
// and rotates it in 3D space with random colors from a predefined array

// issue is that the gradients appear aliased and the code seems to be non-performant

const Y_AXIS = 1;
const X_AXIS = 2;
let c1, c2;


let newColors;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // createCanvas(2000, 2000, WEBGL);
  // Define colors
  c1 = color('#05C9F9');
  c2 = color('F2BBF1');

}

function draw() {
  
let colorArray = ["#B8B8D1",'#5B5F97','#FFC145','#FFFFFB','#FF6B6C','#558B6E','#704C5E','#F1C8DB','#331832','#694D75','#1B5299','#9FC2CC','#F1ECCE'];
  newColors = colorArray;

  let tempNum = int(random(newColors.length));
  c1 = color(newColors[tempNum]);
  newColors.splice(tempNum,1);
  c2 = color(newColors[int(random(newColors.length))]);

  frameRate(.2);
  translate(random(-width/2,width/2),random(-height/2,height/2))
  push();  
  for (let i=0; i<50; i++) {
  let r = random(2,50);
  rotateY(i/r);
    r = random(2,50);
  rotateX(i/r);
    r = random(2,50);
  rotateZ(i/r);
  setGradient(0, 0, width, height, c1, c2, Y_AXIS);
  }
  


  pop();

}

function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

function mousePressed() {
 // saveCanvas("broken_gradients.jpg") ;
}