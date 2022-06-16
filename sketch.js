let asteroids = [];
let asteroidcounter=0;

let bullets = [];
let bulletcounter=0;
let shootFrame=0;

class asteroid {
  
  constructor(x, y, vX, vY, size) {
    this.x=x;
    this.y=y;
    this.velocityX=vX;
    this.velocityY=vY;
    this.size=size;
  }
  
  show(){
    stroke(0);
    strokeWeight(1);
    fill(71, 74, 81);
    circle(this.x, this.y, this.size);
  }
  
  move(){
    this.x=(this.x+this.velocityX)%width;
    this.y=(this.y+this.velocityY)%height;
    if(this.x<0){
      this.x=width;
    }
    if(this.y<0){
      this.y=height;
    }
  }
};


class bullet {
  constructor(x, y, vX, vY) {
    this.x=x;
    this.y=y;
    this.velocityX=vX;
    this.velocityY=vY;
  }
  
  show(){
    stroke(255);
    strokeWeight(2);
    point(this.x, this.y);
  }
  
  move(){
    this.x=this.x+this.velocityX;
    this.y=this.y+this.velocityY; 
  }
};

class ship {
  constructor (x, y, vX, vY, d){
    this.x=x;
    this.y=y;
    this.velocityX=vX;
    this.velocityY=vY;
    this.direction=d;
  }; 
  
  show(){
    noStroke();
    fill(255);
    triangle(this.x+17*cos(this.direction), this.y-17*sin(this.direction),
             this.x+10*cos(this.direction+2*PI/3), this.y-10*sin(this.direction+2*PI/3),
             this.x+10*cos(this.direction+4*PI/3), this.y-10*sin(this.direction+4*PI/3));
    //noFill();
    //stroke(255,0,0);
    //circle(this.x, this.y, 16);
  }
  
  move(){
    this.x=(this.x+this.velocityX)%width;
    this.y=(this.y+this.velocityY)%height;
    if(this.x<0){
      this.x=width;
    }
    if(this.y<0){
      this.y=height;
    }
    this.velocityX=this.velocityX-0.006*this.velocityX;
    this.velocityY=this.velocityY-0.006*this.velocityY;
  }
  
  rotate(){
    if (keyIsDown(LEFT_ARROW)) { 
      this.direction=this.direction+0.12; 
    }
    if (keyIsDown(RIGHT_ARROW)) { 
      this.direction=this.direction-0.12; 
    } 
  }
  
  shoot(){
    if(keyIsDown(32) && (frameCount-shootFrame)>15){
      bullets[bulletcounter] = new bullet(this.x, this.y,
                                          this.velocityX+7*cos(this.direction),
                                          this.velocityY-7*sin(this.direction));
      bulletcounter=(bulletcounter+1)%200;
      shootFrame=frameCount;
    }
  }
  
  boost(){
    if (keyIsDown(UP_ARROW)) { 
      this.velocityX=this.velocityX+0.065*cos(this.direction); 
      this.velocityY=this.velocityY-0.065*sin(this.direction); 
      
      noStroke();
      fill(225, 102, 0);
      triangle(this.x-17*cos(this.direction), this.y+17*sin(this.direction),
               this.x+10*cos(this.direction+2*PI/3)+3*sin(this.direction), 
               this.y-10*sin(this.direction+2*PI/3)+3*cos(this.direction),
               this.x+10*cos(this.direction+4*PI/3)-3*sin(this.direction),
               this.y-10*sin(this.direction+4*PI/3)-3*cos(this.direction));
    }
  }
}

let Ship = new ship(300, 300, 0, 0, 3.1415/2);
let level = 0;
let score = 0;
let lives = 3;
let gameOver = false;

function asteroidBulletHit(asteroid, bullet){
  if(dist(asteroid.x, asteroid.y, bullet.x, bullet.y)<(asteroid.size/2)){
    return true;
  }else{
    return false;
  }
}

function shipCrashed(ship, asteroid){
  let triangleVector=[];
  triangleVector[0]=createVector(ship.x+17*cos(ship.direction), ship.y-17*sin(ship.direction));
  triangleVector[1]=createVector(ship.x+10*cos(ship.direction+2*PI/3), ship.y-10*sin(ship.direction+2*PI/3));
  triangleVector[2]=createVector(ship.x+10*cos(ship.direction+4*PI/3), ship.y-10*sin(ship.direction+4*PI/3));
  if(collideCirclePoly(asteroid.x, asteroid.y, asteroid.size, triangleVector)){
    return true;
  }else{
    return false;
  }
}

