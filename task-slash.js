ALL_TASKS["slash"] = {
  desc: "slice horizontally to defend against dots",
  
  classifierOptions: ["🗡", "🛡", "🙃", "👊"],
  // sliderCount: 5,
  
  modelDetails: {
      model: "model/model.json",
      metadata: "model/model_meta.json",
      weights: "https://cdn.glitch.global/9df71f81-684c-4eec-b6fd-e1074f6828b8/model.weights.bin?v=1669646418329",
    },

  draw(p, hands, face) {
    
  },
    
  track: "HAND",
  // Options: "HAND", "HANDS", "HANDS AND FACE", "FACE"
}