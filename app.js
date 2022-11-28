/* globals Vector2D, allMasks, ml5, Vue, Face, Hand, p5, face, hands, CANVAS_WIDTH, CANVAS_HEIGHT, p */

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
let ALL_TASKS = {}

let p = undefined;

// const VIDEO_SRC = [
//   //    https://www.lvlt.org/thequarantinemonologues
//   "https://cdn.glitch.global/9df71f81-684c-4eec-b6fd-e1074f6828b8/signing.mp4?v=1669481781584",
//   "https://cdn.glitch.global/f422c25d-a910-4374-8c72-f41291b2b254/youtuber.mp4?v=1668534362785",
//   "https://cdn.glitch.global/f422c25d-a910-4374-8c72-f41291b2b254/monologs-2.mp4?v=1668546942642",
// ];

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
      
          <div>
           <select v-model="taskID">
             <option v-for="(task, taskID) in allTasks" >{{taskID}} </option>
           </select>
            
         </div>
         
         <div>
           <select v-model="playbackRec">
             <option v-for="rec in recordings" :value="rec">{{rec.labelDesc}} {{new Date(rec.timestamp).toString()}}</option>
           </select>
           <button @click="togglePlayback">▶️</button> 
         </div>
         
         <div v-if="classifierOptions" >
           <select v-model="selectedOption">
             <option v-for="option in classifierOptions">{{option}}</option>
           </select>
           {{selectedOption}}
         </div>
         <div>
           <span class="label">label:</span><span class="value">{{label}}</span>
         </div>
        
        <button :class="{active:isRecording}" @click="toggleRecording">⏺</button>
      <button :class="{active:recordFace}" @click="recordFace=!recordFace">😐</button>
      <button :class="{active:recordHands}" @click="recordHands=!recordHands">🖐</button>
      <div v-if="isRecording">Frames: {{currentRecording.frames.length}}</div>
      
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

      label() {
        if (this.classifierOptions) {
          // The label is a one-hot of the classifier
          let label = new Array(this.classifierOptions.length).fill(0);
          let index = this.classifierOptions.indexOf(this.selectedOption);
          console.log(index, this.selectedOption, this.classifierOptions);
          label[index] = 1;
          return label;
        }
      },
    },

    watch: {
      playbackRec() {
        console.log("playbackRec", this.playbackRec);
      },
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
      document.body.onkeyup = (e) => {
        if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
          this.toggleRecording();
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
          p.fill(100)
          hands.forEach((h) => {
            h.points.forEach(pt => {
              p.textSize(30)
              p.text(h.label, ...pt)
            })
            
          });
          

          if (face.isActive) face.drawDebug(p);

          if (this.playbackFrameCount !== undefined) {
            console.log("PLAYBACK START", this.playbackFrameCount);
            this.playbackFrameCount += 1;
            let index =
              this.playbackFrameCount % this.playbackRec.frames.length;
            let frame = this.playbackRec.frames[index];

            hands.forEach((hand, handIndex) => {
              hand.fromRecord(frame.hands[handIndex]);
            });
          }
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
      this.handsfree = initHandsFree({
        face,
        hands,
        p,
        detectHands: this.recordHands,
        detectFace: this.recordFace,
        onFrame: (frameCount) => {
          // A frame happened! Record it?
          if (this.isRecording) {
            console.log("record frame");

            // Do we have any data?

            let frame = {};
            if (this.recordFace) frame.face = face.toRecord();
            if (this.recordHands) {
              frame.hands = [];
              hands.forEach((hand) => {
                if (hand.isActive) frame.hands.push(hand.toRecord());
              });
            }

            this.currentRecording.frames.push(frame);
          }

          // Make a precition?
          // console.log(frameCount)
          if (frameCount % 10 == 0) {
            let data = hands.map((hand) => hand.toData());
            data.forEach((handData, hIndex) => {
              if (handData) {
                // console.log("Predict on ", handData.length)
                this.nn.predict(handData, (error, prediction) => {
                  let index = indexOfMax(prediction.map((s) => s.value));

                  let label = this.classifierOptions[index];
                  console.log("Predicted", label)
                  
                  hands[hIndex].label = label;
                });
              }
            });
          }
        },
      });
      this.createModel();
      this.loadModel();

      // this.train();
    },

    methods: {
      createModel() {
        this.nn = ml5.neuralNetwork({
          task: "classification",
          inputs: HAND_LANDMARK_COUNT * 2,
          outputs: this.classifierOptions.length,
          outputLabels: this.classifierOptions,
          debug: true,
        });
      },

      loadModel() {
        const modelDetails = {
          model: "model/model.json",
          metadata: "model/model_meta.json",

          weights:
            // "https://cdn.glitch.global/9df71f81-684c-4eec-b6fd-e1074f6828b8/model.weights.bin?v=1669610244323",
            "https://cdn.glitch.global/9df71f81-684c-4eec-b6fd-e1074f6828b8/model.weights.bin?v=1669646418329",
        };
        this.nn.load(modelDetails, () => {
          console.log("Model loaded?", this.nn);
          this.nn.hasLoadedModel = true;
        });
      },

      train() {
        console.log("TRAIN");

        this.recordings.forEach((rec) => {
          console.log(rec.label);
          rec.frames.forEach((frame) => {
            console.log(frame.hands.length);

            // Add this hand as a labeled data
            frame.hands.forEach((hand) => {
              const inputs = hand.flat();
              const outputs = rec.label;
              console.log(inputs, outputs);

              this.nn.addData(inputs, outputs);
            });
          });
        });
        this.nn.normalizeData();

        // Step 6: train your neural network
        const trainingOptions = {
          epochs: 20,
          batchSize: 12,
        };
        this.nn.train(trainingOptions, () => {
          console.log("Done training?");
          this.nn.save(() => {
            console.log("Model?");
          });
        });
      },

      setToRecordFrame(frame) {
        if (frame.hands) {
          this.hands.forEach((hand, hIndex) =>
            hand.setToRecord(frame.hands[hIndex])
          );
        }
      },

      togglePlayback() {
        if (this.playbackFrameCount !== undefined) {
          console.log("Stop playback", this.playbackRec);
          this.playbackFrameCount = undefined;
          this.handsfree.unpause();
        } else {
          console.log("Start playback", this.playbackRec);
          this.playbackFrameCount = 0;
          this.handsfree.pause();
        }
      },

      toggleRecording() {
        this.isRecording = !this.isRecording;
        if (this.isRecording) {
          console.log("START RECORDING");

          this.currentRecording = {
            label: this.label,
            labelDesc: this.selectedOption,
            timestamp: Date.now(),
            frames: [],
          };
        } else {
          console.log("STOP RECORDING");
          console.log(this.currentRecording);
          this.recordings.push(this.currentRecording);
          this.currentRecording = undefined;

//           https://stackoverflow.com/questions/9339870/how-to-reduce-numbers-significance-in-jsons-stringify
          let data = JSON.stringify(this.recordings, function(key, val) {
    return val.toFixed ? Number(val.toFixed(3)) : val;
})
          
          localStorage.setItem("recordings", data);
        }
      },
    },

  
    data() {
      
      // Load recordings      
      let data = localStorage.getItem("recordings");
      let recordings = [];
      if (data) recordings = JSON.parse(data);
      
      
      return {
        playbackRec: recordings[0],
        playbackFrameCount: undefined,

        classifierOptions: ["🗡", "🛡", "🙃"],
        selectedOption: "🗡",
        
        allTasks: ALL_TASKS,
        selectedTaskID: Object.keys(ALL_TASKS)[0],
        
        // Recording
        isRecording: true,
        recordHands: true,
        recordFace: false,
        currentRecording: undefined,
        isRecording: false,
        recordings: recordings,
      };
    },
    el: "#app",
  });
});

