const gameBoardContainer = document.querySelector('div.game-board');
const display = document.querySelector('div.player-display');
const setUpDisplay = document.querySelector('div.game-setup');
const restart = document.querySelector('div.restart')

const GameBoard = (function () {
    let board = [null, null, null, 
                    null, null, null, 
                    null, null, null];
    
    const resetBoard = function() {
        board = [null, null, null, 
            null, null, null, 
            null, null, null];
    }

    const renderBoard = function() {
        let index = 0;
        board.forEach(marker => {
            const box = document.createElement('div');
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

    const isFull = function() {
        return !board.includes(null);
    }

    const isWon = function() {
        return ((board[0] === 'x' || board[0] === 'o') && 
        ((board[0] === board[1] && board[0] === board[2]) || (board[0] === board[3] && board[0] === board[6]) || (board[0] === board[4] && board[0] === board[8]))) ||
        ((board[2] === 'x' || board[2] === 'o') && ((board[2] === board[4] && board[2] === board[6]) || (board[2] === board[5] && board[2] === board[8]))) ||
        ((board[4] === 'x' || board[4] === 'o') && ((board[4] === board[3] && board[4] === board[5]) || (board[4] === board[1] && board[4] === board[7]))) ||
        ((board[7] === 'x' || board[7] === 'o') && (board[7] === board[6] && board[7] === board[8]));
    }

    const placeMarker = function(marker, index) {
        if (!board[index]){
            board[index] = marker;
            box = document.querySelector(`div.box[data-index="${index}"]`);
            box.textContent = marker;
        }
    }

    return {
        renderBoard: renderBoard,
        isFull: isFull,
        isWon: isWon,
        placeMarker: placeMarker,
        resetBoard: resetBoard,
    }
})();

const Player = (marker) => {
    return {marker};
};

const DisplayController = (function () {
    let activePlayer;

    const player1 = Player('x');
    const player2 = Player('o');

    const _switchActivePlayer = function() {
        activePlayer = activePlayer === player1 ? player2 : player1;
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
        if (GameBoard.isWon()) {
            display.textContent = `${activePlayer === player1 ? 'player 2' : 'player 1'} wins!`;
            restart.appendChild(restartBtn);  
            return true;
        } else if (GameBoard.isFull()) {
            display.textContent = 'It\'s a tie!';
            restart.appendChild(restartBtn);
            return true;
        } else {
            display.textContent = `It's ${activePlayer === player1 ? 'player 1' : 'player 2'}'s turn!`;
            return false;
        }
    }

    const _endGame = function() {
        const boxes = gameBoardContainer.querySelectorAll('.box');
        Array.from(boxes).forEach(box => {
            box.classList.add('disabled')
        });
    }

    const playRound = function() {
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