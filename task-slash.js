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
      weights: "https://cdn.glitch.global/9df71f81-684c-4eec-b6fd-e1074f6828b8/model.weights.bin?v=1669646418329",
    },
  
  setup(p) {
    
  },

  draw(p, hands, face) {
    hands.forEach(hand => {
      // hand.points.forEach(pt => p.circle(...pt, 10))
       hand.points.forEach((pt, index) => p.text(index, ...pt))
    })
  },
    
  track: "HAND",
  // Options: "HAND", "HANDS", "HANDS AND FACE", "FACE"
}