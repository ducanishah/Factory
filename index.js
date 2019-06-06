document.addEventListener("DOMContentLoaded", main);
document.addEventListener("keydown", inputHandler)
//TODOS IN COMMENTS
class Actor {
    constructor(xSet, ySet) {
        this.location = { x: xSet, y: ySet };
        actorPlace(this, xSet, ySet);
    }
}
class Player extends Actor {
    constructor(xSet, ySet) {
        super(xSet, ySet)
        this.mapSymbol = "P";
    }
    move(direction) {
        switch (direction) {
            case "up":
                actorPlace(this, this.location.x, this.location.y - 1);
                break;
            case "down":
                actorPlace(this, this.location.x, this.location.y + 1)
                break;
            case "left":
                actorPlace(this, this.location.x - 1, this.location.y)
                break;
            case "right":
                actorPlace(this, this.location.x + 1, this.location.y)
                break;
            default:
                console.log("Why the fuck isn't there a direction for this move")
                break;
        }
    }
}
class worldLocation {
    constructor() {
        this.presentActors = []
    }
}

var playerChar;
var worldMap;

function main() {
    // console.log(new Person().alive);
    initializeWorldMap();
    playerChar = new Player(8, 8);
    update();
}

function update(){
    if(document.getElementById("outerWrapper").children[0]) {
        document.getElementById("outerWrapper").children[0].remove();
    }
    document.getElementById("outerWrapper").append(createWorldTable());
}

function actorPlace(actor, x, y) {
    if(x<0 || x>worldMap.length || y<0 || y>worldMap.length){
        console.log("Out of bounds error");
        return false;
    }
    worldMap[actor.location.x][actor.location.y].presentActors.pop();
    worldMap[x][y].presentActors.push(actor);
    actor.location = { x, y }
}

function inputHandler(e) {
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
        default:
            break;
    }
    update();
}

function initializeWorldMap() {
    worldMap = [];
    for (let i = 0; i < 16; i++) {
        worldMap[i] = new Array(16);
        for (let ind = 0; ind < worldMap[i].length; ind++) {
            worldMap[i][ind] = new worldLocation;
        }
    }

}

function createWorldTable() {
    let myTable = document.createElement("table");
    let myRows = new Array(16);
    for (let i = 0; i < myRows.length; i++) {
        myRows[i] = document.createElement("tr")
    }
    worldMap.forEach((subArray, subArrayIndex) => {
        subArray.forEach((item, itemIndex) => {
            let tempData = document.createElement("td");
            // tempData.innerHTML = `(${subArrayIndex},${itemIndex})`;
            if (item.presentActors.length) {
                tempData.innerHTML = item.presentActors[0].mapSymbol;
            }
            myRows[itemIndex].append(tempData);
        });
    });
    myTable.append(...myRows);
    return myTable;
}







