class Recorder {
  constructor() {
    this.isRecording = false;
    this.isPlaying = false;
    
     // Load recordings
    let data = localStorage.getItem("recordings");
    this.recordings = [];
    if (data) this.recordings = JSON.parse(data);
    

  }
  
  saveRecordings() {
    let data = JSON.stringify(this.recordings, function (key, val) {
        return val.toFixed ? Number(val.toFixed(3)) : val;
      });
    localStorage.setItem("recordings", data);
  }
  // ====================================
  // Recording

   toggleRecording(recording) {
    if (this.isRecording)
      this.stopRecording()
    else 
      this.startRecording(recording)
  }
  
  startRecording(label, labelDesc) {
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
    // Record a frame of hands and face data
    let frame = {};
    if (face.isActive) {
      frame.face = face.toFrame();
    }

    hands.forEach((hand, handIndex) => {
      if (!frame.hands) frame.hands = [];
      frame.hands.push(hand.toFrame());
    });

    this.data.frames.push(frame);
  }

  get frameCount() {
    return this.data?.frames.length;
  }

  stopRecording() {
    let data = this.data;
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

  playbackFrame(face, hands) {
    // Increment counter
    this.playbackIndex = (this.playbackIndex + 1) % this.data.frames.length;

    // Get the frame
    let frame = this.data.frames[this.playbackIndex];

    // Set the hands and face to this frame
    if (frame.face) face.fromRecord(frame.face);
    if (frame.hands) {
      frame.hands.forEach((data, handIndex) =>
        hands[handIndex].fromRecord(data)
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
  template: `<div>
          
    <div>
    
      <select v-model="selectedRecording">
        <option v-for="rec in recordings" :value="rec">
          {{rec.labelDesc || rec.label}} {{new Date(rec.timestamp).toLocaleTimeString()}}
        </option>
      </select>
      
      <button :class="{active:recorder.isRecording}" @click="recorder.togglePlayback(selectedRecording)">⏯</button>
      <button @click="recorder.deleteRecording(selectedRecording)">🗑</button> 
      <div v-if="recorder.isPlaying" class="callout">
       {{recorder.playbackFrame}}/{{recorder.frameCount}}
      </div>
    </div>

    <div>
      <!-- Labels for this data --> 
      <!-- Options or sliders? --> 
      
      <div v-if="labelOptions" >
        Class: <select v-model="selectedOption">
          <option v-for="option in labelOptions">{{option}}</option>
        </select>
      </div>
      
      <table>
        <tr v-for="">
      </table>

      <div class="callout">
        <span class="label">Current label:</span><span class="value">{{label}}</span>
      </div>

    </div>

    <div>
      <button  
        :class="{active:recorder.isRecording}" 
        @click="recorder.toggleRecording">⏺</button>
      <div v-if="recorder.isRecording" class="callout">
        Frames: {{recorder.frameCount}}
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

  props: ["labelOptions"],
});
