const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

// Current tool settings
let p; // Processing object, accessible from anywhere
let color0 = [160, 100, 50];
let color1 = [320, 100, 50];
let brushSize = 1;

// Change this to whichever brush you are working on
const START_BRUSH_INDEX = 0;

let brushes = [
  
  //======================================================
  //======================================================
  // Example brushes
  {
    label: "🖌",
    description:
      "A basic paint brush.  It uses the color0 and size properties set by the sliders.  It is a 'discrete' brush",

    // Options: setup (when tool is selected), draw (every frame),
    mouseDragged() {
      let x = p.mouseX;
      let y = p.mouseY;
      let r = brushSize * 10 + 10;
      
      // Remove the stroke and set the color to the current color
      p.noStroke();
      p.fill(color0[0], color0[1], color0[2]);
      
      p.circle(x, y, r);
    },
  },
  
  //======================================================
  

  {
    label: "🖌",
    description:
      "A basic paint brush.  It uses the color0, color1, and size properties set by the sliders",

    setup() {
      //       Count how many times we've drawn
      this.drawCount = 0;
    },

    // Options: setup (when tool is selected), draw (every frame),
    mouseDragged() {
      console.log("Drag...");

      //       Here I am keeping track of both the current time, and how many times this brush has drawn

      let t = p.millis() * 0.001; // Get the number of seconds
      this.drawCount += 1;
      let x = p.mouseX;
      let y = p.mouseY;
      // let r = brushSize*100

      //       Change the brush by how many we have drawn
      // let r = brushSize*(50+ 100*p.noise( this.drawCount*.1))
      //       Change the brush by the current time
      // let r = brushSize*(50+ 100*p.noise(t*10))

      console.log(x, y);

      //       Remove the stroke and set the color to the current color

      //       Shadow
      p.noStroke();
      p.fill(color0[0], color0[1], color0[2] * 0.2, 0.1);
      p.circle(x, y + r * 0.15, r * 1.1);

      p.noStroke();
      p.fill(color0[0], color0[1], color0[2]);
      p.circle(x, y, r);

      p.noStroke();
      p.fill(color1[0], color1[1], color1[2]);
      p.circle(x - r * 0.1, y - r * 0.1, r * 0.7);

      //       Highlight
      p.noStroke();
      p.fill(color1[0], color1[1], color1[2] * 1.4);
      p.circle(x - r * 0.15, y - r * 0.15, r * 0.5);
    },
  },
  //======================================================
  
  {
    label: "😂",
    description: "laughcry paint brush",

    // Options: setup (when tool is selected), draw (every frame),
    mouseDragged() {
      console.log("Drag...");
      let x = p.mouseX;
      let y = p.mouseY;
      
      let size = 20
      let count = 10
      
      for (var i = 0; i < count; i++) {
        p.textSize(size)
        p.text("😂", x, y);
      }
    },
  },
];
