'use strict'

const PACMAN = '😁';
const PACMAN_IMG = '<img class="pacim" src="img/pacman.jpeg">';
var gPacman

var gDirClass = 'right'

function createPacman(board) {
    // initialize gPacman...
    gPacman = {
        location: {
            i: 6,
            j: 6
        },
        isSuper: false
    }

    board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function onMovePacman(ev) {
    if (!gGame.isOn) return

    // use getNextLocation(), nextCell
    var nextLocation = getNextLocation(ev)
    // console.log('nextLocation:', nextLocation)

    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    // console.log('nextCell:', nextCell)

    //  return if cannot move
    if (nextCell === WALL) return
    //  hitting a ghost? call gameOver
    if (nextCell === GHOST) {
        if (gPacman.isSuper) {
            console.log("h1");
            deadGhost(nextLocation);
            console.log('h2');
        } else {
            gameOver(false);
            renderCell(gPacman.location, EMPTY);
            return
        }
    } console.log(nextCell);

    if (nextCell === FOOD) {
        updateScore(1);
        gFoodCounter--;
        console.log(gFoodCounter);
        if (gFoodCounter === 0) gameOver(true)
    }

    if (nextCell === SUPER_FOOD) {
        if (gPacman.isSuper) return;
        gPacman.isSuper = true;
        var audio = new Audio("audio/bonus.wav");
        audio.play();
        for (var ghostIdx = 0; ghostIdx < gGhosts.length; ghostIdx++) {
            renderGhost(gGhosts[ghostIdx])
        }
        setTimeout(() => {
            gPacman.isSuper = false;
            returnGhost(gPacman.isSuper)
        }, 5000);
        // renderCell(gPacman.location, EMPTY);
        console.log();
    }

    if (nextCell === CHERRY) {
        updateScore(10)
    }

    // moving from current location:
    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    // update the DOM
    renderCell(gPacman.location, EMPTY)

    // Move the pacman to new location:
    // update the model
    gPacman.location = nextLocation
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN
    // update the DOM
    renderCell(gPacman.location, getPacmanHTML())
}

function getNextLocation(eventKeyboard) {
    // console.log('eventKeyboard.code:', eventKeyboard.code)
    // figure out nextLocation
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }

    switch (eventKeyboard.code) {
        case 'ArrowUp':
            nextLocation.i--
            gDirClass = 'up'
            break
        case 'ArrowDown':
            nextLocation.i++
            gDirClass = 'down'
            break
        case 'ArrowLeft':
            nextLocation.j--
            gDirClass = 'left'
            break
        case 'ArrowRight':
            nextLocation.j++
            gDirClass = 'right'
            break
        default: return null
    }
    return nextLocation
}

function getPacmanHTML() {
    return `<span class="pacman ${gDirClass}" >${PACMAN_IMG}</span>`
}

