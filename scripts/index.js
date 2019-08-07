import {  OreProducer  } from "./actors.js"
import { updateWorldTable,  WorldMap } from "./worldMap.js"
import { displaySelectedActor, fileInputHandler } from "./helperScripts/inputsHandlers.js"
import {checkFileReaderSupported} from "./helperScripts/fileReading.js"
import {spawnInitialActors,populateAddActorList, addBasicEventListeners} from "./helperScripts/pageSetup.js"
import {randomGenOn} from "./helperScripts/randomGeneration.js"

export var addableActorsList = { OreProducer }


document.addEventListener("DOMContentLoaded", main);

export var myWorldMap = [];
//assumed to be square
var worldMapLength = 32;
export var selectedCell = [];
//use array for actor to get around constancy of exports
export var selectedActor = [];



//the calls made when the page is loaded
function main() {
    console.log("Hit main")
    addBasicEventListeners();
    //if FileReader is supported, set up the handling. if not, tell me
    if (checkFileReaderSupported()) {
        document.getElementById("fileInput").addEventListener("change", fileInputHandler);
    } else {
        alert("The file APIs are not fully supported in this browser. Inputting maps isn't going to work, sorry.")
    }


    myWorldMap = new WorldMap(worldMapLength);
    randomGenOn(myWorldMap);
    //spawnInitialActors(myWorldMap);
    updateWorldTable(myWorldMap);
    populateAddActorList(addableActorsList);
}

//THIS HAS TO GO ON THIS PAGE IN ORDER TO MODIFY THE EXPORTED VARIABLE
export function setmyWorldMapAndRedisplay(map){
    myWorldMap=map;
    updateWorldTable(myWorldMap);
    displaySelectedActor();
}