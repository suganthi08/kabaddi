var database;
var position1,position2;
var player1,player2;
var gameState;
var position
var player1animation, player2animation;
var player1Score, player2Score=0;

function preload (){
    player1animation= loadAnimation("assests/player1a.png","assests/player1b.png","assests/player1a.png");
    player2animation=loadAnimation("assests/player2a.png","assests/player2b.png","assests/player2a.png");

}

function setup(){
createCanvas(800,800);
database=firebase.database();

player1=createSprite(300,400,20,20);
player1.shapeColor="red";
player1.addAnimation("red",player1animation);
player1.scale = 0.5
player1.setCollider("circle", 0,0,60)
player1.debug = true;

var player1Position=database.ref('player1/position');
player1Position.on("value",readPosition1,showErr)

player2=createSprite(500,400,20,20);
player2.shapeColor="yellow";
player2.addAnimation("yellow",player2animation);
player2.scale = -0.5
player2.setCollider("circle", 0,0,60)
player2.debug = true;


var player2Position=database.ref('player2/position');
player2Position.on("value",readPosition2,showErr);


var gameStateRef= database.ref('gameState');
gameStateRef.on("value",readGameState,showErr);

player1Score=database.ref('player1Score');
player1Score.on("value",readScore1);


player2Score=database.ref('player2Score');
player2Score.on("value",readScore2)


}

function draw(){
background(255)

drawLines();

if (gameState===0){
    fill(0);
    stroke(0)
    textSize(20)
    strokeWeight(2)
    text("Press  Space To Start ", 300, 200)

    if (keyDown ('space')){
        var rand = Math.round(random(1,2));
    
        if (rand===1){
            database.ref('/').update({
                gameState:1
            })

            alert("Red Plays")

        } else if (rand=== 2){
            database.ref('/').update({
                gameState:2
            })
            alert("Yellow Plays")
        }
        database.ref('player1/position').update({
            x:150,
            y:400
        })
        database.ref('player2/position').update({
            'x': 650,
            'y': 400  
          })
        }
}
// red plays
if (gameState===1){

    // adding control to players (red moves all direction & yellow moves up & down)
    if(keyDown("a")){
        writePositionRed(-5,0);
      }
      else if(keyDown("s")){
        writePositionRed(5,0);
      }
      else if(keyDown("w")){
        writePositionRed(0,-5);
      }
      else if(keyDown("d")){
        writePositionRed(0,+5);
      }
      else if(keyDown(UP_ARROW)){
        writePositionYellow(0,-5);
      }
      else if(keyDown(DOWN_ARROW)){
        writePositionYellow(0,+5);
      }

      // increasing score if red touches the red line 
// condition for red to score
      if (player1.x>700){

            database.ref("/").update({
              'gameState': 0,
                'player1Score': player1Score + 5 ,
                'player2Score': player2Score - 5 ,
                  
            })
        alert ("Red gains");
        console.log(gameState)
      }
// condition for red to lose
      if (player1.isTouching(player2)){
            database.ref("/").update({
              'gameState': 0 ,
                'player1Score': player1Score - 5 ,
                'player2Score': player2Score + 5 ,
               
            })
            alert("Red Lost")
        }
} // GAMESTATE 1 ENDS

// yellow plays
if (gameState===2){

   // adding control to players (yellow moves all direction & red moves up & down)
    if(keyDown(LEFT_ARROW)){
        writePositionYellow(-5,0);
      }
      else if(keyDown(RIGHT_ARROW)){
        writePositionYellow(5,0);
      }
      else if(keyDown(UP_ARROW)){
        writePositionYellow(0,-5);
      }
      else if(keyDown(DOWN_ARROW)){
        writePositionYellow(0,+5);
      }
      else if(keyDown("w")){
        writePositionRed(0,-5);
      }
      else if(keyDown("d")){
        writePositionRed(0,+5);
      }
     
// condition for yellow to score
    if (player2.x<100){

        database.ref('/').update({
             'gameState':0,
            'player1Score': player1Score - 5 ,
            'player2Score': player2Score + 5 ,
           
        })
        alert("Yellow gains")
        console.log(player2Score)
    }  
// condition for yellow to lose
    if (player1.isTouching(player2)){
        database.ref('/').update({
            'gameState': 0 ,
            'player1Score': player1Score + 5 ,
            'player2Score': player2Score - 5 
            
        })
        alert("Yellow Lost")
    }
    
   
}// GAMESTATE 2  ENDS

    textSize(15)
    text("RED: "+player1Score,150,15);
    text("YELLOW: "+player2Score,550,15);
    

    drawSprites();
} // DRAW ENDS HERE

function drawLines(){
    strokeWeight(4);
    for (var i =0; i<= 800;i=i+20){
        stroke("grey");
        line (400,i,400,i+10);

        stroke("red");
        line (700,i,700,i+10);

        stroke("yellow");
        line (100,i,100,i+10);
    }
}

function readPosition1(data){
 position1=data.val();
 //console.log(position1)
 player1.x = position1.x;
 player1.y = position1.y;

}

function readPosition2(data){
    position2=data.val();
    player2.x = position2.x;
    player2.y = position2.y;
   // console.log(position2)
}


function readScore1(data1){
    player1Score = data1.val();
  }
  
  function readScore2(data2){
    player2Score = data2.val();
  }
  
function showErr(){
    console.log("error")
   }

function readGameState(data){
    gameState=data.val();
   // console.log(gameState)
}

function writePositionRed(x,y){
    database.ref('player1/position').update({
        'x': position1.x + x ,
        'y': position1.y + y
      })


}


function writePositionYellow(x,y){
    database.ref('player2/position').update({
        'x': position2.x + x ,
        'y': position2.y + y
      })

}