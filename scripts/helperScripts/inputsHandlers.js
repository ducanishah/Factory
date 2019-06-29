import { selectedCell, myWorldMap, logKeyDowns, addableActorsList, selectedActor } from "../index.js"
import { displayCellContents, updateWorldTable } from "../worldMap.js"

//for clicking on table cells
export function clickHandler(e) {
    //the displaying of a cell and messing with selectedCell value requires that there IS a cell clicked on
    if ((e.target.cellIndex || e.target.cellIndex === 0) && (e.target.parentElement.rowIndex || e.target.parentElement.rowIndex === 0)) {
        //clear tint from last selected cell (if one exists)
        if (selectedCell.length) {
            let td = document.getElementById("tableWrapper").children[0].children[selectedCell[1]].children[selectedCell[0]];
            td.classList.remove("selectedCell");
        }
        selectedCell.length = 0;
        selectedCell.push(e.target.cellIndex, e.target.parentElement.rowIndex);
        //Tint the selected cell border
        // e.target.classList.add("selectedCell");
        displayCellContents(myWorldMap, ...selectedCell);
    }
}

//for double clicking on table cells
export function doubleClickHandler(e){
    //requires that a cell have been clicked on
    if ((e.target.cellIndex || e.target.cellIndex === 0) && (e.target.parentElement.rowIndex || e.target.parentElement.rowIndex === 0)) {
        //if there's a top actor, display it
        if(myWorldMap[selectedCell[0]][selectedCell[1]].currentDisplayedActor){
            displaySelectedActor(myWorldMap[selectedCell[0]][selectedCell[1]].currentDisplayedActor);
            displayCellContents(myWorldMap,selectedCell[0],selectedCell[1]);
        }
        
    }
}



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
        //remove selected actor if it exists
        if (selectedActor.length) {
            selectedActor.pop()
        }
        //sets selected actor to selected actor
        selectedActor.push(
            //gets actor
            myWorldMap[selectedCell[0]][selectedCell[1]].presentActors[
            //this gets the index of the selected node
            [...e.target.parentNode.children].indexOf(e.target)
            ]
        )
    } else { return; }
    displaySelectedActor(selectedActor[0]);
}

//displays selected actor!
export function displaySelectedActor(actor) {
    //in case of actor being selected in a way other than clicking
    if(selectedActor[0]!==actor){
        selectedActor.pop();
        selectedActor.push(actor);
    }
    document.getElementById("selectedActorName").innerHTML = (
        `${selectedActor[0].name} (${selectedActor[0].location.x},${selectedActor[0].location.y})`
    )

    let existingul = document.getElementById("selectedActorProperties")
    //just in case of mistakes, this will keep infinite recursion at bay
    let recursionCounter = 0;

    let newul = createNestedListFrom(actor);

    existingul.parentNode.replaceChild(newul, existingul);



    //RECURSIVE PROPERTY DISPLAYING!!!!!
    function createNestedListFrom(parent) {
        recursionCounter++;
        if (recursionCounter > 5) {
            alert("You forgot to exclude a self-containing property! Infinite recursion on actor display! (loops>5)")
            return;
        }
        let ul = document.createElement("ul");
        ul.id = "selectedActorProperties";

        //make sure property is not in list that should not be displayed!
        //(prevents infinite recursive loop)
        let keys = Object.keys(parent)
        if(parent.propertiesThatShouldNotBeDisplayed!==undefined){
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
}