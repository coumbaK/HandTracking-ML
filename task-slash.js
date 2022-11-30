ALL_TASKS["slash"] = {
  desc: "slice horizontally to defend against dots",

  // Add classifier options to do classification,
  // or comment out for 5 sliders for continuous values
  classifierOptions: ["🗡", "🛡", "🙃", "👊"],

  // How long you want to train for
  // Find an accuracy that works for you
  epochCount: 20,

  modelDetails: {
    model: "slash/model.json",
    metadata: "slash/model_meta.json",
    weights:
      "https://cdn.glitch.global/9df71f81-684c-4eec-b6fd-e1074f6828b8/model.weights.bin?v=1669775994921",
  },

  setup(p) {
    // Do any setup work here
    this.osc = new p5.Oscillator('sine');
    // this.osc.start()
    // this.osc.stop()
  },
  
  onChangeLabel(hand, newLabel, oldLabel) {
    
    if (hand.prediction.certainty > .9) {
    // An event happened!
    console.log(`Changed from ${oldLabel} to ${newLabel}` )
    
      // Make a theremin!
        //    if (newLabel === "🗡")
        //    this.osc.start()
        // if (newLabel === "🛡")
        //    this.osc.stop()
      
      // Play a sound
    }
  },

  draw(p, hands, face) {
   

    hands.forEach((hand) => {
      // Draw each hand
      if (hand.isActive) {
        // Test drawing
        hand.points.forEach((pt) => p.circle(...pt, 10));
        // hand.points.forEach((pt, index) => p.text(index, ...pt))

        p.circle(...hand.center, 20);
  
        hand.fingers.forEach((f, index) => {
          let fingertip = f[3]
          p.fill(index*40, 100, 50)
          p.circle(...fingertip, 20)
        })      
        
        let pitch = 400 - hand.center[1]
        // console.log("Pitch", pitch)
         this.osc.freq(pitch);
        
       
        
        if (hand.prediction) {
          // Use the label and uncertainty to draw
          // console.log(hand.prediction);
          let pred = hand.prediction;
          p.textSize(pred.certainty ** 2 * 70);
          p.text(pred.label, ...hand.center);
          
         
        }
      }
    });
  },

  track: "HAND",
  // Options: "HAND", "HANDS", "HANDS AND FACE", "FACE"
};
