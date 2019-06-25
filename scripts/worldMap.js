//needed for hooking onto the world table when world table is updated
import { clickHandler } from "./helperScripts/inputsHandlers.js"


export class worldLocation {
    constructor(setX, setY) {
        this.presentActors = []
        this.x = setX;
        this.y = setY;
        this.cameFrom;
    }
}

export function updateWorldTable(worldMap) {
    if (document.getElementById("tableWrapper").children[0]) {
        document.getElementById("tableWrapper").children[0].remove();
    }

    document.getElementById("tableWrapper").append(createWorldTable(worldMap));
    document.getElementById("tableWrapper").children[0].addEventListener("click", clickHandler);
}
//initializes an empty worldMap with only the empty worldLocations
export function initializeWorldMap(length) {
    let worldMap=[]
    for (let i = 0; i < length; i++) {
        worldMap[i] = new Array(length);
        for (let ind = 0; ind < worldMap[i].length; ind++) {
            worldMap[i][ind] = new worldLocation(i, ind);
        }
    }
    return worldMap;
}

export function createWorldTable(worldMap) {
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
                    }
                }
                //display symbol of whichever actor has highest displayPriority
                tempData.innerHTML = topItem.mapSymbol;
            }
            myRows[itemIndex].append(tempData);
        });
    });
    myTable.append(...myRows);
    return myTable;
}

//accepts an array input with minx, maxx, miny, maxy
//returns in form [x,y]
export function generateRandomCoordinates(arr) {
    let x;
    let y;
    //if there is an array, generate coords within the bounds
    if (arr) {
        if (arr[0] < 0 || arr[2] < 0 || arr[1] > worldMap.length - 1 || arr[3] > worldMap.length - 1) {
            console.log("These bounds are out of this world!");
        }
        if (arr[0] > arr[1] || arr[2] > arr[3]) {
            console.log("min needs to be smaller than max")
        }
        x = Math.floor(Math.random() * (arr[1] - arr[0])) + arr[0];
        y = Math.floor(Math.random() * (arr[3] - arr[2])) + arr[2];
    } 
    //if there isn't an array, then generate within worldMap.length
    else {
        x = Math.floor(Math.random() * worldMap.length);
        y = Math.floor(Math.random() * worldMap.length);
    }
    return [x, y];
}

//call this to move an actor from its present spot (or non-spot) to another spot
export function actorPlace(worldMap, actor, x, y) {
    //test out of bounds
    if (x < 0 || x > worldMap.length - 1 || y < 0 || y > worldMap.length - 1) {
        console.log("Out of bounds error"+` [${x},${y}]`);
        return false;
    }
    //if the actor is somewhere, remove the actor from the listed location
    if (actor.location) {
        actor.location.presentActors.splice(actor.location.presentActors.indexOf(actor), 1);
    }
    //add the actor to the listed location
    worldMap[x][y].presentActors.push(actor);
    //set the actors listed location properly
    actor.location = worldMap[x][y];
}
//take given cell and display info in the box
export function displayCellContents(worldMap, cellX, cellY) {
    //adds class to selected cell for color
    let td=document.getElementById("tableWrapper").children[0].children[cellY].children[cellX]
    td.classList.add("selectedCell");
    
    //list for cell contents
    let contentList = document.getElementById("cellContents");
    let liList = [];
    //clear all child nodes
    while (contentList.firstChild) { contentList.removeChild(contentList.firstChild); }
    //make new nodes
    for (let i = 0; i < worldMap[cellX][cellY].presentActors.length; i++) {
        let li = document.createElement("p");
        li.innerText = worldMap[cellX][cellY].presentActors[i].displayString;
        liList.push(li);
    }
    //add new nodes
    contentList.append(...liList);
    //change the x,y thing
    document.getElementById("cellCoordinates").innerHTML = `(${cellX},${cellY})`;
}

