/* globals Vector2D, allMasks, ml5, Vue, Face, Hand, p5 */
// Widgets for recording and playing back hand data


// Needs to 
// - record many versions
// - have re-usable labels
// - record face or hand
Vue.component("tracking-recorder", {
  template: `<div class="widget tracking-widget">
    <div class="controls">
      <button :class="{active:isRecording}">⏺</button>
      
      <table>
        <tr v-for="recording in recordings">
          <td></td>
        </tr>
      </table>
    </div>
  </div>`,
  
  
  data() {
    return {
      isRecording: false,
      recordings: localStorage.getItem("recordings")
    }
  }
})