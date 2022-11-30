class Recorder {
  constructor() {
    this.isRecording = false;
    this.isPlaying = false;
    
     // Load recordings
    let data = localStorage.getItem("recordings");
    this.recordings = [];
    if (data) this.recordings = JSON.parse(data);
    this.data = undefined

  }
  
  saveRecordings() {
   
    let data = JSON.stringify(this.recordings, function (key, val) {
      if (val !== undefined)
        return val.toFixed ? Number(val.toFixed(3)) : val;
      return undefined
      });
    console.log(data)
    localStorage.setItem("recordings", data);
  }
  // ====================================
  // Recording

  toggleRecording(label, labelDesc) {
    if (this.isRecording)
      this.stopRecording()
    else 
      this.startRecording(label, labelDesc)
  }
  
  startRecording(label, labelDesc) {
    console.log("RECORDER - start recording")
    // Begin recording data
    
    
    this.data = {
      timestamp: Date.now(),
      frames: [],
      label: label,
      labelDesc: labelDesc,
    };
    this.isRecording = true;
  }

  recordFrame(face, hands) {
    console.log("RECORDER - record frame")
    // Record a frame of hands and face data
    
    let frame = {};
       // Only save valid face data, skip if its not active
     
    let faceData = face.toFrame();
    if (faceData)
      frame.face = faceData


    hands.forEach((hand, handIndex) => {
      
      
      let handData = hand.toFrame()
     
      // Only save valid hand data, skip if its not active
      if (handData) {
        // Add a field for the hands if it doesn't exist
        if (!frame.hands) frame.hands = [];
        frame.hands.push(handData);
      }
        
    });
   
    
    this.data.frames.push(frame);
    console.log("Frame:", this.data.frames.length, this.frameCount)
  }

  get frameCount() {
    return this.data?.frames.length;
  }

  stopRecording() {
    console.log("RECORDER - stop recording")
    
    let data = this.data;
    this.recordings.push(data)
    this.saveRecordings()
    
    this.isRecording = false;
    this.data = undefined;
  

    return data;
  }
  
  deleteRecording(recording) {
    console.log("Deleted", 
        recording.label, 
        recording.labelDesc, 
        new Date(recording.timestamp).toLocaleTimeString())
    
    let index = this.recordings.indexOf(recording)
    this.recordings.splice(index, 1)
    this.saveRecordings()
  }

  // ====================================
  // Playback
  togglePlayback(recording) {
    if (this.isPlaying)
      this.stopPlayback()
    else 
      this.startPlayback(recording)
  }
  
  startPlayback(recording) {
    if (this.isRecording) {
      console.warn("Cannot playback when recording");
      return;
    }
    this.data = recording;
    this.playbackIndex = 0;
    this.isPlaying = true;
  }

  playbackFrame(hands, face) {
    // Increment counter
    this.playbackIndex = (this.playbackIndex + 1) % this.data.frames.length;

    // Get the frame
    let frame = this.data.frames[this.playbackIndex];

    // Set the hands and face to this frame
    if (frame.face) face.fromFrame(frame.face);
    if (frame.hands) {
      console.log(frame.hands, hands)
      frame.hands.forEach((data, handIndex) =>
        hands[handIndex].fromFrame(data)
      );
    }
  }

  stopPlayback() {
    this.data = undefined;
    this.isPlaying = false;
  }
}

//===================================================
//===================================================
//===================================================
// Vue widget
Vue.component("data-recorder", {
  template: `<div style="display:flex;flex-direction:row;">
    <div> 
      <div>

        <select v-model="selectedRecording" style="width:150px;">
          <option v-for="rec in recordings" :value="rec">
            {{rec.labelDesc || rec.label}} {{new Date(rec.timestamp).toLocaleTimeString()}}
          </option>
        </select>
        
        <div>
          <button :class="{active:recorder.isPlaying}" 
            @click="recorder.togglePlayback(selectedRecording)">
            ⏯
          </button>
          
          <button 
            @click="recorder.deleteRecording(selectedRecording)">
            🗑
          </button> 

          <button  
            :class="{active:recorder.isRecording}" 
            @click="recorder.toggleRecording(label, labelDesc)">
            ⏺
          </button>
        </div>
      </div>
      <div v-if="recorder.isPlaying || recorder.isRecording" class="callout">
         <span v-if="recorder.isPlaying">{{recorder.playbackIndex}}/ </span>{{recorder.frameCount}} frames
        </div>
      
    </div>

    <div style="border:1px solid black">
      <div style="display:flex;flex-direction:row;">
        <!-- Labels for this data --> 
        <!-- Options or sliders? --> 

        <div v-if="labelOptions" >
          Class: <select v-model="selectedOption">
            <option v-for="option in labelOptions">{{option}}</option>
          </select>
        </div>

        <!-- sliders -->
        <div  v-if="labelOptions === undefined">
          <label for="labelDesc">Landmark name:</label><br>
          <input id="labelDesc" >
          
          <table>
            <tr v-for="(val, index) in sliderData"> 
              <td style="width:40px;text-align:right">
                {{val}}
              </td>
              <td>
                <input min=0 max=1 step=.02 type="range" v-model="sliderData[index]"/>
              </td>
            </tr>
          </table>
        </div>
        
      </div>
      <div class="callout">
        <span class="label">Training label:</span><span class="value">{{label}}</span>
      </div>
    </div>

   



    </div>`,

 

  // Events:
  // Every draw frame, advance the playback
  // Every hf frame, record the data
  computed: {
    label() {
      // What is the current label of this training data?
      if (this.labelOptions) {
        let options = this.labelOptions;
        // The label is a one-hot of the classifier
        let index = options.indexOf(this.selectedOption);
        let oneHotLabel = oneHot(options.length, index);

        return oneHotLabel;
      } else {
        return this.sliderLabels.slice();
      }
    },
    
    labelDesc() {
      // Use the classes
      if (this.labelOptions)
        return this.selectedOption
      
    }
  },
  mounted() {
    // Listen for space bar
    document.body.onkeyup = (e) => {
      if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
        this.toggleRecording();
      }
    };
  },
  data() {
   
    return {
      
      selectedOption: this.labelOptions[0],
      recorder: RECORDER,
      recordings: RECORDER.recordings,
      selectedRecording: RECORDER.recordings[0],
    };
  },

  props: ["labelOptions", "sliderData"],
});
