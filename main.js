let bodies;
let wallsEnabled = false;

function toggleWalls() { 
    wallsEnabled = !wallsEnabled; // Switches wallsEnabled to what it isn't 
}

function setup() {
    let canvas = createCanvas(1100, 770); // 800, 770
    canvas.parent('sketch-holder');
    frameRate(60);

    let xPosition = 320; // Adjust this value to move the canvas more to the right
    canvas.position(xPosition, 0);

    noLoop();  // Don't start the simulation until user inputs velocities
}

function draw() {
    background(80, 78, 81);

    for (let body of bodies) {
        body.update(bodies);
        body.display();
    }
}

function startSimulation() {
    let body1x = parseFloat(document.getElementById('body1x').value);
    let body1y = parseFloat(document.getElementById('body1y').value);
    let body2x = parseFloat(document.getElementById('body2x').value);
    let body2y = parseFloat(document.getElementById('body2y').value);
    let body3x = parseFloat(document.getElementById('body3x').value);
    let body3y = parseFloat(document.getElementById('body3y').value);

    bodies = [
        new Body(-0.5 * AU, -0.1 * AU, 16, color(100, 149, 237), 5.2742 * 10**24, body1x, body1y),
        new Body(0.5 * AU, -0.1 * AU, 16, color(188, 39, 50), 5.2742 * 10**24, body2x, body2y),
        new Body(0,  0.5 * AU, 16, color(70, 227, 107), 5.2742 * 10**24, body3x, body3y)
    ];

    loop();  // Start the simulation
}

function stopSimulation() {
    let body1x = 0;
    let body1y = 0;
    let body2x = 0;
    let body2y = 0;
    let body3x = 0;
    let body3y = 0;

    for (let body of bodies) {
        body.orbit = [];
    }
    
    resetObjects();     
    noLoop(); // Stop the simulation
}

function resetObjects() {
    // Reset object positions and velocities here
    bodies[0].pos = createVector(-0.5 * AU, -0.1 * AU);
    bodies[0].vel = createVector(parseFloat(document.getElementById('body1x').value), parseFloat(document.getElementById('body1y').value));

    bodies[1].pos = createVector(0.5 * AU, -0.1 * AU);
    bodies[1].vel = createVector(parseFloat(document.getElementById('body2x').value), parseFloat(document.getElementById('body2y').value));

    bodies[2].pos = createVector(0, 0.5 * AU);
    bodies[2].vel = createVector(parseFloat(document.getElementById('body3x').value), parseFloat(document.getElementById('body3y').value));
}

function twoBodySim() {
    document.getElementById('body1x').value = 5000;
    document.getElementById('body1y').value = 0;
    document.getElementById('body2x').value = 300000;
    document.getElementById('body2y').value = 0;
    document.getElementById('body3x').value = -5000;
    document.getElementById('body3y').value = 0;
}

function threeBodySim() {
    document.getElementById('body1x').value = 5000;
    document.getElementById('body1y').value = -4000;
    document.getElementById('body2x').value = 2498;
    document.getElementById('body2y').value = 5500;
    document.getElementById('body3x').value = -4500;
    document.getElementById('body3y').value = 2000;
}

function clearFields() {
    document.getElementById('body1x').value = '';
    document.getElementById('body1y').value = '';
    document.getElementById('body2x').value = '';
    document.getElementById('body2y').value = '';
    document.getElementById('body3x').value = '';
    document.getElementById('body3y').value = '';
}


const AU = 149.6e6 * 1000;
const G = 9.67428e-7;
const TIMESTEP = 6600 * 24;

class Body {
    constructor(x, y, r, c, mass, x_vel, y_vel) {
        this.pos = createVector(x, y);
        this.r = r;
        this.c = c;
        this.mass = mass;
        this.vel = createVector(x_vel, y_vel);
        this.orbit = [];
    }

    display() {
        fill(this.c);
        let x = map(this.pos.x, -AU, AU, 0, width);
        let y = map(this.pos.y, -AU, AU, height, 0);
        ellipse(x, y, this.r * 2, this.r * 2);

        // Draw orbit path
        stroke(this.c);
        noFill();
        beginShape();
        for (let v of this.orbit) {
            let px = map(v.x, -AU, AU, 0, width);
            let py = map(v.y, -AU, AU, height, 0);
            vertex(px, py);
        }
        endShape();
    }   

    update(bodies) {
        let totalForce = createVector(0, 0);
        for (let other of bodies) {
            if (this !== other) {
                let force = this.calculateGravitationalForce(other);
                totalForce.add(force);
            }
        }

        let acceleration = totalForce.div(this.mass);
        this.vel.add(acceleration.mult(TIMESTEP));
        this.pos.add(this.vel.copy().mult(TIMESTEP));
        this.orbit.push(this.pos.copy());

        

        if (this.orbit.length > 500) {
            this.orbit.splice(0, 1);
        }
    }

    calculateGravitationalForce(other) {
        let direction = p5.Vector.sub(other.pos, this.pos);
        let distanceSq = direction.magSq();
        let forceMagnitude = (G * this.mass * other.mass) / distanceSq;
        return direction.setMag(forceMagnitude);
    }
}
