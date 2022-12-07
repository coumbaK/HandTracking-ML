ALL_TASKS["dance"] = {
  desc: "This does too many things, but is an example of what you could do",

  // Add classifier options to do classification,
  // or comment out for 5 sliders for continuous values
  classifierOptions: ["🦈", "🦈👴🏾", "🦈👵🏾", "🌊"],

  // How long you want to train for
  // Find an accuracy that works for you
  epochCount: 20,

  modelDetails: {
    model: "dance/model.json",
    metadata: "dance/model_meta.json",
    weights:
      "https://cdn.glitch.global/94c4b6a1-03c7-41bb-b579-aa6780e9a47d/model.weights.bin?v=1670445397805",
  },

  preload(p) {
    // Any extra asset loading
    // free sound effects: https://freesound.org/
    // Be sure to cite in your .md!
   
    
    this.swordHitSound = p.loadSound('https://cdn.glitch.global/9df71f81-684c-4eec-b6fd-e1074f6828b8/536104__eminyildirim__sword-hit-heavy.wav?v=1669823017308');
      this.pianoNote = p.loadSound('https://cdn.glitch.global/9df71f81-684c-4eec-b6fd-e1074f6828b8/573512__gamedrix974__54.wav?v=1669823019716');
      this.bubblePopSound = p.loadSound(' https://cdn.glitch.global/9df71f81-684c-4eec-b6fd-e1074f6828b8/376968__elmasmalo1__bubble-pop.wav?v=1669823025748');
   
  },
  
  setup(p) {
    // Do any setup work here
    this.osc = new p5.Oscillator('sine');
    // this.osc.start()
    // this.osc.stop()
    this.color = [100, 100, 80]
    this.points = 10
  },
  
  onChangeLabel(hand, newLabel, oldLabel) {
   
    // An event happened!
    console.log(`Changed from ${oldLabel} to ${newLabel}` )
    
    // Lots of options
    // Change some state, play a sound,
    // change some value....
    
      // Make a theremin!
        //    if (newLabel === "🗡")
        //    this.osc.start()
        // if (newLabel === "🛡")
        //    this.osc.stop()
      
      // Play a sound
     //  if (newLabel === "🗡")
     //    this.swordHitSound.play()
     // else 
     //   this.bubblePopSound.play()
    
    //Play a pitch-shifted sound

//      if (newLabel === "👊"){
//       let pitch = (400 - hand.center[1])*.002 + 1
//        this.pianoNote.play()
//     this.pianoNote.rate(pitch)
//     }
    
    // Random color? 
        this.color = [360*Math.random(), 100, 50]
       this.points++
  
  },
 
    
    
  draw(p, hands, face) {
      p.background(240, 30, 60);

      p.noStroke();
      let t = p.millis()*.001;

      for (var j = 0; j < 5; j++) {
        p.fill(170 + j * 10, 70, 40, 0.3);
        p.beginShape();
        let y = 100;
        p.vertex(0, 0);
        p.vertex(0, 0);
        p.vertex(0, y);
        // Ripply vertices
        let waveCount = 10;
        for (var i = 0; i < waveCount; i++) {
          let x = (i + 0.5) * (p.width / waveCount);
          let y2 = y + 100 * p.noise(i, t + j * 10);
          p.curveVertex(x, y2);
        }
        p.vertex(p.width, y);
        p.vertex(p.width, 0);
        p.vertex(p.width, 0);
        p.endShape();}

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
    
    // Show text if you want!
    p.fill(0)
    p.text(this.points + " points", 350, 250);
  },

  track: "HAND",
  // Options: "HAND", "HANDS", "HANDS AND FACE", "FACE"
};
