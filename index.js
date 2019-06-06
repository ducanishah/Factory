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
        this.mapSymbol="P";
    }
}
class worldLocation {
    constructor () {
        this.presentActors=[]
    }
}

var worldMap;

function main() {
    // console.log(new Person().alive);
    initializeWorldMap();
    new Player(8, 8)
    document.getElementById("outerWrapper").append(createWorldTable());
}

function actorPlace(actor, x, y) {
    worldMap[x][y].presentActors.pop();
    worldMap[x][y].presentActors.push(actor);
    actor.location={x,y}
}

function inputHandler(e) {
    // console.log(e.code);
    switch (e.code) {
        case "ArrowUp":
            console.log("up")
            break;
        case "ArrowDown":
            console.log("down")
            break;
        case "ArrowLeft":
            console.log("left")
            break;
        case "ArrowRight":
            console.log("right")
            break;

        default:
            break;
    }
}

function initializeWorldMap() {
    worldMap = [];
    for (let i = 0; i < 16; i++) {
        worldMap[i] = new Array(16);
        for(let ind=0; ind<worldMap[i].length; ind++) {
            worldMap[i][ind]=new worldLocation;
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
            if (item.presentActors.length){
               tempData.innerHTML=item.presentActors[0].mapSymbol;
            }
            myRows[itemIndex].append(tempData);
        });
    });
    myTable.append(...myRows)
    return myTable;
}

