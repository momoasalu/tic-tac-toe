const gameBoardContainer = document.querySelector('div.game-board');

const GameBoard = (function () {
    const board = [null, 'x', 'o', 
                    'x', 'o', 'o', 
                    'o', 'x', 'o'];

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

const DisplayController = (function () {

})();

const Player = (name, marker) => {
    const nextToPlay = false;
    return {name, marker, nextToPlay};
};