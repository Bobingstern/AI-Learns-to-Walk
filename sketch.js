//this is a template to add a NEAT ai to any game
//note //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
//this means that there is some information specific to the game to input here
var b2Vec2 = Box2D.Common.Math.b2Vec2,
  b2AABB = Box2D.Collision.b2AABB,
  b2BodyDef = Box2D.Dynamics.b2BodyDef,
  b2Body = Box2D.Dynamics.b2Body,
  b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
  b2Fixture = Box2D.Dynamics.b2Fixture,
  b2World = Box2D.Dynamics.b2World,
  b2MassData = Box2D.Collision.Shapes.b2MassData,
  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
  b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
  b2Shape = Box2D.Collision.Shapes.b2Shape,
  b2Joint = Box2D.Dynamics.Joints.b2Joint,
  b2Settings = Box2D.Common.b2Settings,
  b2FilterData = Box2D.Dynamics.b2FilterData;
b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint;
b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;;


var nextConnectionNo = 1000;
var population;
var speed = 60;


var showBest = false; //true if only show the best of the previous generation
var runBest = false; //true if replaying the best ever game
var humanPlaying = false; //true if the user is playing

var humanPlayer;


var showBrain = true;
var showBestEachGen = false;
var upToGen = 0;
var genPlayerTemp; //player

var showNothing = false;


//----------------------Box2d shit


var ground
var SCALE = 30
var world
var playerIndex = 1;
var offset




//--------------------------------------------------------------------------------------------------------------------------------------------------

function setupPhysics() {
  var world = new b2World(new b2Vec2(0, 50))

  //----Ground
  var fixDef = new b2FixtureDef();
  fixDef.density = 1;
  fixDef.friction = 0.5

  var bodyDef = new b2BodyDef()
  bodyDef.type = b2Body.b2_staticBody
  bodyDef.position.x = width / SCALE
  bodyDef.position.y = height / SCALE

  fixDef.shape = new b2PolygonShape()
  fixDef.shape.SetAsBox(width / SCALE, 50 / SCALE)

  //world.CreateBody(bodyDef).CreateFixture(fixDef)

  //Debug DRaw
  var debugDraw = new b2DebugDraw()
  debugDraw.SetSprite(drawingContext)
  debugDraw.SetDrawScale(SCALE)
  debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit)
  world.SetDebugDraw(debugDraw)

  return world

}



function makeBox(world, bodyType, x, y, w, h, density, friction, res, mass, isSens) {
  var fixDef = new b2FixtureDef();
  fixDef.density = density;
  fixDef.friction = friction
  fixDef.restitution = res
  fixDef.isSensor = isSens
  //fixDef.mass = mass

  var bodyDef = new b2BodyDef()
  bodyDef.type = bodyType
  bodyDef.position.x = x / SCALE
  bodyDef.position.y = y / SCALE


  fixDef.shape = new b2PolygonShape()
  fixDef.shape.SetAsBox(w / SCALE, h / SCALE)


  var body = world.CreateBody(bodyDef)
  body.CreateFixture(fixDef)

  return body
}


function mouseClicked() {
  //makeBox(b2Body.b2_dynamicBody, mouseX, mouseY, 50, 50, 0.5, 1, 0.3)
}
var img

function preload(){

  img = loadImage('https://raw.githubusercontent.com/Bobingstern/AI-Learns-to-Walk/gh-pages/boi.png');


}

var best
var running = false;
let start
let popSize = 100
let started = false

let increase
let decrease
function setup() {
  window.canvas = createCanvas(1280, 720);
  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
  frameRate(30)
  img.resize(40, 40)

  offset = createVector(0, 0)

  start = createButton('Start');
  start.size(100, 50)
  start.position(19, 19);
  start.mousePressed(START);

  increase = createButton("Population+")
  increase.size(100, 50)
  increase.position(19, 69);
  increase.mousePressed(function(){popSize+=10});

  decrease = createButton("Population-")
  decrease.size(100, 50)
  decrease.position(19, 119);
  decrease.mousePressed(function(){popSize-=10});

}

function START(){
  running = true
}

