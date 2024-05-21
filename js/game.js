'use strict'

const WALL = '#'
const FOOD = '.'
const EMPTY = ' '
const SUPER_FOOD = '🥞'
const CHERRY = '🍒'
var gCherryInerval;
const gSize = 10

const gGame = {
    score: 0,
    isOn: false
}
var gBoard
var gFoodCounter = 0


function onInit() {
    gFoodCounter = 0
    gBoard = buildBoard()
    createPacman(gBoard)
    createGhosts(gBoard)

    renderBoard(gBoard)
    onCloseModal()
    gGame.score = 0
    document.querySelector('h2 span').innerText = gGame.score
    gGame.isOn = true
    gCherryInerval = setInterval(addCherry, 3000);
}

function buildBoard() {
    const size = gSize
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD;
            gFoodCounter++;
            // console.log(i, j,  isWall(i, j));
            // isWall(i, j);
            if (isWall(i, j, size)) {
                board[i][j] = WALL
                gFoodCounter--
            }



        }
    }

    board[1][1] = SUPER_FOOD;
    board[1][size - 2] = SUPER_FOOD;
    board[size - 2][1] = SUPER_FOOD;
    board[size - 2][size - 2] = SUPER_FOOD;
    gFoodCounter -= 4
    // gFoodCounter -= 3 //for 3 ghosts
    gFoodCounter-- //for pacman
    console.log('board:', board)
    console.log(gFoodCounter);
    return board
}

function isWall(i, j, size) {
    if (i === 0 || i === size - 1 ||
        j === 0 || j === size - 1 ||
        (j === 3 && i > 4 && i < size - 2)||
        (i === 2 && j > 4 && j < size - 2)) {
        return true
    }

    return false
}

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            var cell = board[i][j]
            if (cell === PACMAN) {
                cell = PACMAN_IMG
            }
            else if (cell === SUPER_FOOD) {
                cell = getSuperFoodHTML()
            } else if (cell === WALL) {
                cell = ''
            }

            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            if (isWall(i, j, gSize)) {
                const elCell = document.querySelector(`.cell-${i}-${j}`)

                elCell.style.borderStyle = 'groove'
                elCell.style.borderColor = 'blue'
            }

        }
    }

    for (var ghostIdx = 0; ghostIdx < gGhosts.length; ghostIdx++) {
        renderGhost(gGhosts[ghostIdx])
    }
}

function addCherry() {
    var emptyLocation = getEmptyCell(gBoard);
    console.log(emptyLocation);
    if (!emptyLocation) return;
    gBoard[emptyLocation.i][emptyLocation.j] = CHERRY;
    renderCell(emptyLocation, CHERRY);
}

// location is an object like this - { i: 2, j: 7 } , ''
function renderCell(location, value) {
    // console.log(location, value);
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function updateScore(diff) {
    // update model and dom
    gGame.score += diff
    document.querySelector('h2 span').innerText = gGame.score
}

function gameOver(isWin) {
    console.log('Game Over')
    gGame.isOn = false
    clearInterval(gIntervalGhosts)
    clearInterval(gCherryInerval)
    renderCell(gPacman.location, EMPTY)
    onOpenModal(isWin)
    if (!isWin) {
        var audio = new Audio("../audio/dead.wav");
        audio.play();
    } else {
        var audio = new Audio("../audio/victory.mp3");
        audio.play();
    }

}

function onOpenModal(isWin) {
    var elModal = document.querySelector('.restart');
    elModal.style.display = 'block';
    var elModalH2 = document.querySelector('.restart h2')
    elModalH2.innerText = isWin ? 'you Won' : 'Game Over'
}

function onCloseModal() {
    var elModal = document.querySelector('.restart');
    elModal.style.display = 'none';
}


function getSuperFoodHTML() {
    return `<span><img src="img/super-food.png"></span>`
}