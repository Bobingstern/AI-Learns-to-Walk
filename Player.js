class Player {

  constructor() {

    this.fitness = 0;
    this.vision = []; //the input array fed into the neuralNet
    this.decision = []; //the out put of the NN
    this.unadjustedFitness;
    this.lifespan = 0; //how long the player lived for this.fitness
    this.bestScore = 0; //stores the this.score achieved used for replay
    this.dead = false;
    this.score = 0;
    this.gen = 0;

    this.genomeInputs = 20;
    this.genomeOutputs = 4;
    this.brain = new Genome(this.genomeInputs, this.genomeOutputs);
    this.colGroup = playerIndex
    this.world = new b2World(new b2Vec2(0, 50))
    this.offsetX = 450

    //-------Bodies
    this.body = makeBox(this.world, b2Body.b2_dynamicBody, 100, 100 + this.offsetX, 50, 50 /**/ , 1, 10, 0.1, 10)
    this.bodyWidth = 50
    this.bodyHeight = 50
    this.body.SetUserData("body")

    this.head = makeBox(this.world, b2Body.b2_dynamicBody, 100, 5 + this.offsetX, 20, 20 /**/ , 1, 10, 0.1, 10)
    this.headWidth = 20
    this.headHeight = 20
    this.head.SetUserData("body")


    this.leg = makeBox(this.world, b2Body.b2_dynamicBody, 75, 150 + this.offsetX, 11, 25 /**/ , 1, 10, 0.1, 10)
    this.legWidth = 11
    this.legHeight = 25
    this.leg.SetUserData("body")


    this.leg2 = makeBox(this.world, b2Body.b2_dynamicBody, 125, 150 + this.offsetX, 11, 25 /**/ , 1, 10, 0.1, 10)
    this.leg2Width = 11
    this.leg2Height = 25
    this.leg2.SetUserData("body")


    this.knee = makeBox(this.world, b2Body.b2_dynamicBody, 75, 200 + this.offsetX, 11, 25 /**/ , 1, 10, 0.1, 10)
    this.kneeWidth = 11
    this.kneeHeight = 25


    this.knee2 = makeBox(this.world, b2Body.b2_dynamicBody, 125, 200 + this.offsetX, 11, 25 /**/ , 1, 10, 0.1, 10)
    this.knee2Width = 11
    this.knee2Height = 25



    this.ground = makeBox(this.world, b2Body.b2_staticBody, width / 2, height, width, 20 /**/ , 10000, 10000000, 0, 10000)

    this.groundWidth = width
    this.groundHeight = 20

    this.ground.SetUserData("ground")






    this.listener = new Box2D.Dynamics.b2ContactListener;
    this.listener.dead = false
    this.world.SetContactListener(this.listener);

    this.listener.BeginContact = function(contact) {

      // console.log(contact.GetFixtureA().GetBody().GetUserData());
      var fixA = contact.GetFixtureA().GetBody().GetUserData()
      var fixB = contact.GetFixtureB().GetBody().GetUserData()

      if (fixA == "ground" && fixB == "body" || fixA == "body" && fixB == "ground") {
        this.dead = true

      }


    }

    this.listener.EndContact = function(contact) {
      // console.log(contact.GetFixtureA().GetBody().GetUserData());
    }

    this.listener.PreSolve = function() {

    }



    this.lazer = createVector(-50, 0)
    //-------

    //-----Joints
    var leftLegBodyJointDef = new b2RevoluteJointDef()
    leftLegBodyJointDef.bodyA = this.body;
    leftLegBodyJointDef.bodyB = this.leg;
    leftLegBodyJointDef.collideConnected = false;
    leftLegBodyJointDef.localAnchorA.Set(-25 / SCALE, 50 / SCALE)
    leftLegBodyJointDef.localAnchorB.Set(0, -25 / SCALE)
    leftLegBodyJointDef.enableLimit = true
    leftLegBodyJointDef.lowerAngle = radians(-75)
    leftLegBodyJointDef.upperAngle = radians(75)

    this.leftLegBodyJoint = this.world.CreateJoint(leftLegBodyJointDef)



    var headDef = new b2RevoluteJointDef()
    headDef.bodyA = this.body;
    headDef.bodyB = this.head;
    headDef.collideConnected = false;
    headDef.localAnchorA.Set(0, -50 / SCALE)
    headDef.localAnchorB.Set(0, 20 / SCALE)
    headDef.enableLimit = true
    headDef.lowerAngle = radians(1)
    headDef.upperAngle = radians(1)


    this.headJoint = this.world.CreateJoint(headDef)


    var rightLegBodyJointDef = new b2RevoluteJointDef()
    rightLegBodyJointDef.bodyA = this.body;
    rightLegBodyJointDef.bodyB = this.leg2;
    rightLegBodyJointDef.collideConnected = false;
    rightLegBodyJointDef.localAnchorA.Set(25 / SCALE, 50 / SCALE)
    rightLegBodyJointDef.localAnchorB.Set(0, -25 / SCALE)
    rightLegBodyJointDef.enableLimit = true
    rightLegBodyJointDef.lowerAngle = radians(-75)
    rightLegBodyJointDef.upperAngle = radians(75)

    this.rightLegBodyJoint = this.world.CreateJoint(rightLegBodyJointDef)




    var leftKneeBodyJointDef = new b2RevoluteJointDef()
    leftKneeBodyJointDef.bodyA = this.leg;
    leftKneeBodyJointDef.bodyB = this.knee;
    leftKneeBodyJointDef.collideConnected = false;
    leftKneeBodyJointDef.localAnchorA.Set(0, 25 / SCALE)
    leftKneeBodyJointDef.localAnchorB.Set(0, -25 / SCALE)
    leftKneeBodyJointDef.enableLimit = true
    leftKneeBodyJointDef.lowerAngle = radians(-75)
    leftKneeBodyJointDef.upperAngle = radians(75)
    leftKneeBodyJointDef.enableMotor = true
    leftKneeBodyJointDef.maxMotorTorque = 100000
    //leftKneeBodyJointDef.motorSpeed = radians(500)


    this.leftKneeBodyJoint = this.world.CreateJoint(leftKneeBodyJointDef)


    var rightKneeBodyJointDef = new b2RevoluteJointDef()
    rightKneeBodyJointDef.bodyA = this.leg2;
    rightKneeBodyJointDef.bodyB = this.knee2;
    rightKneeBodyJointDef.collideConnected = false;
    rightKneeBodyJointDef.localAnchorA.Set(0, 25 / SCALE)
    rightKneeBodyJointDef.localAnchorB.Set(0, -25 / SCALE)
    rightKneeBodyJointDef.enableLimit = true
    rightKneeBodyJointDef.lowerAngle = radians(-75)
    rightKneeBodyJointDef.upperAngle = radians(75)

    this.rightKneeBodyJoint = this.world.CreateJoint(rightKneeBodyJointDef)

    //-------

    this.color = color(255, 255, 255)




    playerIndex++
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  show() {
    var pos = this.body.GetPosition()
    var angle = this.body.GetAngle()

    push()
    fill(this.color)
    translate(pos.x * SCALE, pos.y * SCALE)
    rotate(angle)
    rectMode(CENTER)
    rect(0, 0, this.bodyWidth * 2, this.bodyHeight * 2)
    pop()


    pos = this.ground.GetPosition()
    angle = this.ground.GetAngle()
    push()
    translate(pos.x * SCALE, pos.y * SCALE)
    rectMode(CENTER)
    rect(0, 0, this.groundWidth * 2, this.groundHeight * 2)
    pop()


    pos = this.head.GetPosition()
    angle = this.head.GetAngle()
    push()
    fill(this.color)
    translate(pos.x * SCALE, pos.y * SCALE)
    rotate(angle)
    rectMode(CENTER)
    rect(0, 0, this.headWidth * 2, this.headHeight * 2)
    pop()



    push()

    fill(255, 0, 0)
    rect(this.lazer.x, this.lazer.y, 10, height)
    pop()


    pos = this.leg.GetPosition()
    angle = this.leg.GetAngle()
    push()
    fill(this.color)
    translate(pos.x * SCALE, pos.y * SCALE)
    rotate(angle)
    rectMode(CENTER)
    rect(0, 0, this.legWidth * 2, this.legHeight * 2)
    pop()


    pos = this.leg2.GetPosition()
    angle = this.leg2.GetAngle()
    push()
    fill(this.color)
    translate(pos.x * SCALE, pos.y * SCALE)
    rotate(angle)
    rectMode(CENTER)
    rect(0, 0, this.leg2Width * 2, this.leg2Height * 2)
    pop()



    pos = this.knee.GetPosition()
    angle = this.knee.GetAngle()
    push()
    fill(this.color)
    translate(pos.x * SCALE, pos.y * SCALE)
    rotate(angle)
    rectMode(CENTER)
    rect(0, 0, this.kneeWidth * 2, this.kneeHeight * 2)
    pop()


    pos = this.knee2.GetPosition()
    angle = this.knee2.GetAngle()
    push()
    fill(this.color)
    translate(pos.x * SCALE, pos.y * SCALE)
    rotate(angle)
    rectMode(CENTER)
    rect(0, 0, this.knee2Width * 2, this.knee2Height * 2)
    pop()






  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  move() {
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  update() {
    this.lazer.x += 1


    if (!this.dead) {
      this.world.Step(1 / 30, 10, 10)



      if (this.decision[0] > 0.5) {
        this.rotateLeft(this.leftLegBodyJoint)
      } else {
        this.rotateRight(this.leftLegBodyJoint)
      }


      if (this.decision[1] > 0.5) {
        this.rotateLeft(this.rightLegBodyJoint)
      } else {
        this.rotateRight(this.rightLegBodyJoint)
      }


      if (this.decision[2] > 0.5) {
        this.rotateLeft(this.rightKneeBodyJoint)
      } else {
        this.rotateRight(this.rightKneeBodyJoint)
      }


      if (this.decision[3] > 0.5) {
        this.rotateLeft(this.leftKneeBodyJoint)
      } else {
        this.rotateRight(this.leftKneeBodyJoint)
      }







      if (this.body.GetPosition().x * SCALE - this.lazer.x < 50 || this.listener.dead) {
        this.fitness -= 10
        this.dead = true
      }

      this.fitness += 0.1
      this.score = this.fitness
      this.lifespan += 0.001
      this.fitness += this.body.GetPosition().x * SCALE / width
    }





  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------------




  ded() {


    this.world.DestroyJoint(this.leftLegBodyJoint)
    this.world.DestroyJoint(this.rightLegBodyJoint)
    this.world.DestroyJoint(this.leftKneeBodyJoint)
    this.world.DestroyJoint(this.rightKneeBodyJoint)
    this.world.DestroyJoint(this.headJoint)


    var pos = this.body.GetPosition()
    var angle = this.body.GetAngle()

    this.color = color(255, 0, 0, 8)

    push()
    noStroke()
    fill(this.color)
    translate(pos.x * SCALE, pos.y * SCALE)
    rotate(angle)
    rectMode(CENTER)
    rect(0, 0, this.bodyWidth * 2, this.bodyHeight * 2)
    pop()


    pos = this.head.GetPosition()
    angle = this.head.GetAngle()
    push()
    fill(this.color)
    translate(pos.x * SCALE, pos.y * SCALE)
    rotate(angle)
    rectMode(CENTER)
    rect(0, 0, this.headWidth * 2, this.headHeight * 2)
    pop()


    pos = this.ground.GetPosition()
    angle = this.ground.GetAngle()
    push()
    translate(pos.x * SCALE, pos.y * SCALE)
    rectMode(CENTER)
    rect(0, 0, this.groundWidth * 2, this.groundHeight * 2)
    pop()



    push()

    fill(255, 0, 0)
    rect(this.lazer.x, this.lazer.y, 10, height)
    pop()


    pos = this.leg.GetPosition()
    angle = this.leg.GetAngle()
    push()
    noStroke()
    fill(this.color)
    translate(pos.x * SCALE, pos.y * SCALE)
    rotate(angle)
    rectMode(CENTER)
    rect(0, 0, this.legWidth * 2, this.legHeight * 2)
    pop()


    pos = this.leg2.GetPosition()
    angle = this.leg2.GetAngle()
    push()
    noStroke()
    fill(this.color)
    translate(pos.x * SCALE, pos.y * SCALE)
    rotate(angle)
    rectMode(CENTER)
    rect(0, 0, this.leg2Width * 2, this.leg2Height * 2)
    pop()



    pos = this.knee.GetPosition()
    angle = this.knee.GetAngle()
    push()
    noStroke()
    fill(this.color)
    translate(pos.x * SCALE, pos.y * SCALE)
    rotate(angle)
    rectMode(CENTER)
    rect(0, 0, this.kneeWidth * 2, this.kneeHeight * 2)
    pop()


    pos = this.knee2.GetPosition()
    angle = this.knee2.GetAngle()
    push()
    noStroke()
    fill(this.color)
    translate(pos.x * SCALE, pos.y * SCALE)
    rotate(angle)
    rectMode(CENTER)
    rect(0, 0, this.knee2Width * 2, this.knee2Height * 2)
    pop()
  }


  get_vertices(body) {
    let verts = []

    for (var i = 0; i < body.m_fixtureList.m_shape.m_vertices.length; i++) {
      var vert = body.GetWorldPoint(body.m_fixtureList.m_shape.m_vertices[i])
      verts.push(new p5.Vector(vert.x * SCALE, vert.y * SCALE))
    }

    return verts
  }

  look() {
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    //console.log(this.leg)
    this.vision[0] = this.body.GetAngle()
    this.vision[1] = this.body.GetLinearVelocity().x
    this.vision[2] = this.body.GetLinearVelocity().y
    this.vision[3] = this.ground.GetPosition().y - this.body.GetPosition().y

    this.vision[4] = this.leg.GetAngle()
    this.vision[5] = this.leg.GetLinearVelocity().x
    this.vision[6] = this.leg.GetLinearVelocity().y
    this.vision[7] = this.ground.GetPosition().y - this.leg.GetPosition().y

    this.vision[8] = this.leg2.GetAngle()
    this.vision[9] = this.leg2.GetLinearVelocity().x
    this.vision[10] = this.leg2.GetLinearVelocity().y
    this.vision[11] = this.ground.GetPosition().y - this.leg2.GetPosition().y

    this.vision[12] = this.knee.GetAngle()
    this.vision[13] = this.knee.GetLinearVelocity().x
    this.vision[14] = this.knee.GetLinearVelocity().y
    this.vision[15] = this.ground.GetPosition().y - this.knee.GetPosition().y

    this.vision[16] = this.knee2.GetAngle()
    this.vision[17] = this.knee2.GetLinearVelocity().x
    this.vision[19] = this.knee2.GetLinearVelocity().y
    this.vision[19] = this.ground.GetPosition().y - this.knee2.GetPosition().y
  }


  rotateRight(Joint) {
    Joint.SetMotorSpeed(radians(-500))

  }

  rotateLeft(Joint) {
    Joint.SetMotorSpeed(radians(500))

  }


  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  //gets the output of the this.brain then converts them to actions
  think() {

    var max = 0;
    var maxIndex = 0;
    //get the output of the neural network
    this.decision = this.brain.feedForward(this.vision);

    for (var i = 0; i < this.decision.length; i++) {
      if (this.decision[i] > max) {
        max = this.decision[i];
        maxIndex = i;
      }
    }

    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  //returns a clone of this player with the same brian
  clone() {
    var clone = new Player();
    clone.brain = this.brain.clone();
    clone.fitness = this.fitness;
    clone.brain.generateNetwork();
    clone.gen = this.gen;
    clone.bestScore = this.score;
    return clone;
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //since there is some randomness in games sometimes when we want to replay the game we need to remove that randomness
  //this fuction does that

  cloneForReplay() {
    var clone = new Player();
    clone.brain = this.brain.clone();
    clone.fitness = this.fitness;
    clone.brain.generateNetwork();
    clone.gen = this.gen;
    clone.bestScore = this.score;

    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    return clone;
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  //fot Genetic algorithm
  calculateFitness() {

    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  crossover(parent2) {

    var child = new Player();
    child.brain = this.brain.crossover(parent2.brain);
    child.brain.generateNetwork();
    return child;
  }
}
