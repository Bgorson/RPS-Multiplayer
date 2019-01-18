  // Initialize Firebase
 
  var config = {
    apiKey: "AIzaSyB7ZJOxlKW-naWAWNjJ17tMhzNLX1e5MEw",
    authDomain: "rock-paper-scissors-c67af.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-c67af.firebaseio.com",
    projectId: "rock-paper-scissors-c67af",
    storageBucket: "rock-paper-scissors-c67af.appspot.com",
    messagingSenderId: "126175323231"
  };
  firebase.initializeApp(config);
var database = firebase.database();

var userRef= database.ref("/users/")

var playerName;
var player1LoggedIn= false;
var player2LoggedIn= false;
var playerNumber;
var Player1Object= {
    name:"",
    choice:"",
    wins:0,
    losses:0,
}
var Player2Object= {
    name:"",
    choice:"",
    wins:0,
    losses:0,
}

function setPlayerInfo(userId, name,loggedIn) {
  database.ref('users/' + userId).set({
    username: name,
    isLoggedIn:loggedIn,
    choice:'',
    wins:0,
    losses:0
  });
}


$("#submit").on("click", function (event) {
    event.preventDefault();
    return database.ref('/users/' + 1).once('value').then(function(snapshot) {
      var loggedIn = snapshot.val().isLoggedIn;
      console.log(loggedIn)  
    if (loggedIn == true){
      setPlayerInfo(2,($("#joinGame").val()),true)
      playerNumber =2 ;
      
    }
    else {
      setPlayerInfo(1,($("#joinGame").val()),true)
      playerNumber= 1;
     }
    });
    })

    firebase.database().ref('/users/' + 1).once('value').then(function(snapshot) {
      player1LoggedIn = snapshot.val().isLoggedIn;
    })
if (player1LoggedIn==false )
 setPlayerInfo(1,'',false)



$(".choice").on("click",function (event){
  event.preventDefault();
  if (playerNumber == 1) {
    database.ref('users/1').update({
      choice: $(this).attr("value")
        })
        console.log($(this).attr("value"))
  }
  else if (playerNumber == 2) {
    database.ref('users/2').update({
      choice: $(this).attr("value")
        })
        console.log($(this).attr("value"))
  }
})



/*
Using "once" on a "join game button"- determine if there is a player 1 or player 2 currently
Set 'players' be login and make a unique front end ID
Join game button- activates placement to 
checking for player set up a rule 
Check if anyone is there for first player to join to be assigned to first spot

player 2 joins and is then placed to player 2 slot

each playeronly entering data into their own set of data



collection -> Players 
              player1 -> Key:value (choices)
              player 2 -> Key: value
*/


