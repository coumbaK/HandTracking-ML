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
  
  update(data) {
    if (data) {
    this.points.forEach((pt,index) => {
      // console.log(data.landmarks[index])
      pt.setTo(data.landmarks[index])
    })
    } else {
      console.warn("No data for handtracking")
    }
  }
}