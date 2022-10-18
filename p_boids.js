/* globals Vector2D, Particle, ParticleSystem, p */

/*
 * Basic particles with an attraction force
 */

class BoidSystem extends ParticleSystem {
  static label = "🐦"; // Ignore the Glitch parse error
  static desc = "Boids animation"; // Ignore the Glitch parse error

  constructor() {
    // Make what particle, and how many?
    // Try different numbers of particles
    super(BoidParticle, 40);

    this.flockCenter = new Vector2D();
    this.flockVelocity = new Vector2D();
  }

  beforeMove(p, dt) {
    // Calculate the flock's center and average direction
    // Reset both
    this.flockCenter.mult(0);
    this.flockVelocity.mult(0);

    // Add up the velocity and position
    this.particles.forEach((pt) => {
      this.flockCenter.add(pt.pos);
      this.flockVelocity.add(pt.v);
    });
    // Divide by the number of boids to get the
    // overall flock data
    this.flockVelocity.div(this.particles.length);
    this.flockCenter.div(this.particles.length);
  }

  mousePressed(p) {
    super.mousePressed(p);
    if (!this.held) {
      let pt = new BoidParticle(this);
      pt.pos.setTo(p.mouseX, p.mouseY);
      this.particles.push(pt);
    }
  }

  draw(p) {
    // A little bit of trails!
    p.background(0, 0, 50, 0.5);

    p.noFill();
    p.stroke(100, 0, 100, 0.4);
    p.circle(...this.flockCenter, 100);

    // The "super-class" draws the particles
    super.draw(p);
  }
}

//=========================================================================
//=========================================================================
//=========================================================================

class BoidParticle extends Particle {
  constructor(ps, index) {
    // ps: the particle system this particle belongs to
    // index: of all the particles in that system, this one's index
    super(ps, index);

    this.draggable = true;

    this.pos.setToRandom(0, p.width, 0, p.height);
    this.radius = 10;
    this.angle = Math.random() * 100;
    this.v.setToPolar(10, this.angle);
    
    this.cohesionForce = new Vector2D()
    this.alignmentForce = new Vector2D()
    this.separationForce = new Vector2D()
  }

  calculateForces(p, dt) {
    this.angle = this.v.angle;
    let center = new Vector2D(p.width / 2, p.height / 2);
    
    
    // Add a border force
    this.f.add(
      this.pos.getForceTowardsPoint(center, 1, {
        startRadius: 140,
        falloff: 1.2,
      })
    );

    // Add boids force
    
    // Cohesion
    // Move toward center
    this.cohesionForce = this.pos.getForceTowardsPoint(this.ps.flockCenter, 1)
     
    // Separation
    // Push away from all other boids
    this.separationForce.mult(0)
    this.ps.particles.forEach(pt => {
      // Ignore any force on myself
      if (pt !== this) {
        this.separationForce.add(
          this.pos.getForceTowardsPoint(pt.pos, -2, {startRadius: 10})
        )
      }
    })
    
    // Alignment
     this.alignmentForce = Vector2D.sub(this.ps.flockVelocity, this.v)
    
    // Apply "drag"
    this.v.constrainMagnitude(10, 100)
    
    // this.separationForce.mult(.5)
    // this.cohesionForce.mult(.5)
    
    // this.f.add(this.separationForce )
    this.f.add(this.cohesionForce )
    
    // this.debugText = this.cohesionForce.toString()
  }

  // Wrap boids around the screen
  // Can affect flocking moves
  // move(p, dt) {
  //   super.move(p, dt)
  //    this.pos.wrapX(0, p.width);
  //   this.pos.wrapY(0, p.height);
  // }

  draw(p, drawDebug = false) {
    let t = p.millis() * 0.001;

    p.noStroke();
    p.fill(100);
    p.push();
    p.translate(...this.pos);
    p.rotate(this.angle);

    p.beginShape();
    p.vertex(this.radius, 0);
    p.vertex(-this.radius, -this.radius);
    p.vertex(0, 0);
    p.vertex(-this.radius, this.radius);

    p.endShape();

    p.pop();

    if (drawDebug) {
      p.fill(0)
      p.text(this.debugText, ...this.pos)
       this.pos.drawArrow(p, this.separationForce, { m: .2, color: [30, 100, 50] });
      this.pos.drawArrow(p, this.cohesionForce, { m: .2, color: [60, 100, 50] });
      this.pos.drawArrow(p, this.alignmentForce, { m: .2, color: [160, 100, 50] });
     
    }
  }
}