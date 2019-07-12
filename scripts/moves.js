import { updateWorldTable, actorPlace } from "./worldMap.js"
import { myWorldMap, selectedCell,selectedActor } from "./index.js";
import { displaySelectedActor, fileInputHandler } from "./helperScripts/inputsHandlers.js";


export class MoveQueue {
    constructor (worldMapParent){
        this.propertiesThatShouldNotBeDisplayed=["propertiesThatShouldNotBeDisplayed","worldMapParent"]
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
        updateWorldTable(this.worldMapParent);
        displaySelectedActor(selectedActor[0]);
    }
    emptyQueue(){
        this.queue.length=0;
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
    queue(moveToQueueName, paramArguments){
        let moveNamesList=this.moves.map(value=>value.name)
        
        if(moveNamesList.indexOf(moveToQueueName)===-1){
            alert("That move is not in this MoveSet!")
        } else {
            this.moves[moveNamesList.indexOf(moveToQueueName)].addToQueue();
            this.moves[moveNamesList.indexOf(moveToQueueName)].moveArguments=paramArguments;
            this.context.mapParent.logToRound(`${this.context.name} at ${this.context.location.x},${this.context.location.y} queued ${moveToQueueName} with arguments:`);
            this.context.mapParent.logToRound(paramArguments);
        }
    }
}

export class Move {
    constructor(actorForContext, name) {
    this.propertiesThatShouldNotBeDisplayed = ["propertiesThatShouldNotBeDisplayed", "context","execute","addToQueue","moveArguments"];
        this.context = actorForContext;
        this.name = name || "Move";
        if(this.name==="Move"){alert("THIS MOVE NEEDS IT's OWN NAME!!!")}
        //set when added to queue
        this.moveArguments={};
        // this.display=false;
        this.enabled = true; 
        this.execute = this.execute.bind(this);
        this.addToQueue=this.addToQueue.bind(this);
        
    }
    execute() {
        alert(`Oy! This move should have it's own execute!`);
    }
    
    addToQueue(){
        this.context.mapParent.moveQueue.add(this);
    }
}

export class TestMove extends Move {
    constructor(actorForContext) {
        super(actorForContext, "TestMove");
        // this.display=true;

    }
    execute() {
        console.log(this.moveArguments)
        if(!this.context.alive){return;}
        this.context.destroy();

    }
}

export class ShiftOneSpace extends Move {
    constructor(actorForContext) {
        super(actorForContext, "ShiftOneSpace");
    }
    execute() {
        if(this.moveArguments.target){
            actorPlace(this.context.mapParent,this.context,this.moveArguments.target.x,this.moveArguments.target.y)
        }
    }
}

export class Attack extends Move{
    constructor(actorForContext){
        super(actorForContext,"Attack");
        this.damage=1;
    }
    execute(){
        if(this.moveArguments.target){
            this.context.mapParent.logToRound(`${this.context.name} at ${this.context.location.x},${this.context.location.y} is executing an attack against ${this.moveArguments.target.name} at ${this.moveArguments.target.location.x},${this.moveArguments.target.location.y} with ${this.damage} damage`);
            this.moveArguments.target.dealDamage(this.damage);
        } else {
            alert("No target provided!")
        }
    }
}
