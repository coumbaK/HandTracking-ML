class Hand {
  constructor() {
    this.points = []
    for (var i = 0; i < 21; i++) {
      this.points[i] = new Vector2D(Math.random()*400, Math.random()*300)
      
    }
  }
  
  draw(p) {
    this.points.forEach(pt => p.circle(...pt, 20))
    
  }
  
  setTo(dataPoints) {
    if (dataPoints)
    this.points.forEach((pt, index) => {
      let pt2 = dataPoints[index];
      // console.log(data.landmarks[index])
      pt.setTo(pt2.x, pt2.y);
    })
  
  }
}