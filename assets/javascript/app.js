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
  var playerName;
  var player1LoggedIn;
  var player2LoggedIn;
  var playerNumber;
  var Player1Object = {
    name: "",
    choice: "",
    wins: 0,
    losses: 0,
  }
  var Player2Object = {
    name: "",
    choice: "",
    wins: 0,
    losses: 0,
  }
  //Creates a function to establish inital player objects in database
  function setPlayerInfo(userId, name, loggedIn) {
    database.ref('users/' + userId).set({
      username: name,
      isLoggedIn: loggedIn,
      choice: '',
      wins: 0,
      losses: 0,
      winner: false
    });
  }

  var choice1
  var choice2




  //Game logic for determining winners. Takes values and assigns them to global "choice" variables
  function gamePlay() {
    choice1 = Player1Object.choice
    choice2 = Player2Object.choice
    if (playerNumber == 2) {
      $("#score").text(Player2Object.wins)
      $("#yourPick").text("You picked: " + Player2Object.choice)
    }
    if (playerNumber == 1) {
      $("#yourPick").text("You picked: " + Player1Object.choice)
      $("#score").text(Player1Object.wins)
    }

    //Game Logic for determining a winner
    //NEED TO PULL FROM DATABASE AND USE THAT INFORMATION
    if (Player1Object.choice && Player2Object.choice != '') {
      if (choice1 == choice2) {
        database.ref('users/1').update({
          choice: '',
          wins: Player1Object.wins,
          winner: 'draw'

        })
        database.ref('users/2').update({
          choice: '',
          losses: Player2Object.losses,
          winner: 'draw'
        })

      } else if (choice1 == 'rock' && choice2 == 'scissor') {
        Player1Object.wins += 1
        Player2Object.losses += 1

        database.ref('users/1').update({
          choice: '',
          wins: Player1Object.wins,
          winner: true
        })
        database.ref('users/2').update({
          choice: '',
          losses: Player2Object.losses
        })

      } else if (choice1 == 'paper' && choice2 == 'rock') {
        Player1Object.wins += 1
        Player2Object.losses += 1
        database.ref('users/1').update({
          choice: '',
          wins: Player1Object.wins,
          winner: true
        })
        database.ref('users/2').update({
          choice: '',
          losses: Player2Object.losses
        })


      } else if (choice1 == 'scissor' && choice2 == 'paper') {
        Player1Object.wins += 1
        Player2Object.losses += 1
        database.ref('users/1').update({
          choice: '',
          wins: Player1Object.wins,
          winner: true
        })
        database.ref('users/2').update({
          choice: '',
          losses: Player2Object.losses
        })

      } else {
        Player1Object.losses += 1
        Player2Object.wins += 1
        database.ref('users/1').update({
          choice: '',
          losses: Player1Object.losses
        })
        database.ref('users/2').update({
          choice: '',
          wins: Player2Object.wins,
          winner: true
        })

      }


    }
  }

  //updating winning and losing text
  database.ref('/users/1').on("value", function (snapshot) {
    Player1Object.wins = snapshot.val().wins
    Player1Object.losses = snapshot.val().losses
    if (snapshot.val().winner == true) {
      $("#yourPick").text(Player1Object.name + " Won!")
      snapshot.val().winner = false;
      database.ref('users/1').update({
        winner: false
      })
      database.ref('users/2').update({
        winner: false
      })
    }
    if (snapshot.val().winner == "draw") {
      $("#yourPick").text("Draw")
      database.ref('users/1').update({
        winner: false
      })
      database.ref('users/2').update({
        winner: false
      })
    }
  })
  database.ref('/users/2').on("value", function (snapshot) {
    Player2Object.wins = snapshot.val().wins
    Player2Object.losses = snapshot.val().losses
    if (snapshot.val().winner == true) {
      $("#yourPick").text(Player2Object.name + " Won!")
      snapshot.val().winner = false;
      database.ref('users/1').update({
        winner: false
      })
      database.ref('users/2').update({
        winner: false
      })
    }
    if (snapshot.val().winner == "draw") {
      $("#yourPick").text("Draw")
      database.ref('users/1').update({
        winner: false
      })
      database.ref('users/2').update({
        winner: false
      })
    }

  })
  //updates scoreboard
  database.ref().on("value", function () {
    if (playerNumber == 2) {
      $("#score").text(Player2Object.wins)
    }
    if (playerNumber == 1) {
      $("#score").text(Player1Object.wins)
    }
  })

  //creates "join" button and block more than 2 users from joining
  $(".join").on("click", function () {
    if (currentUsers < 3) {
      $(".joined").css("display", "block")
    }
  })

  var connectionsRef = database.ref("/connections");
  var currentUsers = 0;
  // '.info/connected' is a special location provided by Firebase that is updated every time
  // the client's connection state changes.
  // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
  var connectedRef = database.ref(".info/connected");
  // When the client's connection state changes...
  connectedRef.on("value", function (snap) {

    // If they are connected..
    if (snap.val()) {

      // Add user to the connections list.
      var con = connectionsRef.push(true);

      // Remove user from the connection list when they disconnect.
      con.onDisconnect().remove();
      currentUsers == currentUsers - 1
    }
  });

  // When first loaded or when the connections list changes...
  connectionsRef.on("value", function (snapshot) {
    console.log("Connection change")
    // The number of online users is the number of children in the connections list.
    currentUsers = snapshot.numChildren()
    if (snapshot.numChildren() == 1) {
      setPlayerInfo(1, '', false)
      setPlayerInfo(2, '', false)
    }
  });





  //When a player joins- it assigns them to player 1 or Player 2 depending on order and if someone is logged in
  $("#submit").on("click", function (event) {
    event.preventDefault();
    playerName= $('#joinGame').val()
    $("#submit").css("display", "none")

    database.ref('/users/' + 1).once('value').then(function (snapshot) {
      var loggedIn = snapshot.val().isLoggedIn;
      console.log(loggedIn)
      if (loggedIn == true) {
        setPlayerInfo(2, ($("#joinGame").val()), true)
        playerNumber = 2;
        $("#username").text(($("#joinGame").val()))
        $("#joinGame").css("#display", "none")
        

      } else {
        setPlayerInfo(1, ($("#joinGame").val()), true)
        playerNumber = 1;
        $("#username").text(($("#joinGame").val()))
        $("#joinGame").css("display", "none")
      }
    });

  })

  database.ref('/users/1').on("value", function (snapshot) {
    Player1Object.choice = snapshot.val().choice
    Player1Object.name = snapshot.val().username
    Player1Object.wins = snapshot.val().wins
    Player1Object.losses = snapshot.val().losses
    player1LoggedIn = snapshot.val().isLoggedIn
  })
  database.ref('/users/2').on("value", function (snapshot) {
    Player2Object.choice = snapshot.val().choice
    Player2Object.name = snapshot.val().username
    Player2Object.wins = snapshot.val().wins
    Player2Object.losses = snapshot.val().losses
    player2LoggedIn = snapshot.val().isLoggedIn

  })



  $(".choice").on("click", function (event) {
    event.preventDefault();
    if (playerNumber == 1) {
      database.ref('users/1').update({
        choice: $(this).attr("value")
      })
      Player1Object.choice = ($(this).attr("value"))
    } else if (playerNumber == 2) {
      database.ref('users/2').update({
        choice: $(this).attr("value")
      })
      Player2Object.choice = ($(this).attr("value"))
    }
    gamePlay()
  })

var messages;
    function message() {
      database.ref('messages/').set({
    message:$("#chat").val()
      });
    }
  $("#submitMessage").on("click",function(){
    message();
    var text= $("<div>")
    database.ref('/messages/').on("value", function (snapshot) {
      messages= snapshot.val().message
      console.log(messages)
    })
    text.append(JSON.stringify(messages))
    console.log(text)
    $(text).prepend(playerName + ": ")
    $("#chatBox").prepend(text)

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