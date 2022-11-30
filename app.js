/* globals Vector2D, allMasks, ml5, Vue, Face, Hand,oneHot,  p5, face, hands, CANVAS_WIDTH, CANVAS_HEIGHT, p */

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const SLIDER_COUNT = 5
let ALL_TASKS = {};

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


const RECORDER = new Recorder();

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
          <select v-model="selectedTaskID">
             <option v-for="(task, taskID) in allTasks" >{{taskID}} </option>
           </select>
           
          <button :class="{active:trackFace}" @click="trackFace=!trackFace">😐</button>
          <button :class="{active:trackHands}" @click="trackHands=!trackHands">🖐</button>
        
          <button @click="train">train</button>
        </div>
        
          <div>
           
            <data-recorder :sliderData="sliderData" :labelOptions="task.classifierOptions" />
         </div>
         
     
      </div>
	    <div id="view" ref="view">
        
      
        <div ref="canvasHolder" class="canvas-holder"></div>		
      </div>
      
		  
  </div>`,
    computed: {
      task() {
        return this.allTasks[this.selectedTaskID];
      },
    },

    watch: {
      recordFace() {
        this.updateHandsfree();
      },

      recordHands() {
        this.updateHandsfree();
      },
    },

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

          // Draw stuff
          this.task.draw(p, hands, face)
            
          // Playback a recording
          if (RECORDER.isPlaying)
            RECORDER.playbackFrame(hands, face)
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
        detectHands: this.trackHands,
        detectFace: this.trackFace,
        useHandsFree() {
          // Use the HF data if we aren't playing back data
          return !RECORDER.isPlaying
        },
        onFrame: (frameCount) => {
          // A frame happened! Record it?
          if (RECORDER.isRecording)
            RECORDER.recordFrame(face, hands)

          // Make a precition?
          // console.log(frameCount)
          if (frameCount % 10 == 0) {
            // Make a prediction every N frames
            
            
            let data = hands.map((hand) => hand.toData());
            data.forEach((handData, hIndex) => {
//               if (handData) {
//                 // console.log("Predict on ", handData.length)
                
//                 this.nn.predict(handData, (error, prediction) => {
//                   let index = indexOfMax(prediction.map((s) => s.value));

//                   let label = this.classifierOptions[index];
//                   console.log("Predicted", label);

//                   hands[hIndex].label = label;
//                 });
//               }
            });
          }
        },
      });
      // this.createModel();
      // this.loadModel();

      // this.train();
      
      this.startTask()
    },

    
    
    methods: {
      
      startTask() {
        // Run setup code
        this.task.setup(p, hands, face)
        
        let outputLength = this.task.classifierOptions?.length || SLIDER_COUNT
        let inputLength = HAND_LANDMARK_COUNT * 2
        console.log(`Creating a network from ${inputLength} input neurons`)
        console.log(`  to ${outputLength} output neurons`)
        
        // Make a new neural net for this task
         this.nn = ml5.neuralNetwork({
          task: "classification",
          inputs: inputLength,
          outputs: outputLength,
          outputLabels: this.task.classifierOptions,
          debug: true,
        });
        
        //========
        // Attempt to load the model
        console.log("NeuralNet - load a model!");
        console.log(" **Don't worry if this 'model.json' fails to load if you haven't created it yet**") 
      
        this.nn.load(this.task.modelDetails, () => {
          console.log("Model loaded?", this.nn);
          this.nn.hasLoadedModel = true;
        });
        
      },
      
      updateHandsfree() {
        console.log("Update tracking settings", this.trackFace, this.trackHands)
        this.handsfree.update({
          facemesh: this.trackFace,
          hands: this.trackHands,
        });
      },

     

     

      train() {
        console.log("NeuralNet - train!");
        

        RECORDER.recordings.forEach((rec) => {
          console.log("Training on label:", rec.label, rec.labelDesc);
          console.log(` ${rec.frames.length} frames`)
          rec.frames.forEach((frame) => {
            

            // Add each hand in the frame as the input data
            frame.hands.forEach((hand) => {
              
              const inputs = hand.flat();
              const outputs = rec.label;

              this.nn.addData(inputs, outputs);
            });
          });
        });
        this.nn.normalizeData();

        // Step 6: train your neural network
        const trainingOptions = {
          epochs: this.task.epochCount,
          batchSize: 12,
        };
        this.nn.train(trainingOptions, () => {
          console.log("Done training?");
          this.nn.save(() => {
            console.log("Model?");
          });
        });
      },

      
    },

    data() {
      return {
         
        sliderData: new Array(SLIDER_COUNT).fill(.5),
        
        allTasks: ALL_TASKS,
        selectedTaskID: Object.keys(ALL_TASKS)[0],

        // Recording
       
        trackHands: true,
        trackFace: false,
      };
    },
    el: "#app",
  });
});
