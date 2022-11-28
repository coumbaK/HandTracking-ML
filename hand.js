class Hand {
  constructor() {
    this.points = [];
    for (var i = 0; i < 21; i++) {
      this.points[i] = new Vector2D(Math.random() * 400, Math.random() * 300);
    }
  }
  
  toRecord() {
    return this.points.map(pt => pt.slice(0,2))
  }
  
  fromRecord(record) {
    return this.points.forEach((pt => )
  }
  
  draw(p) {
    this.points.forEach((pt) => p.circle(...pt, 20));
  }

 
  setTo(predictedPts, settings) {
    if (predictedPts === undefined) {
      // No hand data
      this.isActive = false
    } else {
      this.isActive = true
      this.points.forEach((pt, index) => {
        let pt1 = predictedPts[index];
        if (settings.setPoint) {
          settings.setPoint(pt, pt1);
        }
      });
    }
  }
}
