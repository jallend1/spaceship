const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const SPACESHIP_SIZE = { width: 40, height: 60 };
const SPACESHIP_POSITION = { x: 200, y: 200 };

const THRUST = 5;

class Spaceship {
    constructor(size, position){
        this.color = 'blue';
        this.size = size;
        this.position = position;
        this.angle = 0;
        this.engineOn = false;
        this.rotatingLeft = false;
        this.rotatingRight = false;
        this.velocity = { x: 0, y: 0 };
    }

    draw(){
        // Determines the center of the ship
        const triangleCenterX = this.position.x + 0.5 * this.size.width;
        const triangleCenterY = this.position.y + 0.5 * this.size.height;

        ctx.save();
        ctx.translate(triangleCenterX, triangleCenterY);
        ctx.rotate(this.angle);
        ctx.lineWidth = 1;
        
        // Make the Ship
        ctx.beginPath();
        ctx.moveTo(0, -this.size.height / 2);
        ctx.lineTo(-this.size.width / 2, this.size.height / 2);
        ctx.lineTo(this.size.width / 2, this.size.height / 2);
        ctx.closePath();
        ctx.strokeStyle = this.color;
        ctx.stroke();

        // Thrusters
        if(this.engineOn){
            const fireYPos = this.size.height / 2 + 5;
            const fireXPos = this.size.width * 0.25;
            ctx.beginPath();
            ctx.moveTo(-fireXPos, fireYPos);
            ctx.lineTo(fireXPos, fireYPos);
            ctx.lineTo(0, fireYPos + Math.random() * 50);
            ctx.lineTo(-fireXPos, fireYPos);
            ctx.closePath();
            ctx.fillStyle = 'orange';
            ctx.fill();
        }
        ctx.restore();
    }

    moveSpaceShip(){
        const degToRad = Math.PI / 180;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // Move to other side 
        this.position.x = (canvas.width + this.position.x) % canvas.width;
        this.position.y = (canvas.height + this.position.y) % canvas.height;

        if(this.rotatingLeft) this.angle -= degToRad;
        if(this.rotatingRight) this.angle += degToRad;
        if(this.engineOn){
            this.velocity.x += (THRUST / 100) * Math.sin(this.angle);
            this.velocity.y -= (THRUST / 100) * Math.cos(this.angle);
        }
    }
}

const spaceShip = new Spaceship(SPACESHIP_SIZE, SPACESHIP_POSITION);

function handleKeyInput(e){
    const { keyCode, type } = e;
    const isKeyDown = type === 'keydown';
    if(keyCode === 37) spaceShip.rotatingLeft = isKeyDown;
    if(keyCode === 39) spaceShip.rotatingRight = isKeyDown;
    if(keyCode === 38) spaceShip.engineOn = isKeyDown;
}

function draw(){
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    spaceShip.moveSpaceShip();
    spaceShip.draw();
    requestAnimationFrame(draw);
}

document.addEventListener('keydown', handleKeyInput);
document.addEventListener('keyup', handleKeyInput);
draw();