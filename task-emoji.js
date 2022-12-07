ALL_TASKS["emoji"] = {
  desc: "Detect emoji",

  // Add classifier options to do classification,
  // or comment out for 5 sliders for continuous values
  classifierOptions: ["👆", "✌️", "👍", "👊", "🤙", "🖐"],

  // How long you want to train for
  // Find an accuracy that works for you
  epochCount: 20,

  modelDetails: {
    model: "emoji/model.json",
    metadata: "emoji/model_meta.json",
    weights:
      "https://cdn.glitch.global/9df71f81-684c-4eec-b6fd-e1074f6828b8/model.weights.bin?v=1669775994921",
  },

  preload(p) {
    // Any extra asset loading
    // free sound effects: https://freesound.org/
    // Be sure to cite in your .md!
   
  },
  
  setup(p) {
    // Do any setup work here
   
    this.color = [100, 100, 80]
    this.points = 10
  },
  
  onChangeLabel(hand, newLabel, oldLabel) {
   
    // An event happened!
    console.log(`Changed from ${oldLabel} to ${newLabel}` )
  
    // Random color? 
        this.color = [360*Math.random(), 100, 50]
       this.points++
  
  },

  draw(p, hands, face) {
    p.background(...this.color)   

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
       
        
      }
    });
    
    // Show text if you want!
    p.fill(0)
    p.text(this.points + " points", 350, 250);
  },

  track: "HAND",
  // Options: "HAND", "HANDS", "HANDS AND FACE", "FACE"
};
