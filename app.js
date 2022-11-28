/* globals Vector2D, allMasks, ml5, Vue, Face, Hand, p5, face, hands, CANVAS_WIDTH, CANVAS_HEIGHT, p */

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
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
       
        
        <button :class="{active:isRecording}" @click="toggleRecording">⏺</button>
      <button :class="{active:recordFace}" @click="recordFace=!recordFace">😐</button>
      <button :class="{active:recordHands}" @click="recordHands=!recordHands">🖐</button>
      
      <details>
        <summary>recordings</summary>
        <table>
          <tr v-for="recording in recordings">
            <td></td>
          </tr>
        </table>
      </details>
      </div>
	    <div id="view" ref="view">
        
      
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

    watch: {
      recordFace() {
         this.handsfree.update({
    facemesh: this.recordFace,
    hands: this.recordHands,
  });
      },
      
       recordHands() {
         this.handsfree.update({
    facemesh: this.recordFace,
    hands: this.recordHands,
  });
      },
      
    },
    mounted() {
      // Listen for space bar
      document.body.onkeyup = function (e) {
        if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
          this.isRecording = !this.isRecording;
        }
      };

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
      console.log(p, CANVAS_WIDTH, CANVAS_HEIGHT);

// Start handsfree
      this.handsfree = initHandsFree({face, hands, p, 
                     detectHands: this.recordHands,
                     detectFace: this.recordFace,
                     onFrame: () => {
        // A frame happened! Record it?
      }});

      
    },

    methods: {
      toggleRecording() {
        this.isRecording = !this.isRecording
        if (this.isRecording) {
          console.log("START RECORDING")
        } else {
          console.log("STOP RECORDING")
        }
      }
      
    },

    // We will use your data object as the data for Vue
    data() {
      let lastID = localStorage.getItem("lastMask");
      if (!allMasks[lastID]) lastID = Object.keys(allMasks)[0];
      return {
        // Recording
        isRecording: true,
        recordHands: true,
        recordFace: false,
        currentRecording: undefined,
        isRecording: false,
        recordings: localStorage.getItem("recordings"),
      };
    },
    el: "#app",
  });
});
