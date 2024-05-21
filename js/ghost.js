'use strict'

const GHOST = '👻'
var gGhosts
var gDeadGhost = []
var gIntervalGhosts
var gGhostId = 101

function createGhost(board) {
    var ghost = {
        location: {
            i: 3,
            j: 3
        },
        currCellContent: FOOD,
        color: getRandomColor(),
        id: gGhostId++
    }
    gGhosts.push(ghost)
    board[ghost.location.i][ghost.location.j] = GHOST
}

function createGhosts(board) {
    // 3 ghosts and an interval
    gGhosts = []

    for (var i = 0; i < 3; i++) {
        createGhost(board)
    }

    gIntervalGhosts = setInterval(moveGhosts, 1000)

}

function moveGhosts() {
    // loop through ghosts
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i]
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    // console.log('ghost:', ghost)
    // figure out moveDiff, nextLocation, nextCell

    var moveDiff = getMoveDiff()
    // console.log('moveDiff:', moveDiff)

    var nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    }
    // console.log('nextLocation:', nextLocation) //{i,j}

    var nextCell = gBoard[nextLocation.i][nextLocation.j] //'.'
    // console.log('nextCell:', nextCell)

    // return if cannot move
    if (nextCell === WALL || nextCell === GHOST) return

    // hitting a pacman? call gameOver
    if (nextCell === PACMAN) {
        if (!gPacman.isSuper) gameOver(false)
        return;
    }

    // moving from current location:
    // update the model (restore prev cell contents)
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent

    // update the DOM
    renderCell(ghost.location, ghost.currCellContent)

    // Move the ghost to new location:
    // update the model (save cell contents)
    ghost.location = nextLocation
    ghost.currCellContent = nextCell

    gBoard[ghost.location.i][ghost.location.j] = GHOST
    // update the DOM
    renderGhost(ghost)
}

function deadGhost(nextLocation) {
    // gGhosts.color = blue;
    var ghostIdx = getGhostIdx(nextLocation)
    var deadGhost = gGhosts.splice(ghostIdx, 1)[0];
    if (deadGhost.currCellContent === FOOD) {
        deadGhost.currCellContent = EMPTY;
        gFoodCounter--;
        updateScore(1);
    }
    gDeadGhost.push(deadGhost);
    var audio = new Audio("../audio/ghost-dead.wav");
    audio.play();
}

function returnGhost() {
    gGhosts.push(...gDeadGhost);
    gDeadGhost = [];
}

function getGhostIdx(pos) {
    for (var ghIdx = 0; ghIdx < gGhosts.length; ghIdx++) {
        if (pos.i === gGhosts[ghIdx].location.i && pos.j === gGhosts[ghIdx].location.j) {
            return ghIdx;
        }
    }
    return gGhosts.length
}
function getMoveDiff() {
    const randNum = getRandomIntInclusive(1, 4)

    switch (randNum) {
        case 1: return { i: 0, j: 1 }
        case 2: return { i: 1, j: 0 }
        case 3: return { i: 0, j: -1 }
        case 4: return { i: -1, j: 0 }
    }
}

function getGhostHTML(ghost) {
    var color = gPacman.isSuper ? 'blue' : ghost.color
    var htmlStr = `<div id="image-container${ghost.id}"><img class="ghostim" src="img/ghost.png"></div>`

    return htmlStr
    // return `<span style="text-shadow:${color} 1px 1px, ${color} -1px 1px,${color} 1px -1px,${color} -1px -1px">${GHOST}</span>`;
}

function renderGhost(ghost) {
    renderCell(ghost.location, getGhostHTML(ghost))
    var color = gPacman.isSuper ? 'blue' : ghost.color
    var divElem = document.getElementById('image-container' + ghost.id);
    divElem.style.backgroundColor = color
}