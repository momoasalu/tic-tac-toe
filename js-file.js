const gameBoardContainer = document.querySelector('div.game-board');
const display = document.querySelector('div.player-display');
const setUpDisplay = document.querySelector('div.game-setup');
const restart = document.querySelector('div.restart')

const GameBoard = (function () {
    let board = [null, null, null, 
                    null, null, null, 
                    null, null, null];

    const boardState = function() {
        return board.map((box) => box);
    }
    
    const resetBoard = function() {
        board = [null, null, null, 
            null, null, null, 
            null, null, null];
    }

    const renderBoard = function() {
        let index = 0;
        board.forEach(marker => {
            const box = document.createElement('button');
            box.setAttribute('data-index', index);
            ++index;
            box.classList.add('box');
            if (marker === 'x') {
                box.textContent = 'x';
            } else if (marker === 'o') {
                box.textContent = 'o';
            }
            gameBoardContainer.appendChild(box);
        });
    }

    const placeMarker = function(marker, index) {
        if (!board[index]){
            board[index] = marker;
            box = document.querySelector(`button.box[data-index="${index}"]`);
            box.textContent = marker;
        }
    }

    return {
        renderBoard: renderBoard,
        placeMarker: placeMarker,
        resetBoard: resetBoard,
        boardState: boardState,
    }
})();

const Player = (name, marker, isComputer) => {
    return {name, marker, isComputer};
};

const DisplayController = (function () {
    let activePlayer;

    let player1;
    let player2;

    const _switchActivePlayer = function() {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    const _isFull = function(board) {
        return !board.includes(null);
    }

    const _isWon = function(board) {
        return ((board[0] === 'x' || board[0] === 'o') && 
        ((board[0] === board[1] && board[0] === board[2]) || (board[0] === board[3] && board[0] === board[6]) || (board[0] === board[4] && board[0] === board[8]))) ||
        ((board[2] === 'x' || board[2] === 'o') && ((board[2] === board[4] && board[2] === board[6]) || (board[2] === board[5] && board[2] === board[8]))) ||
        ((board[4] === 'x' || board[4] === 'o') && ((board[4] === board[3] && board[4] === board[5]) || (board[4] === board[1] && board[4] === board[7]))) ||
        ((board[7] === 'x' || board[7] === 'o') && (board[7] === board[6] && board[7] === board[8]));
    }

    const _checkIfOver = function() {
        const restartBtn = document.createElement('button');
        restartBtn.textContent = 'restart';
        restartBtn.classList.add('restart');
        restartBtn.addEventListener('click', () => {
            gameBoardContainer.textContent = '';
            GameBoard.resetBoard();
            setUpDisplay.style.display = '';
            display.textContent = '';
            restartBtn.parentNode.removeChild(restartBtn);
        })
        if (_isWon(GameBoard.boardState())) {
            display.textContent = `${activePlayer === player1 ? player2.name : player1.name} wins!`;
            restart.appendChild(restartBtn);  
            return true;
        } else if (_isFull(GameBoard.boardState())) {
            display.textContent = 'It\'s a tie!';
            restart.appendChild(restartBtn);
            return true;
        } else {
            display.textContent = `It's ${activePlayer === player1 ? player1.name : player2.name}'s turn!`;
            if (activePlayer.isComputer) {
                _aiPlayTurn(activePlayer);
                _switchActivePlayer();
                if (_checkIfOver()) {
                    _endGame();
                    return;
                }
            }
            return false;
        }
    }

    const _endGame = function() {
        const boxes = gameBoardContainer.querySelectorAll('.box');
        Array.from(boxes).forEach(box => {
            box.classList.add('disabled')
        });
    }

    let choice;

    const _aiPlayTurn = function(player) {
        const boardState = GameBoard.boardState();
        minimax(player, boardState, 0);
        GameBoard.placeMarker(player.marker, choice);
    }

    const _getScore = function(player, board, depth) {
        if (_isWon(board)) {
            return player.marker === activePlayer.marker ? -10 + depth : 10 - depth;
        } else {
            return 0;
        }
    }

    const _getPossibleMoves = function(board) {
        let moves = [];
        let i = 0;
        board.forEach((box) => {
            if (box === null) {
                moves.push(i);
            }
            i++;
        })
        return moves;
    }

    const minimax = function(player, board, depth) {
        if (_isWon(board) || _isFull(board)) {
            return _getScore(player, board, depth);
        }

        let scores = [];
        let moves = _getPossibleMoves(board);

        const otherPlayer = player === player1 ? player2 : player1;
        let newBoard = board.map((box) => box);

        moves.forEach((moveIndex) => {
            newBoard = board.map((box) => box);
            newBoard[moveIndex] = player.marker;
            scores.push(minimax(otherPlayer, newBoard, depth + 1));
        });

        if (player === activePlayer) {
            choice = moves[scores.indexOf(Math.max(...scores))]
            return Math.max(...scores);
        } else {
            choice = moves[scores.indexOf(Math.min(...scores))]
            return Math.min(...scores);
        }
    }

    const playRound = function() {
        player1Name = setUpDisplay.querySelector('input#player-1-name').value.trim() === '' ? 'player 1' : setUpDisplay.querySelector('input#player-1-name').value.trim();
        player2Name = setUpDisplay.querySelector('input#player-2-name').value.trim() === '' ? 'player 2' : setUpDisplay.querySelector('input#player-2-name').value.trim();
        
        player1 = Player(player1Name, 'x', player1ComputerBtn.classList.contains('selected'));
        player2 = Player(player2Name, 'o', player2ComputerBtn.classList.contains('selected'));

        setUpDisplay.style.display = 'none';
        gameBoardContainer.textContent = '';
        GameBoard.renderBoard();

        activePlayer = player1.marker === 'x' ? player1 : player2;
        _checkIfOver();
        
        const boxes = gameBoardContainer.querySelectorAll('.box');
        Array.from(boxes).forEach(box => {
            box.addEventListener('click', () => {
                if (!box.classList.contains('disabled') && box.textContent === '') {
                    GameBoard.placeMarker(activePlayer.marker, box.getAttribute('data-index'));
                    _switchActivePlayer();
                    if (_checkIfOver()) {
                        _endGame();
                    }
                }
            })
        });
    }

    return {
        playRound: playRound
    }
})();

const startBtn = document.querySelector('button.start-game');

startBtn.addEventListener('click', () => {
    DisplayController.playRound();
})

const player1HumanBtn = document.querySelector('button.player-1-human');
const player1ComputerBtn = document.querySelector('button.player-1-computer');

player1HumanBtn.addEventListener('click', () => {
    player1HumanBtn.classList.add('selected');
    player1ComputerBtn.classList.remove('selected')
})

player1ComputerBtn.addEventListener('click', () => {
    player1ComputerBtn.classList.add('selected');
    player1HumanBtn.classList.remove('selected')
})

const player2HumanBtn = document.querySelector('button.player-2-human');
const player2ComputerBtn = document.querySelector('button.player-2-computer');

player2HumanBtn.addEventListener('click', () => {
    player2HumanBtn.classList.add('selected');
    player2ComputerBtn.classList.remove('selected')
})

player2ComputerBtn.addEventListener('click', () => {
    player2ComputerBtn.classList.add('selected');
    player2HumanBtn.classList.remove('selected')
})