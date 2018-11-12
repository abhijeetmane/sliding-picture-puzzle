let interval = null;
let puzzleCompleteStatus = false;
let shuffledTrack = [],
    count, emptyBoxPos;
let gridSize, maxFromLeft, maxFromTop;

function createPuzzle(size) {
    let shuffleMoves = true;
    gridSize = size;
    const tileStyles = 80;
    /* You can provide any Image from internet */
    const imagePath = './monks.jpg';
    maxFromLeft = tileStyles * gridSize;
    maxFromTop = tileStyles * gridSize;
    setEmptyBosPosition();
    const movesElement = document.getElementById('moves');
    const timerElement = document.getElementById('timer');
    let moves = 0;
    let timer = 0;

    let puzzleElement = document.createElement('div');
    puzzleElement.style.height = `${maxFromTop}px`;
    puzzleElement.style.width = `${maxFromLeft}px`;
    puzzleElement.setAttribute('class', 'puzzle');
    puzzleElement.setAttribute('id', 'puzzle');
    document.getElementById('container').append(puzzleElement);

    let tiles = Array(gridSize * gridSize - 1).fill(0);

    let sourcePuzzleImage = document.getElementById('original-puzzle');
    sourcePuzzleImage.style.background = `url(${imagePath}) 0px 0px`;
    sourcePuzzleImage.style.backgroundSize = (gridSize - gridSize / 2) * tileStyles + 'px';
    sourcePuzzleImage.style.height = tileStyles * (gridSize - gridSize / 2) + 'px';
    sourcePuzzleImage.style.width = tileStyles * (gridSize - gridSize / 2) + 'px';

    let convertToNumber = function (position) {
        return Number.parseInt(position.replace('px', ''));
    }

    let setTimerMoves = function (move, time) {
        moves = move;
        timer = time;
        movesElement.innerHTML = moves;
        timerElement.innerHTML = timer;
    }

    let isPuzzleComplete = function () {
        const tileElements = document.querySelectorAll('.tile');
        for (let i = 0; i < tileElements.length; i++) {
            if (!(tileElements[i].dataset.originalLeft == convertToNumber(tileElements[i].style.left) &&
                    tileElements[i].dataset.originalTop == convertToNumber(tileElements[i].style.top))) {
                return false;
            }
        }
        return true;
    }

    let elemBackToOriginalPosition = function (currentLeft, currentTop) {
        if (!shuffleMoves && event.target.dataset.originalLeft == emptyBoxPos.left &&
            event.target.dataset.originalTop == emptyBoxPos.top) {
            if (isPuzzleComplete()) {
                puzzleCompleteStatus = true;
                shuffledTrack = [];
                count = shuffledTrack.length;
                clearInterval(interval);
                interval = null;
                setTimeout(function () {
                    alert(`Puzzle is finished in ${moves} moves`);
                    setTimerMoves(0, 0);
                }, 1000);
            }
        }
        emptyBoxPos = {
            left: currentLeft,
            top: currentTop
        }
    }

    let swapPositions = function (currentLeft, currentTop) {
        event.target.style.left = `${emptyBoxPos.left}px`;
        event.target.style.top = `${emptyBoxPos.top}px`;
        elemBackToOriginalPosition(currentLeft, currentTop);
    }

    let handleMoves = function (event) {
        if (!shuffleMoves) {
            if (!interval) {
                interval = setInterval(function () {
                    timerElement.innerHTML = ++timer;
                }, 1000);
            }
            movesElement.innerHTML = ++moves;
        }

        let currentLeft = convertToNumber(event.target.style.left);
        let currentTop = convertToNumber(event.target.style.top);
        let leftOffset = currentLeft - emptyBoxPos.left;
        let topOffset = currentTop - emptyBoxPos.top;
        if ((leftOffset == 0 && Math.abs(topOffset) == maxFromTop / gridSize) ||
            (topOffset == 0 && Math.abs(leftOffset) == maxFromLeft / gridSize)) {
            shuffledTrack.push({
                id: event.target.innerHTML,
                left: currentLeft,
                top: currentTop
            });
            count = shuffledTrack.length - 1;
            swapPositions(currentLeft, currentTop);
        }
    }

    for (let index = 0; index < tiles.length; index++) {
        let tileElement = document.createElement('div');
        tileElement.addEventListener('click', handleMoves);
        tileElement.setAttribute('id', index);
        tileElement.setAttribute('class', 'tile');
        tileElement.innerHTML = index;
        const startLeft = (index % gridSize) * tileStyles;
        const startTop = Math.floor(Math.abs((index) / gridSize)) * tileStyles;
        tileElement.style.left = `${startLeft}px`;
        tileElement.style.top = `${startTop}px`;
        tileElement.style.height = `${tileStyles}px`;
        tileElement.style.width = `${tileStyles}px`;
        tileElement.style.background = `url(${imagePath}) ${-startLeft}px ${-startTop}px`;
        tileElement.style.backgroundSize = gridSize * tileStyles + 'px';
        tileElement.dataset.originalLeft = startLeft;
        tileElement.dataset.originalTop = startTop;
        puzzleElement.append(tileElement);
    }

    setTimerMoves(moves, timer);

    function shuffleTiles() {
        shuffledTrack = [];
        let rows = document.querySelectorAll('.puzzle');
        for (let i = 0; i < 160; ++i) {
            let row = Math.floor(Math.random() * rows.length);
            let tiles = rows.item(row).querySelectorAll('.tile');
            let tile = Math.floor(Math.random() * tiles.length);
            tiles.item(tile).click();
        }
        shuffleMoves = false;
    }
    shuffleTiles();
}

function autoSolvePuzzle() {
    for (let i = shuffledTrack.length - 1; i >= 0; i--) {
        document.getElementById(shuffledTrack[i].id).style.left = shuffledTrack[i].left + 'px';
        document.getElementById(shuffledTrack[i].id).style.top = shuffledTrack[i].top + 'px';

    }
    setEmptyBosPosition();
    shuffledTrack = [];
}

function setEmptyBosPosition(){
    emptyBoxPos = {
        left: maxFromLeft - maxFromLeft / gridSize,
        top: maxFromTop - maxFromTop / gridSize
    }
}
function changeGrid(gridSize) {
    let list = document.getElementById("container");
    list.removeChild(list.childNodes[3]);
    clearInterval(interval);
    interval = null;
    createPuzzle(gridSize);
}

function showHelp(color) {
    document.getElementById('puzzle').style.color = color;
}

createPuzzle(4);