document.addEventListener("DOMContentLoaded", main);
document.addEventListener("keydown", inputHandler)
//TODOS IN COMMENTS
//inputs: x value, y value, display priority
class Actor {
    constructor(xSet, ySet,dispPrior=0) {
        this.location = { x: xSet, y: ySet };
        this.displayPriority=dispPrior;
        actorPlace(this, xSet, ySet);
    }
}
class Player extends Actor {
    constructor(xSet, ySet,dispPrior=1) {
        super(xSet, ySet,dispPrior)
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
class Goblin extends Actor {
    constructor(setX,setY,dispPrior=1){
        super(setX,setY,dispPrior);
        this.mapSymbol="g";
        actorPlace(this,setX,setY);
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
    new Goblin (8,8);
    update();
}

function update(){
    if(document.getElementById("outerWrapper").children[0]) {
        document.getElementById("outerWrapper").children[0].remove();
    }
    document.getElementById("outerWrapper").append(createWorldTable());
}

function actorPlace(actor, x, y) {
    let actorPresentLocation=worldMap[actor.location.x][actor.location.y]
    if(x<0 || x>worldMap.length-1 || y<0 || y>worldMap.length-1){
        console.log("Out of bounds error");
        return false;
    }
    if(actorPresentLocation.presentActors.indexOf(actor)!=-1){
        actorPresentLocation.presentActors.splice(actorPresentLocation.presentActors.indexOf(actor),1);
    }
    worldMap[x][y].presentActors.push(actor);
    actor.location = { x, y }
}

//THERE IS AN UPDATE CALL IN HERE
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

            if (item.presentActors.length) {
                //Sort by display priority, with highest number being first
                // item.presentActors.sort(function(a,b){
                //     if (a.displayPriority>b.displayPriority){
                //         return true;
                //     } else {
                //         return false;
                //     }
                // });
                //display symbol of whichever is first
                tempData.innerHTML = item.presentActors[0].mapSymbol;
            }
            myRows[itemIndex].append(tempData);
        });
    });
    myTable.append(...myRows);
    return myTable;
}







