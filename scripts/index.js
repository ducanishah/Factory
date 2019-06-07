document.addEventListener("DOMContentLoaded", main);
document.addEventListener("keydown", keydownHandler);
import { Actor, ActorHolder, Player, Goblin, Tree } from "./actors.js"
//TODOS IN COMMENTS

class worldLocation {
    constructor(setX, setY) {
        this.presentActors = []
        this.x = setX;
        this.y = setY;
    }
}

export var myActorHolder = new ActorHolder();
var playerChar;
var worldMap;
var worldMapLength = 16;

function main() {
    // console.log(new Person().alive);
    initializeWorldMap();
    spawnInitialActors();
    updateWorldTable();
    // console.log(playerChar instanceof Player)
}

function spawnInitialActors() {
    // let place = generateRandomLocation();
    playerChar = new Player(8, 8);
    new Goblin(...generateRandomLocation());
    new Tree(...generateRandomLocation());
}

function updateWorldTable() {
    if (document.getElementById("outerWrapper").children[0]) {
        document.getElementById("outerWrapper").children[0].remove();
    }

    document.getElementById("outerWrapper").append(createWorldTable());
    document.getElementById("outerWrapper").children[0].addEventListener("click", clickHandler);
}

function initializeWorldMap() {
    worldMap = [];
    for (let i = 0; i < worldMapLength; i++) {
        worldMap[i] = new Array(worldMapLength);
        for (let ind = 0; ind < worldMap[i].length; ind++) {
            worldMap[i][ind] = new worldLocation(i, ind);
        }
    }

}

function createWorldTable() {
    let myTable = document.createElement("table");
    let myRows = new Array(worldMap.length);
    for (let i = 0; i < myRows.length; i++) {
        myRows[i] = document.createElement("tr")
    }
    //create the tds
    worldMap.forEach((subArray, subArrayIndex) => {
        subArray.forEach((item, itemIndex) => {
            let tempData = document.createElement("td");
            if (item.presentActors.length) {
                let topItem = item.presentActors[0];
                for (let i = 1; i < item.presentActors.length; i++) {
                    if (item.presentActors[i].displayPriority > topItem.displayPriority) {
                        topItem = item.presentActors[i];
                    }//TODO CONTINUE
                }
                //display symbol of whichever is first
                tempData.innerHTML = topItem.mapSymbol;
            }
            myRows[itemIndex].append(tempData);
        });
    });
    myTable.append(...myRows);
    return myTable;
}
//call this to move an actor from its present spot (or non-spot) to another spot
export function actorPlace(actor, x, y) {
    if (x < 0 || x > worldMap.length - 1 || y < 0 || y > worldMap.length - 1) {
        console.log("Out of bounds error");
        return false;
    }
    if (actor.location) {
        actor.location.presentActors.splice(actor.location.presentActors.indexOf(actor), 1);
    }
    worldMap[x][y].presentActors.push(actor);
    actor.location = worldMap[x][y];
}
//THERE ARE UPDATE CALLS IN HERE
function keydownHandler(e) {
    // console.log(e.code);
    switch (e.code) {
        case "ArrowUp":
            playerChar.move("up")
            break;
        case "ArrowDown":
            playerChar.move("down")
            break;
        case "ArrowLeft":
            playerChar.move("left")
            break;
        case "ArrowRight":
            playerChar.move("right")
            break;
        case "ControlLeft":
            return;
            break;
        default:
            break;
    }
    myActorHolder.update();
    updateWorldTable();
}

function clickHandler(e) {
    console.log(`location: (${e.target.cellIndex},${e.target.parentElement.rowIndex})`);
}

//accepts an array input with minx, maxx, miny, maxy
//returns in form [x,y]
function generateRandomLocation(arr) {
    let x;
    let y;
    if (arr) {
        if (arr[0] < 0 || arr[2] < 0 || arr[1] > worldMap.length - 1 || arr[3] > worldMap.length - 1) {
            console.log("These bounds are out of this world!");
        }
        if (arr[0] > arr[1] || arr[2] > arr[3]) {
            console.log("min needs to be smaller than max")
        }
        x = Math.floor(Math.random() * (arr[1] - arr[0])) + arr[0];
        y = Math.floor(Math.random() * (arr[3] - arr[2])) + arr[2];
    } else {
        x = Math.floor(Math.random() * worldMap.length);
        y = Math.floor(Math.random() * worldMap.length);
    }
    return [x, y];
}
//checks if given actor shares its location with any actor of a given class, excluding itself
export function sharesLocation(actor, typeToLookFor) {
    for (let i = 0; i < actor.location.presentActors.length; i++) {
        if (actor.location.presentActors[i] instanceof typeToLookFor && actor.location.presentActors[i] != actor) {
            return true;
        }
    }
    return false;
}


