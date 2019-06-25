document.addEventListener("DOMContentLoaded", main);
document.addEventListener("keydown", keydownHandler);
// document.getElementById("addActorButton").addEventListener("click",addActorHandler);
import { Actor, ActorHolder, Goblin, Tree } from "./actors.js"
import { updateWorldTable, initializeWorldMap, displayCellContents } from "./worldMap.js"
//TODOS IN COMMENTS


export var myActorHolder = new ActorHolder();
export var playerChar;
export var worldMap = [];
//assumed to be square
export var worldMapLength = 16;
var logKeyDowns = false;
export var selectedCell=[];

//the calls made when the page is loaded
function main() {
    console.log("Hit main")
    initializeWorldMap();
    spawnInitialActors();
    updateWorldTable();
}

function spawnInitialActors() {
    new Tree(0,0)
}

function keydownHandler(e) {
    if (logKeyDowns) { console.log(e.code); }

}

//for clicking on table cells
//Used in worldMap
export function clickHandler(e) {
    // console.log(`location: (${e.target.cellIndex},${e.target.parentElement.rowIndex})`);
    if ((e.target.cellIndex||e.target.cellIndex===0) && (e.target.parentElement.rowIndex||e.target.parentElement.rowIndex===0)) {
        //clear tint from last selected cell
        if(selectedCell.length){
            let td=document.getElementById("tableWrapper").children[0].children[selectedCell[1]].children[selectedCell[0]];
            td.classList.remove("selectedCell");
        }
        selectedCell= [e.target.cellIndex, e.target.parentElement.rowIndex];
        //Tint the selected cell
        e.target.classList.add("selectedCell");
        displayCellContents(...selectedCell);
    }
}
