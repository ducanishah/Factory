document.addEventListener("DOMContentLoaded", main);
document.addEventListener("keydown", keydownHandler);
document.getElementById("addActorButton").addEventListener("click",addActorHandler);
import { Actor, ActorHolder, Player, Goblin, Tree, Wall, Cave, TestObject } from "./actors.js"
//REMEMBER TO UPDATE THE ACTORLIST AND TRANSLATOR
var actorList=[
    Goblin,
    Tree,
    Wall,
    Cave,
    TestObject
];
var actorMapTranslator={
    Goblin,
    Tree,
    Wall,
    Cave,
    TestObject
}
import { updateWorldTable, initializeWorldMap, createWorldTable, worldLocation, displayCellContents } from "./worldMap.js"
import {generateRandomCoordinates, generateRandomPassableCoordinates, actorPlace} from "./worldMap.js"
import {checkFileReaderSupported, handleFileInput} from "./fileReading.js"
import { breadthFirstPathfindingToActorWithTestFunction } from "./pathfinding.js";
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
    // console.log(new Person().alive);
    //if FileReader is supported, set up the handling. if not, tell me
    if(checkFileReaderSupported()){
        document.getElementById("fileInput").addEventListener("change", fileInputHandler);
    } else{
        alert("The file APIs are not fully supported here. Inputting maps isn't going to work, sorry.")
    }
    populateAddActorList();
    initializeWorldMap();
    spawnInitialActors();
    updateWorldTable();
    // console.log(playerChar instanceof Player)
}
//what it says on the tin
function spawnInitialActors() {

    new Cave(0,0,0);
    new Cave(15,0,1);



    //let place = generateRandomCoordinates();
    // new Cave(...generateRandomPassableCoordinates());
    // new Wall(...generateRandomCoordinates());
    // playerChar = new Player(8, 8);
    // new Goblin(...generateRandomPassableCoordinates());
    // new Tree(...generateRandomPassableCoordinates());
}
//populates the selector with all actors in the list
function populateAddActorList(){
    let addActorOptions=[];
    for(let i=0;i<actorList.length;i++){
        let newActorOption=document.createElement("option");
        newActorOption.innerHTML=actorList[i].name;
        addActorOptions.push(newActorOption);
    }
    document.getElementById("addActorSelector").append(...addActorOptions);
}
//THERE ARE UPDATE CALLS IN HERE
export function keydownHandler(e) {
    if (logKeyDowns) { console.log(e.code); }
    if(playerChar){
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
            case "MetaLeft":
            case "ControlLeft":
                return;
                break;
            default:
                break;
        }
    }
    myActorHolder.update();
    updateWorldTable();
}
//for clicking on table cells
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
//for adding actors to the world map with the button 
function addActorHandler(e){
    let chosenActor=actorList[document.getElementById("addActorSelector").selectedIndex];
    new chosenActor(...selectedCell);
    updateWorldTable();
    displayCellContents(...selectedCell);
}
//this is where the fileInput is handled WORLDMAP IS CLEARED AND REMADE
async function fileInputHandler(e){
    let map=await handleFileInput(e);
    initializeWorldMap();
    //kill all the existing actors!
    myActorHolder.destroyAll();
    updateWorldMapFromInputMap(map);
    updateWorldTable();
}

//checks if given actor shares its location with any actor of a given class that passes testFunction. 
//IMPORTANT: testFunction MUST use arrow notation to avoid creating its own 'this'
//Excludes self. returns given actor or false.
export function sharesLocation(actor, typeToLookFor, testFunction) {
    testFunction = testFunction || function(){return true;}
    for (let i = 0; i < actor.location.presentActors.length; i++) {
        if (actor.location.presentActors[i] instanceof typeToLookFor && actor.location.presentActors[i] != actor && testFunction(actor.location.presentActors[i]===true)) {
            return actor.location.presentActors[i];
        }
    }
    return false;
}
//checks if a given location contains any actor of a given class, returns said actor or false
export function locationContainsType(location,typeToLookFor){
    for(let i=0; i<location.presentActors.length;i++){
        if(location.presentActors[i] instanceof typeToLookFor){
            return location.presentActors[i];
        }
    }
    return false;
}

//checks if a target coordinate location is passable
export function testIsPassable(targetX,targetY){
    if((!targetX&&targetX!=0) || (!targetY&&targetY!=0)){
        console.log(targetX+" "+targetY)
        console.log("isPassable takes target coordinates!")
        return;
    }
    let targetLocationActors=worldMap[targetX][targetY].presentActors;
    for (let i=0; i<targetLocationActors.length;i++){
        if (targetLocationActors[i].isPassable===false){
            return false;
        }
    }
    return true;
}
//instantiates objects based on the input map
export function updateWorldMapFromInputMap(map){
    for(let i=0; i<map.length;i++){
        for(let j=0; j<map[i].length;j++){
            if(map[i][j]){
                let myObject=actorMapTranslator[map[i][j]];
                new myObject(i,j)
            }
            
        }
    }
}
