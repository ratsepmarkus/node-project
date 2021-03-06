$(() => {
    let socket = io();
    let username = "";
    let lives;

    //generates the letters for guessing
    const createLetterButtons = () => {
        $("#letters").html("");
        const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
						"l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y",
						"z"
        ];
        letters.forEach(letter => $('#letters').append(`<button type="button"
				id="${letter}" class="letter" value="${letter}"> ${letter} </button>`));
    };


    //Event Listeners ==========================================================

    $('#letters').on("click", ".letter", function() {
        letter = $(this).val();
        socket.emit("clicked letter", letter);
    });

    $('#leave-chat').click(() => {
        socket.emit("leave game");
    });

    $('#message-box').submit((e) => {
        e.preventDefault();
        let textMessage = $('#text-message').val();

        //if theres a message entered
        if (textMessage != "") {
            socket.emit('chatroom message', username, textMessage);
            //clears message box
            $('#text-message').val('');
        }
        return false;
    });

		$('#button-container').on("click", "#start-game", () => {
        socket.emit('get word');
        console.log('get word')
    });

    $('#button-container').on("click", "#play-again", () => {
        socket.emit('play again');
    });

    //Socket Listeners =========================================================

    socket.on('welcome new user', (newUser) => {
        let message = (newUser === username) ? `Welcome to the chat ${newUser}!`
            : `${newUser} has entered the chat. Please welcome them!`;
        $('#messages').append($('<li>').text(message));
    });

    socket.on('updateUserList', (users) => {
        //$('#users').html("");
        console.log(users)
        //for (let id in users) {
        //    $('#users').append(`<li> ${users[id]} </li>`);
        //}
        if (Object.keys(users).length > 1 ){
            $("#button-container").html("<button id='start-game' class='button'>Start Game </button>")
        }
        console.log(Object.keys(users).length)
    });
    
    // socket.on('set username', () => {
    //     while (username === "" || username === null) {
    //         username = prompt("Please enter a username");
    //         if (username) {
    //             socket.emit('add username', username);
    //         }
    //     }
    // });
		socket.on('set word', () => {
            console.log('set word')
            
		});

    socket.on('update lives', (lives) => {
        $("#lives").html(`Lives left: ${lives}`);
    });

    socket.on('guessed word', (guessedWord) => {
        $("#guessed-word").html(guessedWord);
        console.log(guessedWord)
    });

    socket.on('game result', (result) => {
        $("#result").html(`You ${result}`);
				//disable letters after game is over
        $(".letter").prop("disabled", true);
				$('#button-container').html("<button id='play-again' class='button'>Play Again</button>")
    });

    socket.on('generate letter buttons', () => {
        createLetterButtons();
    });

    socket.on('disable letter', (letter) => {
        $(`#${letter}`).prop("disabled", true);
        $(`#${letter}`).addClass("guessed");
    });

		socket.on('disable guessing', () => {
				$('.letter').prop("disabled", true);
		});

    socket.on('send chatroom message', (message) => {
        $('#messages').append($('<li class="message">').text(message));
        const messageArea = document.getElementById("messages");
        messageArea.scrollTop = messageArea.scrollHeight;
    });

    socket.on('leave game', (disconnectUser) => {
        let message = "";
				if(disconnectUser === username){
					message = "You have left the chat.";
				  $(".letter").prop("disabled", true);
				}
				else{
					message = `${disconnectUser} has left the chat.`;
				}
        $('#messages').append($('<li>').text(message));
    });

		socket.on('full game', () => {
        alert("Sorry this game has reached max capacity. Please try again later!");
    });

		socket.on('clear', () => {
				$('#guessed-word').html("");
				$('#result').html("");
		});

		socket.on('show start game button', () => {
        $("#button-container").html("<button id='start-game' class='button'>Start Game </button>");
    });

		socket.on('hide button', () => {
				$('#button-container').html("");
		});
});