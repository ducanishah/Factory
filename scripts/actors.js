import {selectedActor, myWorldMap} from "./index.js"
import {actorPlace, updateWorldTable} from "./worldMap.js"
import {MoveSet, Move,TestMove, Produce} from "./moves.js"
import { displaySelectedActor } from "./helperScripts/inputsHandlers.js";
import {breadthFirstPathfindingToFrom,getAllActorsPathableToFrom,getClosestActorOfFrom, getDistFromTo} from "./pathfinding.js"
//constructor parameters: worldMap, x value, y value, display priority, name, symbol
//modify displayString on inheritees(?) to change what is displayed in display window
export class Actor {
    constructor(worldMap,xSet, ySet, dispPrior = 0, myName, mySymbol) {
        //in case of attempted spawn outside range
        if(!actorPlace(worldMap,this,xSet,ySet)){
            this.destroy(true);
            return;
        }
        worldMap.actorHolder.aliveActors.push(this);
        this._id=worldMap.getNextId();
        this.name = myName+`(${this._id})`;
        //IMPORTANT: must push self-containing properties to this list or displaying of actor will lead to infinite recursion!
        this.propertiesThatShouldNotBeDisplayed=["location", "mapParent", "propertiesThatShouldNotBeDisplayed", "name", "displayString", "mapSymbol"]
        this.mapSymbol = mySymbol;
        this.displayString=`${this.name} (${this.mapSymbol})`;
        this.displayPriority = dispPrior;
        this.location;
        this.alive=true;
        this.mapParent=worldMap;
        this.moveSet=new MoveSet(this);
        this.markedForDestruction=false;
        
    }
    //should be replaced in inheritees!
    autoQueue(){
        
    }
    destroy(isCollectionPhase){
        if(isCollectionPhase){
            this.alive=false;
            if(this.location){
                if(selectedActor[0]===this){
                    displaySelectedActor();
                }
                this.mapParent.actorHolder.aliveActors.splice(this.mapParent.actorHolder.aliveActors.indexOf(this),1);
                this.mapParent.logToRound(`${this.name} at ${this.location.x},${this.location.y} has been removed from their location.`)
                this.location.presentActors.splice(this.location.presentActors.indexOf(this),1);
                updateWorldTable(myWorldMap);
                this.mapParent.logToRound(`${this.name} at ${this.location.x},${this.location.y} has been destroyed.`)
            }
        } else if(this.markedForDestruction===false) {
            this.markedForDestruction=true;
            this.mapParent.actorHolder.markForDestruction(this);
            this.mapParent.logToRound(`${this.name} at ${this.location.x},${this.location.y} has been marked for destruction.`)
        }
    } 
}
//autoQueue called here
export class ActorHolder {
    constructor() {
        this.aliveActors = [];
        this.actorsToDestroy=[];
    }
    autoQueueMoves(){
        for(let i=0;i<this.aliveActors.length;i++){
            this.aliveActors[i].autoQueue();
        }
    }
    markForDestruction(actor){
        if(this.aliveActors.indexOf(actor)===-1){
            console.log(actor);
            console.log("That actor is not alive and present!");
            return;
        } else {
            this.actorsToDestroy.push(actor);
        }
    }
    destroyActors(){
        for(let i=this.actorsToDestroy.length-1;i>-1;i-=1){
            this.actorsToDestroy[i].destroy(true);
            this.actorsToDestroy.pop();
        }
        this.actorsToDestroy=[];
    }
}

export class Player extends Actor {
    constructor(setX, setY) {
        let dispPrior=2;
        super(setX, setY, dispPrior, "player", "P");
    }
}



export class OreProducer extends Actor{
    constructor(worldMap,setX, setY,dispPrior=1){
        super(worldMap,setX,setY,dispPrior,"Ore Producer","O+");
        this.moveSet.add(Produce)
        this.inventory=[];
    }
    autoQueue(){
        this.moveSet.queue("Produce",{toProduce:"Iron"})
    }
}

