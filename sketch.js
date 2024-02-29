var plate, burin, sparks, tar, acid, water;
var rough_slider;
var back;
var pg;

var wax_but;
var acid_but;
var but_arr = [];
var state = 0; // 1 = Etching, 2 = Acid, 3 = Post-acid, 4 = Washing, 5 = Ink, 6 = Press
var tool = 0; // 0 = Hand, 1 = Burin, 2 = Painting

var copy_buf;

var acidTimer = 0;
var ramping = true;

var wiped = false;

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function preload() {
  plate = loadImage("images/copperplate.jpg");
  burin = loadImage("images/burin.png");
  sparks = loadImage("images/sparks.gif");
  sparks.resize(10, 10);
  tar = loadImage("images/tar.png");
  acid = loadImage("images/acid.jpg");
  water = loadImage("images/water.jpg");
  roller = loadImage("images/roller.png");
  roller.resize(100, 0);
  paper = loadImage("images/paper.jpg");
}

function setup() {
  cursor();
  createCanvas(window.innerWidth - 20, window.innerHeight - 20);
  pg = createGraphics(window.innerWidth -20, window.innerHeight - 20);
  fakePaint = createGraphics(window.innerWidth - 20, window.innerHeight - 20);
  whitecanv = createGraphics(window.innerWidth - 20, window.innerHeight - 20)
  whitecanv.pixelDensity(1);
  fakePaint.pixelDensity(1);
  pg.pixelDensity(1);
  pg.colorMode(HSL);
  textAlign(CENTER);

  textSize(15);

  // SETUP INPUTS
  wax_but = createButton("Tar");
  wax_but.class("button-50");
  wax_but.position(600, 600);

  wax_but.mouseClicked(() => {
    plate = tar;
    state = 1;
    wax_but.hide();
    /* imageMode(CENTER);
    console.log("test");
    image(tar, window.innerWidth/2, window.innerHeight/2,) */
  });

  acid_but = createButton("Acid");
  acid_but.class("acid-button");
  acid_but.mouseClicked(() => { 
    cursor();
    copy_buf = pg.get();
    state = 2; 
    acid_but.hide();
  });

  wash_but = createButton("Wash");
  wash_but.class("wash-button");
  wash_but.mouseClicked(() => { 
    cursor();
    copy_buf = pg.get();
    state = 4; 
    wash_but.hide();
    acidTimer = 0;
  });

  wipe_but = createButton("Wipe");
  wipe_but.class("button-73");
  wipe_but.mousePressed(() => {
    state = 6;
    cursor();
    plate = loadImage("images/copperplate.jpg");
    wipe_but.hide();
  })

  paper_but = createButton("Paper");
  paper_but.class("button-73");
  paper_but.mousePressed(() => {
    cursor();
    plate = paper;
  })

  but_arr.push(wax_but);
  but_arr.push(acid_but);
  but_arr.push(wash_but);
  but_arr.push(wipe_but);
  but_arr.push(paper_but);
  let vert_offset = 150;
  let horiz_offset = 100;
  for (let i = 0; i < but_arr.length; i++) {
    but_arr[i].position(horiz_offset, vert_offset);
    vert_offset += 80;
  }

  slider = createSlider(1, 6);
  slider.position(window.innerWidth / 2, (window.innerHeight / 10) + 30);
  slider.center('horizontal');

  burin_tool = createImg('images/burin.png');
  burin_tool.mouseClicked(() => {
    tool = 1;
  });
  roller_tool = createImg('images/roller.png');
  roller_tool.mouseClicked(() => {
    tool = 2;
  })
}
  
function draw() {
  clear();
  background(150);
  drawPlate();
  drawToolbox();

  text('Change how roughly you etch: ', window.innerWidth / 2, window.innerHeight / 10);

  imageMode(CORNER);

  if (state == 1) {
    image(pg, 0, 0);
    if (tool == 1) {
      noCursor();
      drawTool();
        if (mouseIsPressed) {
          pg.strokeWeight(slider.value());
          pg.stroke(20, 69, getRandomArbitrary(40, 60));
          pg.line(mouseX, mouseY, pmouseX, pmouseY);
          drawSparks();
        }
    }
  } else if (state == 2) {
    tint(50, 150, 0, 255);
    image(copy_buf, 0, 0);
    tint(255, 255, 255, 255);
    drawAcid();
    if (acidTimer >= 240) state = 3;
    acidTimer++;
  } else if (state == 3) {
    tint(130);
    image(copy_buf, 0, 0);
    tint(200);
  } else if (state == 4) {
    drawWater();
    copy_buf = pg.get()
    imageMode(CENTER);
    tint(0, 50, 100, 40);
    image(copy_buf, window.innerWidth/2, window.innerHeight/2);
    tint(255, 255, 255, 255);
    if (acidTimer >= 240) state = 5;
    acidTimer++;
  } else if (state == 5) {    

    copy_buf = pg.get();
    image(copy_buf, 0, 0);
    image(fakePaint, 0, 0);
    imageMode(CORNER);
    //whitecanv.rect((window.innerWidth/2) - 400, (window.innerHeight/2)-300, 800, 600);
    //image(whitecanv, 0, 0);
    //whitecanv.image(paper, window.innerWidth/2, window.innerHeight/2, 800, 600);
    //image(whitecanv, 0, 0);
    if (tool == 2) {
      drawRoller();
      if (mouseIsPressed) {
        fakePaint.fill(0, 0, 0);
        fakePaint.rect(mouseX, mouseY, 159, 20);
      }
    }

  } else if (state == 6) {
    copy_buf = pg.get();
    tint(0);
    image(copy_buf, 0, 0);
    tint(255);
  }
}

function drawToolbox() {
  let box_width = 200;
  rect((window.innerWidth * (3/4)), window.innerHeight/4, box_width*2, 400);
  text("Toolbox", (window.innerWidth * (3/4)) + box_width, (window.innerHeight/4) + 20);
  burin_tool.position((window.innerWidth * (3/4)) + box_width - 25, (window.innerHeight/4) + 80);
  burin_tool.style('width:100px');
  roller_tool.position((window.innerWidth * (3/4)) + box_width - 25, (window.innerHeight/4) + 250)
  roller_tool.style('width:100px');
}

function drawRoller() {
  imageMode(CENTER);
  roller.resize(200, 0);
  image(roller, mouseX + 85, mouseY + 100);
}

function drawWater() {
  imageMode(CENTER);
  tint(255, 150);
  image(water, window.innerWidth/2, window.innerHeight/2, 800, 600);
  tint(255, 255);
}

function sleep(millisecondsDuration)
{
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  })
}

function drawAcid() {
  imageMode(CENTER);
  tint(255, 70);
  image(acid, window.innerWidth/2, window.innerHeight/2, 800, 600);
  tint(255, 255);
 }

function drawSparks() {
  imageMode(CENTER);
  image(sparks, mouseX, mouseY, 70, 70);
}

function drawPlate() {
  imageMode(CENTER);
  image(plate, window.innerWidth/2, window.innerHeight/2, 800, 600);
}

function drawTool() {
  imageMode(CENTER);
  burin.resize(300, 0);
  image(burin, mouseX - 100, mouseY + 115);
}