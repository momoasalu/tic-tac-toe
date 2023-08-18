const gameBoardContainer = document.querySelector('div.game-board');

const GameBoard = (function () {
    const board = [null, null, null, 
                    null, null, null, 
                    null, null, null];

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
        placeMarker: placeMarker
    }
})();

const Player = (marker) => {
    return {marker};
};

const DisplayController = (function () {
    let activePlayer;

    const player1 = Player('x');
    const player2 = Player('o');

    const switchActivePlayer = function() {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    const checkIfOver = function() {
        
    }

    const playRound = function() {
        gameBoardContainer.textContent = '';
        GameBoard.renderBoard();

        activePlayer = player1.marker === 'x' ? player1 : player2;
        
        const boxes = gameBoardContainer.querySelectorAll('.box');
        console.log(boxes)
        Array.from(boxes).forEach(box => {
            box.addEventListener('click', () => {
                GameBoard.placeMarker(activePlayer.marker, box.getAttribute('data-index'));
                switchActivePlayer();
                checkIfOver();
            })
        });


    }

    return {
        playRound: playRound
    }
})();