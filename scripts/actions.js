import { updateWorldTable, actorPlace } from "./worldMap.js"
import { myWorldMap, selectedCell } from "./index.js";


export class MoveSet {
    constructor(actorForContext) {
        this.propertiesThatShouldNotBeDisplayed = ["propertiesThatShouldNotBeDisplayed", "context"];
        this.context = actorForContext;
        this.moves = [];
    }
    add(moveToAdd) {
        this.moves.push(new moveToAdd(this.context));
    }
}

//make sure you have an execute function in inheritees DISREGARDS FIRST ARG AS e
export class Move {
    constructor(actorForContext, name) {
        this.propertiesThatShouldNotBeDisplayed = ["propertiesThatShouldNotBeDisplayed", "context"];
        this.context = actorForContext;
        this.name = name || "Move";
        // this.display=false;
        this.enabled = true;
        //Binds execute to context
        this.execute = this.execute.bind(this.context);
    }
    //takes e because it is likely to be called off of an event
    execute(e) {
        alert(`Oy! This move should have it's own execute!`);
    }
}

export class TestMove extends Move {
    constructor(actorForContext) {
        super(actorForContext, "TestMove");
        // this.display=true;

    }
    execute(e) {

        alert("TestMove worked!")

    }
}

export class ShiftOneSpace extends Move {
    constructor(actorForContext) {
        super(actorForContext, "Shift");
    }
    execute(e) {
        if ( 
            selectedCell.length&&
            myWorldMap[selectedCell[0]][selectedCell[1]] !== this.location &&
            (
                //test for one away
                Math.abs(myWorldMap[selectedCell[0]][selectedCell[1]].x - this.location.x) + Math.abs(myWorldMap[selectedCell[0]][selectedCell[1]].y - this.location.y)===1
            )
        ) {
            actorPlace(myWorldMap,this,selectedCell[0],selectedCell[1]);
            updateWorldTable(myWorldMap);
        } else {
            alert("You can only shift that one space!/select a cell!")
        }   
    }
}