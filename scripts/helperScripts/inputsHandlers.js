import { selectedCell, myWorldMap, logKeyDowns, addableActorsList, selectedActor, setmyWorldMapAndRedisplay } from "../index.js"
import { displayCellContents, updateWorldTable } from "../worldMap.js"
import {handleFileInput} from "../fileReading.js"

//for clicking on table cells
export function clickHandler(e) {
    //the displaying of a cell and messing with selectedCell value requires that there IS a cell clicked on
    if ((e.target.cellIndex || e.target.cellIndex === 0) && (e.target.parentElement.rowIndex || e.target.parentElement.rowIndex === 0)) {
        
        displayCellContents(myWorldMap, e.target.cellIndex,e.target.parentElement.rowIndex);
    }
}

//for double clicking on table cells
export function doubleClickHandler(e) {
    //requires that a cell have been clicked on
    if ((e.target.cellIndex || e.target.cellIndex === 0) && (e.target.parentElement.rowIndex || e.target.parentElement.rowIndex === 0)) {
        //if there's a top actor, display it
        if (myWorldMap.map[selectedCell[0]][selectedCell[1]].currentDisplayedActor) {
            displaySelectedActor(myWorldMap.map[selectedCell[0]][selectedCell[1]].currentDisplayedActor);
            displayCellContents(myWorldMap, selectedCell[0], selectedCell[1]);
        }

    }
}
//currently does nothing but logKeyDowns if you flip that global var
export function keydownHandler(e) {
    if (logKeyDowns) { console.log(e.code); }

}
//adds selected actor to the worldMap AND updates the world table
export function addActorHandler(e) {
    if (!selectedCell.length) {
        alert("You need to select a cell to add an actor!")
        return;
    }
    let chosenActor = addableActorsList[document.getElementById("addActorSelector").value];
    new chosenActor(myWorldMap, ...selectedCell)
    updateWorldTable(myWorldMap);
}
//used for selecting actor form the cell contents list
export function selectActorHandler(e) {
    //set selected Actor
    if (e.target.nodeName === "P") {
        //remove tint from any other nodes around
        for (let i = 0; i < document.getElementById("cellContents").children.length; i++) {
            let temp = document.getElementById("cellContents").children[i]
            if (temp.classList.contains("selected")) {
                temp.classList.remove("selected")
            }
        }
        e.target.classList.add("selected");
        //sets selected actor to selected actor

    } else { return; }


    displaySelectedActor(
        //gets actor
        myWorldMap.map[selectedCell[0]][selectedCell[1]].presentActors[
        //this gets the index of the selected node
        [...e.target.parentNode.children].indexOf(e.target)
        ]);
}

//displays selected actor! Has functions within functions!
//CALL WITHOUT ARGUMENT TO CLEAR SELECTED ACTOR
export function displaySelectedActor(actor) {
    let table = document.getElementById("tableWrapper").children[0];
    //just in case of mistakes, this will keep infinite recursion at bay
    let recursionLimit = 10;

    //in case of actor being selected in a way other than clicking
    if (selectedActor[0] && selectedActor[0] !== actor) {
        //so spawn display doesn't break
        if (table) {
            //clear class from previously selected actor's cell
            let previousActorLocation = selectedActor[0].location;
            table.children[previousActorLocation.y].children[previousActorLocation.x].classList.remove("containsSelectedActor");
        }
        selectedActor.pop();
        document.getElementById("selectedActorName").innerHTML = ("")
        let existingul = document.getElementById("selectedActorProperties")
        let newul=document.createElement("ul");
        newul.id="selectedActorProperties";
        existingul.parentNode.replaceChild(newul, existingul);
        displayActions();

    }
    if(actor && actor!==selectedActor[0]){
        selectedActor.push(actor);
        //add class to newly selected actor's cell
        if(table){
            table.children[actor.location.y].children[actor.location.x].classList.add("containsSelectedActor");
        }
        
    
        document.getElementById("selectedActorName").innerHTML = (
            `${selectedActor[0].name} (${selectedActor[0].location.x},${selectedActor[0].location.y})`
        )
    
        let existingul = document.getElementById("selectedActorProperties")
        
        let newul = createNestedListFrom(actor);
        existingul.parentNode.replaceChild(newul, existingul);
    
        displayActions(actor);
    }
    
    
    //RECURSIVE PROPERTY DISPLAYING!!!!!
    function createNestedListFrom(parent) {
        recursionLimit--;
        if (recursionLimit < 0) {
            alert("You forgot to exclude a self-containing property! Infinite recursion on actor display!")
            return;
        }
        let ul = document.createElement("ul");
        ul.id = "selectedActorProperties";

        //make sure property is not in list that should not be displayed!
        //(prevents infinite recursive loop)
        let keys = Object.keys(parent)
        if (parent.propertiesThatShouldNotBeDisplayed !== undefined) {
            keys = keys.filter(
                key => {
                    return (parent.propertiesThatShouldNotBeDisplayed.indexOf(key) === -1)
                }
            )
        }

        let elementList = [];
        for (let i = 0; i < keys.length; i++) {
            let li = document.createElement("li");
            li.innerHTML = `${keys[i]}: `
            //makes a new list if needed
            if (typeof parent[keys[i]] === "object") {
                li.append(createNestedListFrom(parent[keys[i]]));
                //make the element if no new list needed
            } else {
                li.innerHTML += `${parent[keys[i]]}`;
            }
            elementList.push(li);
        }
        ul.append(...elementList);
        return ul;
    }

    function displayActions(actor) {
        //empty the thing
        let actionsWrapper = document.getElementById("selectedActorActions");
        while (actionsWrapper.firstChild) {
            actionsWrapper.removeChild(actionsWrapper.firstChild);
        }
        if (actor && actor.moveSet) {
            let moveButtons = [];
            for (let i = 0; i < actor.moveSet.moves.length; i++) {
                if (actor.moveSet.moves[i].enabled === true) {
                    let newMoveButton = document.createElement("button");
                    newMoveButton.innerText = actor.moveSet.moves[i].name;
                    newMoveButton.onclick = actor.moveSet.moves[i].addToQueue;
                    moveButtons.push(newMoveButton);
                }
            }

            actionsWrapper.append(...moveButtons);
        }
    }

}

//sets myWorldMap to the created map; redisplays it
export async function fileInputHandler(e){
    let map= await handleFileInput(e);
    setmyWorldMapAndRedisplay(map);    
}

//call without arguments to clear move queue display
export function displayMoveQueue(moveQueue){
    let holder= document.getElementById("moveQueue");
    while(holder.firstChild){
        holder.removeChild(holder.firstChild);
    }
    if(moveQueue){
        for(let i=0; i<moveQueue.queue.length; i++){
            let p=document.createElement("p");
            p.innerHTML=moveQueue.queue[i].name+",";
            holder.append(p);
        }
    }
    
}

export function executeMoveQueueHandler(){
    myWorldMap.moveQueue.execute();
}