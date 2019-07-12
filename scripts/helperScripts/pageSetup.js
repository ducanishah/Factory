import { TestObject, Tree, Peasant, Huntsman } from "../actors.js"
import { displaySelectedActor, keydownHandler, addActorHandler, 
    selectActorHandler, runRoundHandler } from "./inputsHandlers.js"
import {myWorldMap} from "../index.js"

export function addBasicEventListeners() {
    document.addEventListener("keydown", keydownHandler);
    //for adding actors from the selected cell menu
    document.getElementById("addActorButton").addEventListener("click", addActorHandler);
    //for selecting an actor from the selected cell menu
    document.getElementById("cellContents").addEventListener("click", selectActorHandler);
    document.getElementById("logWorldMapButton").addEventListener("click",function(){console.log(myWorldMap);});
    document.getElementById("runRoundButton").addEventListener("click",runRoundHandler);
}

export function spawnInitialActors(worldMap) {
    
    new Peasant(worldMap,0,1,1);
    new Peasant (worldMap,1,0,1);
    new Huntsman(worldMap,0,0,1);
    new Peasant(worldMap,14,14,2);
    new Peasant(worldMap,14,13,2);
    new Peasant(worldMap,13,14,2);
    
    
}

//populates the addActorSelector with the given list of actors
export function populateAddActorList(actorList) {
    let addActorOptions = []
    Object.keys(actorList).forEach((key) => {
        let newActorOption = document.createElement("option");
        newActorOption.innerHTML = key;
        addActorOptions.push(newActorOption);
    })
    document.getElementById("addActorSelector").append(...addActorOptions);
}