//needed for hooking onto the world table when world table is updated
import { clickHandler, doubleClickHandler } from "./helperScripts/inputsHandlers.js"
import {selectedCell, myWorldMap, selectedActor} from "./index.js"
import { ActorHolder } from "./actors.js";
import { MoveQueue } from "./moves.js";



export class WorldMap{
    constructor(length){
        this.map=initializeWorldMap(this,length);
        this.actorHolder=new ActorHolder();
        this.moveQueue=new MoveQueue(this);
    }
    autoQueueMoves(){
        //just passes on the commands lol
        this.moveQueue.emptyQueue()
        this.actorHolder.autoQueueMoves();
    }
    executeMoveQueue(){
        //same as above lol
        this.moveQueue.execute();
    }
    runRound(){
        this.autoQueueMoves();
        this.executeMoveQueue()
    }
}

//x,y
//has: presentActor,x,y,cameFrom,currentDisplayedActor
export class WorldLocation {
    constructor(worldMap,setX, setY) {
        this.presentActors = [];
        this.mapParent=worldMap;
        this.x = setX;
        this.y = setY;
        this.cameFrom;
        this.currentDisplayedActor;
    }
}

//updates worldTable AND redisplays selected cell
export function updateWorldTable(worldMap) {
    if (document.getElementById("tableWrapper").children[0]) {
        document.getElementById("tableWrapper").children[0].remove();
    }

    document.getElementById("tableWrapper").append(createWorldTable(worldMap));
    //for displaying cell contents
    document.getElementById("tableWrapper").children[0].addEventListener("click", clickHandler);
    //for selecting actor by doubleclick
    document.getElementById("tableWrapper").children[0].addEventListener("dblclick", doubleClickHandler)
    if(selectedCell.length){
        displayCellContents(myWorldMap,...selectedCell);
    }
}
//initializes an empty worldMap with only the empty WorldLocations
export function initializeWorldMap(parentWorldMap,length) {
    let worldMap=[]
    for (let i = 0; i < length; i++) {
        worldMap[i] = new Array(length);
        for (let ind = 0; ind < worldMap[i].length; ind++) {
            worldMap[i][ind] = new WorldLocation(parentWorldMap,i, ind);
        }
    }
    return worldMap;
}

export function createWorldTable(worldMap) {
    let myTable = document.createElement("table");
    let myRows = new Array(worldMap.map.length);
    for (let i = 0; i < myRows.length; i++) {
        myRows[i] = document.createElement("tr")
    }
    //create the tds
    worldMap.map.forEach((subArray, subArrayIndex) => {
        subArray.forEach((item, itemIndex) => {
            let newtd = document.createElement("td");
            if (item.presentActors.length) {
                let topActor;
                for (let i = 0; i < item.presentActors.length; i++) {
                    
                    if(item.presentActors[i]===selectedActor[0]){
                        newtd.classList.add("containsSelectedActor")
                    }

                    if (!topActor || item.presentActors[i].displayPriority > topActor.displayPriority) {
                        topActor = item.presentActors[i];
                    }
                }
                item.currentDisplayedActor=topActor;
                //display symbol of whichever actor has highest displayPriority
                newtd.innerHTML = topActor.mapSymbol;
                
            } else {
                item.currentDisplayedActor=undefined;
            }
            
            
            myRows[itemIndex].append(newtd);
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
        if (arr[0] < 0 || arr[2] < 0 || arr[1] > worldMap.map.length - 1 || arr[3] > worldMap.map.length - 1) {
            console.log("These bounds are out of this world!");
        }
        if (arr[0] > arr[1] || arr[2] > arr[3]) {
            console.log("min needs to be smaller than max")
        }
        x = Math.floor(Math.random() * (arr[1] - arr[0])) + arr[0];
        y = Math.floor(Math.random() * (arr[3] - arr[2])) + arr[2];
    } 
    //if there isn't an array, then generate within worldMap.map.length
    else {
        x = Math.floor(Math.random() * worldMap.map.length);
        y = Math.floor(Math.random() * worldMap.map.length);
    }
    return [x, y];
}

//call this to move an actor from its present spot (or non-spot) to another spot
export function actorPlace(worldMap, actor, x, y) {
    //test out of bounds
    if (x < 0 || x > worldMap.map.length - 1 || y < 0 || y > worldMap.map.length - 1) {
        console.log("Out of bounds error"+` [${x},${y}]`);
        return false;
    }
    //if the actor is somewhere, remove the actor from the listed location
    if (actor.location) {
        actor.location.presentActors.splice(actor.location.presentActors.indexOf(actor), 1);
    }
    //add the actor to the listed location
    worldMap.map[x][y].presentActors.push(actor);
    //set the actors listed location properly
    actor.location = worldMap.map[x][y];
    actor.mapParent=worldMap;
}
//take given cell and display info in the box AND if the cell contains the selected actor, highlights it
export function displayCellContents(worldMap, cellX, cellY) {
    
    //clear tint from last selected cell (if one exists)
    if (selectedCell.length) {
        let td = document.getElementById("tableWrapper").children[0].children[selectedCell[1]].children[selectedCell[0]];
        td.classList.remove("selectedCell");
    }
    selectedCell.length = 0;
    selectedCell.push(cellX, cellY);
    
    //adds class to selected cell for color
    let td=document.getElementById("tableWrapper").children[0].children[cellY].children[cellX]
    td.classList.add("selectedCell");
    
    //list for cell contents
    let contentList = document.getElementById("cellContents");
    let liList = [];
    //clear all child nodes
    while (contentList.firstChild) { contentList.removeChild(contentList.firstChild); }
    //make new nodes
    for (let i = 0; i < worldMap.map[cellX][cellY].presentActors.length; i++) {
        let li = document.createElement("p");
        li.innerText = worldMap.map[cellX][cellY].presentActors[i].displayString;
        if(worldMap.map[cellX][cellY].presentActors[i]===selectedActor[0]){
            li.classList.add("selected");
        }
        liList.push(li);
    }
    //add new nodes
    contentList.append(...liList);
    //change the x,y thing
    document.getElementById("selectedCellCoordinates").innerHTML = `(${cellX},${cellY})`;
    
}

//checks if a target location contains a non-passable actor (e.g. a wall)
export function testIsPassable(location){
    
    let targetLocationActors=location.presentActors;
    for (let i=0; i<targetLocationActors.length;i++){
        if (targetLocationActors[i].isPassable===false){
            return false;
        }
    }
    return true;
}
//Accepts the location object, returns location objects
export function getNeighborLocations(location) {
    let coordsToTest = [
        [location.x + 1, location.y],
        [location.x - 1, location.y],
        [location.x, location.y + 1],
        [location.x, location.y - 1]
    ]
    let neighbors = [];
    for (let i = 0; i < coordsToTest.length; i++) {
        if (location.mapParent.map[coordsToTest[i][0]] && location.mapParent.map[coordsToTest[i][0]][coordsToTest[i][1]]) {
            neighbors.push(location.mapParent.map[coordsToTest[i][0]][coordsToTest[i][1]]);
        }
    }
    return neighbors;
}