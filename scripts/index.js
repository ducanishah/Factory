import { Actor, ActorHolder, Goblin, Tree, TestObject } from "./actors.js"
import { updateWorldTable, initializeWorldMap, WorldMap } from "./worldMap.js"
import { keydownHandler, addActorHandler, selectActorHandler, displaySelectedActor, fileInputHandler, executeMoveQueueHandler, displayMoveQueue } from "./helperScripts/inputsHandlers.js"
import {checkFileReaderSupported} from "./helperScripts/fileReading.js"
import {spawnInitialActors,populateAddActorList, addBasicEventListeners} from "./helperScripts/pageSetup.js"

export var addableActorsList = { Goblin, Tree, TestObject }


document.addEventListener("DOMContentLoaded", main);



export var myWorldMap = [];
//assumed to be square
var worldMapLength = 16;
export var logKeyDowns = false;
export var selectedCell = [];
//use array for actor to get around constancy of exports
export var selectedActor = [];

document.getElementById("logWorldMapButton").addEventListener("click",function(){console.log(myWorldMap);});
document.getElementById("autoQueueMovesButton").addEventListener("click", function(){myWorldMap.autoQueueMoves()})


//the calls made when the page is loaded
function main() {
    console.log("Hit main")
    addBasicEventListeners();
    //if FileReader is supported, set up the handling. if not, tell me
    if (checkFileReaderSupported()) {
        document.getElementById("fileInput").addEventListener("change", fileInputHandler);
    } else {
        alert("The file APIs are not fully supported here. Inputting maps isn't going to work, sorry.")
    }


    myWorldMap = new WorldMap(worldMapLength);
    spawnInitialActors(myWorldMap);
    updateWorldTable(myWorldMap);
    populateAddActorList(addableActorsList);
}



//THIS HAS TO GO ON THIS PAGE IN ORDER TO MODIFY THE EXPORTED VARIABLE
export function setmyWorldMapAndRedisplay(map){
    myWorldMap=map;
    updateWorldTable(myWorldMap);
    displaySelectedActor();
    displayMoveQueue(myWorldMap.moveQueue);
}