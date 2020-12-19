var Trex, TrexAnimate, Edges, Ground, invisibleGround;
var Obsatcle1, Obstacle2, Obstacle3, Obstacle4, Obstacle5, Obstacle6;    
var Score, cloudGroup, Cloud;
var obstacleGroup;
var gameState, play, end;
var restart, gameOver;
var jump, check, die;

function preload(){
  
  TrexAnimate = loadAnimation("trex1.png","trex3.png","trex4.png");  
  GroundAnimate = loadImage("ground2.png");
  CloudAnimate = loadImage("cloud.png");
  Obstacle1 = loadImage("obstacle1.png");
  Obstacle2 = loadImage("obstacle2.png");
  Obstacle3 = loadImage("obstacle3.png");
  Obstacle4 = loadImage("obstacle4.png");
  Obstacle5 = loadImage("obstacle5.png");
  Obstacle6 = loadImage("obstacle6.png");
  gameOverAnimate = loadImage("gameOver.png");
  restartAnimate = loadImage("restart.png");
  TrexImage = loadImage("trex_collided.png");
  
  jump = loadSound("jump.mp3");
  check = loadSound("checkPoint.mp3");
  die = loadSound("die.mp3");
  
}

function setup() {

  createCanvas(600,200);
  
  //Trex
  Trex = createSprite(50,180,10,40);
  Trex.addAnimation("Running", TrexAnimate);
  Trex.addAnimation("trexcollide",TrexImage);
  Trex.scale = 0.5;
  
  //Groung
  Ground=createSprite(300,180,600,20);
  Ground.addImage("ground",GroundAnimate);
  Ground.x = Ground.width/2;

  
  //Invisible Ground
  invisibleGround = createSprite(300,190,600,10);
  invisibleGround.visible = false;
  
  //Group
  obstacleGroup = new Group();
  cloudGroup = new Group();
  
  //Game state
  play = 1;
  end = 2;
  gameState = play;
  
  //Collision Radius of Trex
  Trex.setCollider("circle",0,0,30);
  
  Edges = createEdgeSprites();
  
  //Score
  Score = 0;
  
  //Game Over
  gameOver = createSprite(300,50);
  gameOver.addImage("gameover",gameOverAnimate);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  //Restart
  restart = createSprite(300,100);
  restart.addImage("restartimg",restartAnimate);
  restart.scale  = 0.5;
  restart.visible = false;
}
      
function draw() {
  
  background("white");
  
  //Score
  textSize(18);
  text("Score: "+Score,450,25);
  
  if(gameState===play){
   
  //Trex movement
  if(keyDown("space") && Trex.y>161){
    Trex.velocityY = -13;
    jump.play();
  }
    
  //Adding gravity
  Trex.velocityY = Trex.velocityY+0.8;
    
  //Reseting the ground
  if(Ground.x<0){
    Ground.x = Ground.width/2; 
  }  
  
  //Move the ground
  Ground.velocityX = -(5+3*Score/100);
    
  //Scoring
  Score = Score + Math.round(World.frameRate/60);  
   
  //Spawn the clouds
  spawnClouds();
  
  //Spawn the obstacles
  spawnObstacles();
  
  //Game over and Restart
  gameOver.visible = false;
  restart.visible = false; 
    
  if(Score % 100===0 && Score>0){
    check.play();
  }  
    
  //If trex is touching obstacle
  if(obstacleGroup.isTouching(Trex)){
    gameState=end;
    die.play();  
  }
  }
  
  else if(gameState===end){
      
    //Stoping sprites
    Ground.velocityX = 0;
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    Trex.velocityY = 0;
    
    //Animations to be displayed
    gameOver.visible = true;
    restart.visible = true;
    Trex.changeAnimation("trexcollide",TrexImage);
    
    //Setting lifetime for the objects so that they are never destroyed
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    
    //Restarting the game
    if(mousePressedOver(restart)){
      reset();
    }
    
    }
  
  Trex.collide(invisibleGround);

  drawSprites();
}

function spawnClouds(){
  if(World.frameCount % 60===0){
    var Cloud = createSprite(600,160,40,10);
    Cloud.y = random(90,130);
    Cloud.addImage("spawnClouds", CloudAnimate);
    Cloud.scale = 0.5;
    Cloud.velocityX = -3;
    
    //Assigning lifetime to the cloud
    Cloud.lifetime = 205;
    
    //Add depth
    Cloud.depth = Trex.depth;
    Trex.depth = Trex.depth + 1;
    
    cloudGroup.add(Cloud);
  }
}

function spawnObstacles(){
  if(World.frameCount % 60 ===0){
    var obstacle = createSprite(600,160,10,40);
    obstacle.scale = 0.5;
    obstacle.velocityX = -(5+3*Score/100);
    obstacleGroup.add(obstacle)
    var rand = Math.round(random(1,6));
    obstacle.lifetime = 200;
    
    switch(rand){
      case 1: obstacle.addImage("Ob1", Obstacle1);
      break;
      case 2: obstacle.addImage("Ob2",Obstacle2);
      break;
      case 3: obstacle.addImage("Ob3",Obstacle3);
      break;
      case 4: obstacle.addImage("Ob4",Obstacle4);
      break;
      case 5: obstacle.addImage("Ob5",Obstacle5);
      break;
      case 6: obstacle.addImage("Ob6",Obstacle6);
      break;
      default:break;
    }
  }
}

function reset(){
  gameState = play;
  Score = 0;
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  Trex.changeAnimation("Running",TrexAnimate);
}