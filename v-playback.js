/* globals Vector2D, allMasks, ml5, Vue, Face, Hand, p5 */
// Widgets for recording and playing back hand data


// Needs to 
// - record many versions
// - have re-usable labels
// - record face or hand
Vue.component("tracking-recorder", {
  template: `<div class="widget tracking-widget">
    <div class="controls">
      <button :class="{active:isRecording}" @click="toggleRecording">⏺</button>
      <button :class="{active:recordFace}" @click="recordFace=!recordFace">😐</button>
      <button :class="{active:recordHands}" @click="recordHands=!recordHands">🖐</button>
      
      <table>
        <tr v-for="recording in recordings">
          <td></td>
        </tr>
      </table>
    </div>
  </div>`,
  
  methods: {
    toggleRecording() {
      if (this.isRecording) {
        // Stop recording
         this.isRecording=false
       
      } else {
        // Start recording
        this.isRecording=true
        this.currentRecording = {
          hands: this.recordHands?[[]]:undefined,
          face: this.recordFace?[[]]:undefined,
        }
      }
    }
  },
  data() {
    return {
      handsfree: handsfree,
      recordHands: true,
      recordFace: false,
      currentRecording: undefined,
      isRecording: false,
      recordings: localStorage.getItem("recordings")
    }
  }
})