function resetGame(){
  Ship.x=300;
  Ship.y=300;
  Ship.velocityX=0;
  Ship.velocityY=0;
  Ship.direction=3.1415/2;
  level = 0;
  score = 0;
  lives = 3;
  gameOver = false;
  if(asteroids.length>4){
    for(let k=asteroids.length-1; k>=4; k--){
      asteroids.splice(k, 1);
    }
  }
  for(let i=0; i<4; i++){
    let positionX=random(0, 480);
    let positionY=random(0, 480);
    if(positionX>Ship.x-60){
      positionX=positionX+120;
    }
    if(positionY>Ship.y-60){
      positionY=positionY+120;
    }
    asteroids[i] = new asteroid(positionX, positionY, 
                                random(-1.5,1.5), random(-1.5, 1.5) , 80);
  }
}

function setup() {
  createCanvas(600, 600);
  
  resetGame();
  
  textSize(40);
  textAlign(CENTER, CENTER);
}


function draw() {
  background(24, 33, 65);
  
  if(asteroids.length==0){
    for(let i=0; i<4+level; i++){
      let positionX=random(0, 480);
      let positionY=random(0, 480);
      if(positionX>Ship.x-60){
        positionX=positionX+120;
      }
      if(positionY>Ship.y-60){
        positionY=positionY+120;
      }
      asteroids[i] = new asteroid(positionX, positionY, 
                                  random(-1.5,1.5), random(-1.5, 1.5) , 80);
    }
    level++;
  }
  Ship.move();
  Ship.show();
  Ship.rotate();
  Ship.shoot();
  if(bullets.length>0){
    for(let j=0; j<bullets.length; j++){
      bullets[j].show();
      bullets[j].move();
    }
  }  
  Ship.boost();
  if(asteroids.length>0){
    for(let k=0; k<asteroids.length; k++){
      asteroids[k].show();
      asteroids[k].move();
    }
  }
  
  if(asteroids.length>0){
    for(let k=asteroids.length-1; k>=0; k--){
      if(shipCrashed(Ship, asteroids[k])){
        if(lives==1){
          gameOver = true;
          textSize(40);
          textAlign(CENTER);
          noLoop();
          fill(255, 0, 0);
          text('GAME OVER', 300, 250);
          fill(0,255,0)
          text('Score: '+ score, 300, 300);
          fill(255, 204, 0);
          textSize(25);
          text('New Game', 300, 400);
          //noFill();
          //stroke(255,0,0);
          //rect(235, 385, 130,25);
        }else{
          lives--;
          noLoop(); 
          Ship.x=300;
          Ship.y=300;
          Ship.velocityX=0;
          Ship.velocityY=0;
          Ship.direction=3.1415/2;
          setTimeout(function(){loop();}, 1000)
        }
      }
    }
  }
  
  if(asteroids.length>0 && bullets.length>0){
    for(let i=asteroids.length-1; i>=0; i--){
      for(let j=bullets.length-1; j>=0; j--){
        if(asteroidBulletHit(asteroids[i], bullets[j])){
          score=score+20;
          bullets[j].velocityX=0;
          bullets[j].velocityY=0;
          bullets[j].x=-1;
          bullets[j].y=-1;
          if(asteroids[i].size==20){
            asteroids.splice(i, 1);
          }else{
            let asteroidDirection = atan(asteroids[i].velocityY/asteroids[i].velocityX);
            if(asteroids[i].velocityX<0){
              asteroidDirection=asteroidDirection+PI;
            }
            let asteroidV=sqrt((asteroids[i].velocityX)*(asteroids[i].velocityX)+
                               (asteroids[i].velocityY)*(asteroids[i].velocityY));
            asteroids.push(new asteroid(asteroids[i].x, asteroids[i].y,
                                        1.3*asteroidV*cos(PI/8+asteroidDirection),
                                        1.3*asteroidV*sin(PI/8+asteroidDirection),
                                        asteroids[i].size/2));
            asteroids[i].size=asteroids[i].size/2;
            asteroids[i].velocityX=1.3*asteroidV*cos(asteroidDirection-PI/8);
            asteroids[i].velocityY=1.3*asteroidV*sin(asteroidDirection-PI/8);
          }
          
          break;
        }
      }
    }
  }
  fill(255, 204, 0);
  textSize(15);
  textAlign(LEFT);
  noStroke();
  text('Score: '+score, 10, 20);
  
  for(let i=0;i<lives; i++){
    noStroke();
    fill(255, 150);
    triangle(18+25*i+16*cos(PI/2), 50-16*sin(PI/2),
             18+25*i+9*cos(7*PI/6), 50-9*sin(7*PI/6),
             18+25*i+9*cos(11*PI/6), 50-9*sin(11*PI/6));
  }
}

function mousePressed(){
  if(gameOver==true && mouseX>235 && mouseX<365 && mouseY>385 && mouseY<410){
    resetGame();
    loop();
  }
}
