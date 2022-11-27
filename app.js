/* globals Vector2D, allMasks, ml5, Vue, Face, Hand, p5, face, hands */

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 500;
let p = undefined;

const VIDEO_SRC = [
  //    https://www.lvlt.org/thequarantinemonologues
  "https://cdn.glitch.global/9df71f81-684c-4eec-b6fd-e1074f6828b8/signing.mp4?v=1669481781584",
  "https://cdn.glitch.global/f422c25d-a910-4374-8c72-f41291b2b254/youtuber.mp4?v=1668534362785",
  "https://cdn.glitch.global/f422c25d-a910-4374-8c72-f41291b2b254/monologs-2.mp4?v=1668546942642",
];

console.log("Create face and hands");
const face = new Face();
const hands = [new Hand(), new Hand()];

window.addEventListener("load", function () {
  //------------------------------------------------------
  //------------------------------------------------------
  //------------------------------------------------------
  //------------------------------------------------------
  // VUE!!!
  // Create a new vue interface

  //   This has to stay outside of Vue,
  // otherwise the Vector2d extention-of-arrays
  // and the Vue extension of datatypes will fight

  new Vue({
    template: `<div id="app">
      
      <div id="controls">
       
        <button @click="switchInput">webcam</button>
        
        <tracking-recorder />
      </div>
	    <div id="view" ref="view">
        
        
        <!-- recorded video -->         
        <video controls muted id="video" class="main-video" ref="video" crossorigin="anonymous" v-if="false">
          <source :src="sourceURL" type="video/mp4">
        </video>
        
        
        <div ref="canvasHolder" class="canvas-holder"></div>		
      </div>
      
		  
  </div>`,
    computed: {
      inactiveVideoElement() {
        return !this.webcamMode ? this.webcam.elt : this.$refs.video;
      },
      activeVideoElement() {
        return this.webcamMode ? this.webcam.elt : this.$refs.video;
      },
    },

    watch: {},
    mounted() {
      // Create P5 when we mount this element
      const s = (p0) => {
        p = p0;

        (p.preload = () => {
          // Any preloading
        }),
          (p.setup = () => {
            p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
            p.colorMode(p.HSL, 360, 100, 100);
            p.ellipseMode(p.RADIUS);
          });

        p.draw = () => {
          p.clear();

          // if (this.webcam) {
          //   p.push();
          //   //move image by the width of image to the left
          //   p.translate(this.webcam.width, 0);
          //   //then scale it by -1 in the x-axis
          //   //to flip the image
          //   p.scale(-1, 1);
          //   //draw video capture feed as image inside p5 canvas
          //   p.image(this.webcam, 0, 0);
          //   p.pop();
          // }

          hands.forEach((h) => h.draw(p));

          if (face.isActive) face.drawDebug(p);
        };

        p.mouseClicked = () => {
          // Mouse interaction
        };
      };

      // Create P5
      const CANVAS_EL = this.$refs.canvasHolder;
      CANVAS_EL.style.width = CANVAS_WIDTH + "px";
      CANVAS_EL.style.height = CANVAS_HEIGHT + "px";

      p = new p5(s, CANVAS_EL);

      // When the video is loaded, start face detection
      let video = this.$refs.video;
      if (video)
        video.addEventListener("loadeddata", (event) => {
          console.log("Loaded video data!");
          // this.startDetection();
        });

      initHandsFree(face, hands);

      // this.switchInput();
    },

    methods: {
      startDetection() {
        console.log("STARTING FACE DETECTION ON VIDEO");
        let video = this.$refs.video;

        // SETUP HAND TRACTING
        this.handpose = ml5.handpose(video, () => {
          console.log("hand model Loaded!");

          // Listen to new 'hand' events
          this.handpose.on("hand", (results) => {
            // New hand
            if (results.length > 0) {
              // console.log("HAND", results);

              if (this.webcamMode) {
                // Mirror all the points
                // console.log(results[0].landmarks[0])
                results[0].landmarks.forEach((pt) => {
                  pt[0] = this.webcam.width - pt[0];
                });
              }
              hand.isActive = true;
              hand.update(results[0]);
            }
          });
        });

        //         // SETUP FACE TRACKING
        //         this.facemesh = ml5.facemesh(video, () => {
        //           console.log("face model Loaded!");

        //           // Listen to new 'face' events
        //           this.facemesh.on("face", (results) => {
        //        face.isActive = true
        //             // New face prediction!
        //             if (results.length > 0) face.setTo(results[0]);
        //           });
        //         });
      },

      setInputStream() {
        console.log("Set input stream:", this.webcamMode);
        console.log("\tactive", this.activeVideoElement);
        // Only change video when the video has loaded
        if (this.facemesh) this.facemesh.video = this.activeVideoElement;
        if (this.handpose) this.handpose.video = this.activeVideoElement;

        // this.activeVideoElement.style.display = "block";
        // this.inactiveVideoElement.style.display = "none";
      },

      switchInput() {
        console.log("SWITCH INPUT", this.webcamMode);

        if (!this.webcamStarted) {
          // Make a new video element to contain the webcam stream
          // We can't just use an existing one because
          //   P5 makes it very easy to do but creates its own element

          console.log("start new webcam stream");

          // Start the webcam stream
          this.webcam = p.createCapture(p.VIDEO, () => {
            this.webcam.hide();
            this.webcamStarted = true;
            this.webcamMode = true;
            this.setInputStream();
          });

          // Move the webcam element to the view
          // p5 puts its somewhere unhelpful by default
          let camElt = this.webcam.elt;
          camElt.setAttribute("id", "webcam");
          camElt.setAttribute("class", "main-video");
          this.$refs.view.append(camElt);
        } else {
          //           We already have the webcam, just toggle it
          if (this.webcamMode) {
            //             console.log("Turn off webcam");
            //             this.webcam.stop();
            //             this.webcamMode = false;
          } else {
          }
        }
      },
    },

    // We will use your data object as the data for Vue
    data() {
      let lastID = localStorage.getItem("lastMask");
      if (!allMasks[lastID]) lastID = Object.keys(allMasks)[0];
      return {
        hasBeenSetup: false,

        webcamMode: false,
        webcamStarted: false,
        allMasks: allMasks,
        selectedID: lastID,

        sourceURL: VIDEO_SRC[0],
        sources: VIDEO_SRC,
      };
    },
    el: "#app",
  });
});
