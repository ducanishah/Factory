import { updateWorldTable, actorPlace } from "./worldMap.js"
import { myWorldMap, selectedCell } from "./index.js";
import { displayMoveQueue } from "./helperScripts/inputsHandlers.js";


export class MoveQueue {
    constructor (worldMapParent){
        this.queue=[];
        this.worldMapParent=worldMapParent;
    }
    add(move){
        if(this.queue.indexOf(move)===-1){
            this.queue.push(move);
        } else {
            alert("Move already in queue!")
        }

    }
    execute(){
        for (let i=0; i<this.queue.length;i++){
            this.queue[i].execute();
        }
        this.queue.length=0;
        displayMoveQueue();
    }
}

export class MoveSet {
    constructor(actorForContext) {
        this.propertiesThatShouldNotBeDisplayed = ["propertiesThatShouldNotBeDisplayed", "context"];
        this.context = actorForContext;
        this.moves = [];
    }
    add(moveToAdd) {
        this.moves.push(new moveToAdd(this.context));
    }
    queue(moveToQueueName){
        let moveNamesList=this.moves.map(value=>value.name)
        
        if(moveNamesList.indexOf(moveToQueueName)===-1){
            alert("That move is not in this MoveSet!")
        } else {
            this.moves[moveNamesList.indexOf(moveToQueueName)].addToQueue();
        }
    }
}

export class Move {
    constructor(actorForContext, name) {
    this.propertiesThatShouldNotBeDisplayed = ["propertiesThatShouldNotBeDisplayed", "context","execute","addToQueue"];
        this.context = actorForContext;
        this.name = name || "Move";
        if(this.name==="Move"){alert("THIS MOVE NEEDS IT's OWN NAME!!!")}
        // this.display=false;
        this.enabled = true; 
        this.execute = this.execute.bind(this.context);
        this.addToQueue=this.addToQueue.bind(this);
    }
    execute() {
        alert(`Oy! This move should have it's own execute!`);
    }
    
    addToQueue(){
        this.context.mapParent.moveQueue.add(this);
        displayMoveQueue(this.context.mapParent.moveQueue);
    }
}

export class TestMove extends Move {
    constructor(actorForContext) {
        super(actorForContext, "TestMove");
        // this.display=true;

    }
    execute() {
        if(!this.alive){return;}
        this.destroy();

    }
}

export class ShiftOneSpace extends Move {
    constructor(actorForContext) {
        super(actorForContext, "Shift");
    }
    execute() {
        if(!this.alive){return;}
     console.log("shifting!")   
    }
}

