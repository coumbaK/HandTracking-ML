/* globals Vector2D, allMasks, ml5, Vue, Face, Hand, p5 */

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 300;
let p = undefined;

const VIDEO_SRC = [
  //    https://www.lvlt.org/thequarantinemonologues
  "https://cdn.glitch.global/9df71f81-684c-4eec-b6fd-e1074f6828b8/signing.mp4?v=1669481781584",
  "https://cdn.glitch.global/f422c25d-a910-4374-8c72-f41291b2b254/youtuber.mp4?v=1668534362785",
  "https://cdn.glitch.global/f422c25d-a910-4374-8c72-f41291b2b254/monologs-2.mp4?v=1668546942642",
];

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
  const face = new Face();
  const hand = new Hand()

  new Vue({
    template: `<div id="app">
      <div id="controls">
        <select v-model="selectedID">
          <option v-for="maskID in Object.keys(allMasks)">{{maskID}}</option>
        </select>
        <button @click="switchInput">webcam</button>
        {{webcamMode}}
      </div>
	    <div id="view" ref="view">
        
        
        <!-- recorded video -->         
        <video controls muted id="video" class="main-video" ref="video" crossorigin="anonymous" v-if="!webcamMode">
          <source :src="sourceURL" type="video/mp4">
        </video>
        
        
        <div ref="canvasHolder" class="canvas-holder"></div>		
      </div>
      
		  
  </div>`,
    computed: {},

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
          p.clear()
            hand.draw(p);
          
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
      video.addEventListener("loadeddata", (event) => {
        console.log("Loaded video data!");
        this.startDetection();
      });
    },

    methods: {
      startDetection() {
        console.log("STARTING FACE DETECTION ON VIDEO");
        let video = this.$refs.video;

        face.predictionCount = 0;

        this.handpose = ml5.handpose(video, () => {
          console.log("hand model Loaded!");
          // Listen to new 'hand' events
          this.handpose.on('hand', results => {
            if (results.length > 0)
              console.log("HAND", results)
              hand.update(results[0])
          });
        });



        //         this.facemesh = ml5.facemesh(video, () => {
        //           console.log("face model Loaded!");

        //           // Listen to new 'face' events
        //           this.facemesh.on("face", (results) => {
        //             // New face prediction!

        //             this.facePredictions = results;
        //             face.setTo(this.facePredictions[0]);

        //             // Setup the mask if not
        //             // Initialize the first mask
        //             if (!this.hasBeenSetup) {
        //               console.log("Setup", this.selectedMask)
        //               this.selectedMask?.setup?.(p, face);
        //               this.hasBeenSetup = true;
        //             }
        //           });
        //
      },

      switchInput() {
        console.log("toggle input", this.webcamMode);

        function setMLToUseWebcam() {
          // Only change video when the video has loaded
          this.facemesh.video = this.webcam.elt;
          this.webcamMode = true;
        }

        if (!this.webcamStarted) {
          // Make a new video element to contain the webcam stream
          // We can't just use an existing one because
          //   P5 makes it very easy to do but creates its own element

          console.log("start new webcam stream");
          // Start the webcam stream
          this.webcam = p.createCapture(p.VIDEO, () => {
            this.webcamStarted = true;
            setMLToUseWebcam();
          });

          let camElt = this.webcam.elt;
          // Move the webcam element to the view
          camElt.setAttribute("id", "webcam");
          camElt.setAttribute("class", "main-video");
          this.$refs.view.append(camElt);
        } else {
          //           We already have the webcam, just toggle it
          if (this.webcamMode) {
            console.log("Turn off webcam");
            this.webcam.stop();
            this.webcamMode = false;
            this.webcam.elt.style.display = "none";
            this.facemesh.video = this.$refs.video;
            // let el = document.getElementById("webcam")
          } else {
            setMLToUseWebcam();
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

        facePredictions: [],
      };
    },
    el: "#app",
  });
});
