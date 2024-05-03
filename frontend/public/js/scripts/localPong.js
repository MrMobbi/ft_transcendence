export function initPongGame(routerData) {
    const canvas = document.getElementById('pongCanvas');
    const scoreZone = document.getElementById('scoreZone');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    } else {
        console.log('Canvas element found!');
    }



    const gameSocket = new WebSocket(
        'wss://' + location.host + '/ws/game/local' + routerData.user.user_id + '/?token=' + localStorage.getItem('authToken')
    );

    let disconnect = false;

    let keyPressed = { "ArrowUp": false, "ArrowDown": false, "w": false, "s": false };
    let keyMessage = { "ArrowUp": "P2_UP", "ArrowDown": "P2_DOWN", "w": "P1_UP", "s": "P1_DOWN" };
    function waitConnection() {
        setTimeout(function () {
            if (gameSocket.readyState === 1 && gameSocket.OPEN === 1) {

                document.addEventListener('keydown', eventKeyDown);

                document.addEventListener('keyup', eventKeyUP);
                // Function to disable both buttons
                function disableButtons() {
                    document.getElementById('button-start-human').disabled = true;
                    document.getElementById('button-start-bot').disabled = true;
                }

                // Attach event listeners to buttons for starting the game
                document.getElementById('button-start-human').addEventListener('click', () => {
                    startGame('human', 'human');
                    disableButtons(); // Disable both buttons
                });

                document.getElementById('button-start-bot').addEventListener('click', () => {
                    const botSide = document.querySelector('input[name="botSide"]:checked').value;
                    if (botSide === 'left') {
                        startGame('bot', 'human');
                    } else {
                        startGame('human', 'bot');
                    }
                    disableButtons(); // Disable both buttons
                });


            } else {
                if (window.location.pathname !== "/localroom") {
                    disconnect = true;
                    gameSocketClose();
                    return;
                }
                console.log("waiting to connect");
                waitConnection();
            }
        }, 5);
    }
    function startGame(player1Type, player2Type) {
        gameSocket.send(JSON.stringify({
            'join': 'local',
            'player_1_type': player1Type,
            'player_2_type': player2Type,
        }));

        gameSocket.send(JSON.stringify({
            'start': 'start',
        }));
    }
    console.log("Connected");
    waitConnection();

    if (disconnect)
        return;


    const ctx = canvas.getContext('2d');

    let player1 = { x: 20, y: 100, width: 25, height: 125, score: 0 };
    let player2 = { x: canvas.width - 30, y: 200, width: 25, height: 125, score: 0 };
    let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10 };

    function drawPlayer(player) {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawBall(ball) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF';
        ctx.fill();
        ctx.closePath();
    }

    function drawEverything() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawPlayer(player1);
        drawPlayer(player2);
        drawBall(ball);
    }

    let data;

    gameSocket.onmessage = function (e) {
        data = JSON.parse(e.data);
        if (data["P1 Score"])
            player1.score = data["P1 Score"];
        if (data["P2 Score"])
            player2.score = data["P2 Score"];
    }

    console.log("Initializing Pong game");

    let intervalId = setInterval(UpdateGameState, 16);

    function UpdateGameState() {
        try {
            if (data == "Game Ended") {
                console.log("Game CLEAR");
                clearInterval(intervalId);
                gamePatch();
                return;
            }
            player1.x = data["P1"]["x"];
            player2.x = data["P2"]["x"];
            player1.y = data["P1"]["y"];
            player2.y = data["P2"]["y"];
            ball.x = data["Ball"]["x"];
            ball.y = data["Ball"]["y"];

            scoreZone.innerHTML = `Score : ${player1.score} - ${player2.score}`;

            for (const key in keyPressed) {
                if (keyPressed[key]) {
                    gameSocket.send(JSON.stringify({
                        'local': keyMessage[key],
                    }));
                }
            }
        } catch (error) {
            // console.error('Failed to fetch coordinates:', error);
        }
        if (window.location.pathname !== "/localroom") {
            clearInterval(intervalId);
            gameSocketClose();
            return;
        }
        drawEverything();
    }

    function eventKeyUP(e) {
        if (e.key in keyPressed) {
            keyPressed[e.key] = false;
        }
    }

    function eventKeyDown(e) {
        if (e.key in keyPressed) {
            keyPressed[e.key] = true;
            e.preventDefault();
        }
        if (e.key.repeat) {
            return;
        }
    }


    console.log('About to fetch game state...');
    function gameSocketClose() {
        console.log('Closing game socket...');
        //stop events
        document.removeEventListener('keydown', eventKeyDown);
        
        document.removeEventListener('keyup', eventKeyUP);
        keyPressed = { "ArrowUp": false, "ArrowDown": false, "w": false, "s": false };
        
        //close the socket
        gameSocket.close();
    }
};