function getBest(){
  let best_player = null
  let best_fitness = 0
  for (var i=0;i<population.players.length;i++){
    if (population.players[i].score > best_fitness && !(population.players[i].dead)) {
      best_fitness = population.players[i].score
      best_player = population.players[i]
    }
  }
  return best_player
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
function draw() {


  background(100)
  if (running){
    if (started == false){
      population = new Population(popSize);
      humanPlayer = new Player();
      started = true
      decrease.remove()
      increase.remove()
      start.remove()
    }

    drawToScreen();
    offset.x = offset.x-1




    push()

    fill(255, 0, 0)
    translate(population.players[0].lazer.x+offset.x, population.players[0].lazer.y)
    rect(0, 0, 10, height)
    pop()


    if (showBestEachGen) { //show the best of each gen
      showBestPlayersForEachGeneration();
    } else if (humanPlaying) { //if the user is controling the ship[
      showHumanPlaying();
    } else if (runBest) { // if replaying the best ever game
      showBestEverPlayer();
    } else { //if just evolving normally
      if (!population.done()) { //if any players are alive then update them
        population.updateAlive();
      } else { //all dead
        //genetic algorithm
        //playerIndex = 1
        offset.x = 0
        population.naturalSelection();
      }
    }


    let bestPlayer = getBest()
    if (!(bestPlayer == null)) {
      push()
      let easing = 0.05;
      let targetX = -1*bestPlayer.body.GetPosition().x*SCALE+200;
      let dx = targetX - offset.x;
      offset.x += dx * easing;


      translate(offset.x, 0)
      fill(0, 0, 0)
      for (var i=0;i<100;i++){
        //text(i*10, i*300, 100)
        rect(i*300, height-20, 10, 20)
      }
      pop()
    }
  }
  else{
    textSize(50)
    text("Population Size: "+popSize, 600, 100)
  }
}
//-----------------------------------------------------------------------------------
function showBestPlayersForEachGeneration() {
  if (!genPlayerTemp.dead) { //if current gen player is not dead then update it

    genPlayerTemp.look();
    genPlayerTemp.think();
    genPlayerTemp.update();
    genPlayerTemp.show();
  } else { //if dead move on to the next generation
    upToGen++;
    if (upToGen >= population.genPlayers.length) { //if at the end then return to the start and stop doing it
      upToGen = 0;
      showBestEachGen = false;
    } else { //if not at the end then get the next generation
      genPlayerTemp = population.genPlayers[upToGen].cloneForReplay();
    }
  }
}
//-----------------------------------------------------------------------------------
function showHumanPlaying() {
  if (!humanPlayer.dead) { //if the player isnt dead then move and show the player based on input
    humanPlayer.look();
    humanPlayer.update();
    humanPlayer.show();
  } else { //once done return to ai
    humanPlaying = false;
  }
}
//-----------------------------------------------------------------------------------
function showBestEverPlayer() {
  if (!population.bestPlayer.dead) { //if best player is not dead
    population.bestPlayer.look();
    population.bestPlayer.think();
    population.bestPlayer.update();
    population.bestPlayer.show();
  } else { //once dead
    runBest = false; //stop replaying it
    population.bestPlayer = population.bestPlayer.cloneForReplay(); //reset the best player so it can play again
  }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------
//draws the display screen
function drawToScreen() {
  if (!showNothing) {
    //pretty stuff
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    drawBrain();
    writeInfo();
  }
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function drawBrain() { //show the brain of whatever genome is currently showing
  var startX = 10; //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
  var startY = 10;
  var w = 200;
  var h = 400;

  if (runBest) {
    population.bestPlayer.brain.drawGenome(startX, startY, w, h);
  } else
  if (humanPlaying) {
    showBrain = false;
  } else if (showBestEachGen) {
    genPlayerTemp.brain.drawGenome(startX, startY, w, h);
  } else {
    population.players[0].brain.drawGenome(startX, startY, w, h);
  }
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//writes info about the current player
function writeInfo() {
  fill(200);
  textAlign(LEFT);
  textSize(30);
  if (showBestEachGen) {
    text("Score: " + genPlayerTemp.score, 650, 50); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    text("Gen: " + (genPlayerTemp.gen + 1), 1150, 50);
  } else
  if (humanPlaying) {
    text("Score: " + humanPlayer.score, 650, 50); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
  } else
  if (runBest) {
    text("Score: " + population.bestPlayer.score, 650, 50); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    text("Gen: " + population.gen, 1150, 50);
  } else {
    if (showBest) {
      text("Score: " + population.players[0].score, 650, 50); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
      text("Gen: " + population.gen, 1150, 50);
      text("Species: " + population.species.length, 50, canvas.height / 2 + 300);
      text("Global Best Score: " + population.bestScore, 50, canvas.height / 2 + 200);
    }
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------------

function keyPressed() {
  switch (key) {
    case ' ':
      //toggle showBest
      showBest = !showBest;
      break;
      // case '+': //speed up frame rate
      //   speed += 10;
      //   frameRate(speed);
      //   prvarln(speed);
      //   break;
      // case '-': //slow down frame rate
      //   if(speed > 10) {
      //     speed -= 10;
      //     frameRate(speed);
      //     prvarln(speed);
      //   }
      //   break;
    case 'B': //run the best
      runBest = !runBest;
      break;
    case 'G': //show generations
      showBestEachGen = !showBestEachGen;
      upToGen = 0;
      genPlayerTemp = population.genPlayers[upToGen].clone();
      break;


  }
  //any of the arrow keys
  switch (keyCode) {
    case UP_ARROW: //the only time up/ down / left is used is to control the player
      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
      break;
    case DOWN_ARROW:
      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
      break;
    case LEFT_ARROW:
      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
      break;
    case RIGHT_ARROW: //right is used to move through the generations

      if (showBestEachGen) { //if showing the best player each generation then move on to the next generation
        upToGen++;
        if (upToGen >= population.genPlayers.length) { //if reached the current generation then exit out of the showing generations mode
          showBestEachGen = false;
        } else {
          genPlayerTemp = population.genPlayers[upToGen].cloneForReplay();
        }
      } else if (humanPlaying) { //if the user is playing then move player right

        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
      }
      break;
  }
}
