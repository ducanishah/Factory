import {selectedActor, myWorldMap} from "./index.js"
import {actorPlace, updateWorldTable} from "./worldMap.js"
import {MoveSet, Move,TestMove,ShiftOneSpace, Attack} from "./moves.js"
import { displaySelectedActor } from "./helperScripts/inputsHandlers.js";
import {breadthFirstPathfindingToFrom,getAllActorsPathableToFrom,getClosestActorOfFrom, getDistFromTo} from "./pathfinding.js"
//constructor parameters: worldMap, x value, y value, display priority, name, symbol
//modify displayString on inheritees(?) to change what is displayed in display window
export class Actor {
    constructor(worldMap,xSet, ySet, dispPrior = 0, myName, mySymbol) {
        //IMPORTANT: must push self-containing properties to this list or displaying of actor will lead to infinite recursion!
        this.propertiesThatShouldNotBeDisplayed=["location", "mapParent", "propertiesThatShouldNotBeDisplayed", "name", "displayString", "mapSymbol"]
        this.mapSymbol = mySymbol;
        this.displayPriority = dispPrior;
        this.location;
        this.alive=true;
        this.mapParent=worldMap;
        this.moveSet=new MoveSet(this);
        this.markedForDestruction=false;
        //in case of attempted spawn outside range
        if(!actorPlace(worldMap,this,xSet,ySet)){
            this.destroy(true);
            return;
        }
        worldMap.actorHolder.aliveActors.push(this);
        this._id=worldMap.getNextId();
        this.name = myName+`(${this._id})`;
        this.displayString=`${this.name} (${this.mapSymbol})`
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
//runs after nearest of differing team and attacks
export class Peasant extends Actor {
    constructor(worldMap, setX, setY, team) {
        let dispPrior=1;
        super(worldMap, setX, setY, dispPrior, "peasant", "p");
        this.moveSet.add(ShiftOneSpace);
        this.moveSet.add(Attack);
        this.team=team || 0;
        this.health=5;
    }
    autoQueue(){
        let target= getClosestActorOfFrom(getAllActorsPathableToFrom(this).filter(
            (actor)=>{
                if(actor.team&& actor.team!==this.team){return true;} else return false;
            }),this)
        if(target){
            //if target is in range (in this case one square), queue the attack move
            if(getDistFromTo(target,this)<=1){
                this.moveSet.queue("Attack", {target:target});
                return;
            }
            let firstStepOnPath=breadthFirstPathfindingToFrom(this.location,target.location)[0];
            this.moveSet.queue("ShiftOneSpace",{target:firstStepOnPath});
            return;
        } else {
            this.mapParent.logToRound(`Peasant at ${this.location.x},${this.location.y} has no target and queued no action.`)
        }
    }
    //actually is for this taking damage, it makes sense in use
    dealDamage(damage){
        this.health-=damage;
        this.mapParent.logToRound(`Peasant(${this._id}) at ${this.location.x},${this.location.y} suffered ${damage} damage, bringing its health to ${this.health}`)
        if(this.health<=0){
            this.destroy();
        }
    }
}

//runs after nearest of differing team and attacks
export class Huntsman extends Actor {
    constructor(worldMap, setX, setY, team) {
        let dispPrior=1;
        super(worldMap, setX, setY, dispPrior, "huntsman", "h");
        this.moveSet.add(ShiftOneSpace);
        this.moveSet.add(Attack);
        this.team=team || 0;
        this.health=3;
    }
    autoQueue(){
        let target= getClosestActorOfFrom(getAllActorsPathableToFrom(this).filter(
            (actor)=>{
                if(actor.team&& actor.team!==this.team){return true;} else return false;
            }),this)
        if(target){
            //if target is in range (in this case one square), queue the attack move
            if(getDistFromTo(target,this)<=3){
                this.moveSet.queue("Attack", {target:target});
                return;
            }
            let firstStepOnPath=breadthFirstPathfindingToFrom(this.location,target.location)[0];
            this.moveSet.queue("ShiftOneSpace",{target:firstStepOnPath});
            return;
        } else {
            this.mapParent.logToRound(`Hunter at ${this.location.x},${this.location.y} has no target and queued no action.`)
        }
    }
    //actually is for this taking damage, it makes sense in use
    dealDamage(damage){
        this.health-=damage;
        this.mapParent.logToRound(`Hunter(${this._id}) at ${this.location.x},${this.location.y} suffered ${damage} damage, bringing its health to ${this.health}`)
        if(this.health<=0){
            this.destroy();
        }
    }
}





export class Tree extends Actor {
    constructor(worldMap, setX, setY) {
        let dispPrior=0
        super(worldMap, setX, setY, dispPrior, "tree", "T");
    }
}

export class TestObject extends Actor{
    constructor(worldMap,setX,setY){
        let dispPrior=2;
        super(worldMap,setX,setY,dispPrior,"testObject","tO");
        this.moveSet.add(TestMove);
    }
    // autoQueue(){
    //     console.log(getAllActorsPathableToFrom(this))
    //     let firstStepOnPath=breadthFirstPathfindingToFrom(this.location,this.mapParent.map[0][0])[0];
    //     if(firstStepOnPath){
    //         this.moveSet.queue("ShiftOneSpace",{target:firstStepOnPath});
    //     }
    // }
}

export class Wall extends Actor{
    constructor(worldMap,setX,setY){
        let dispPrior=-1;
        super(worldMap,setX,setY,dispPrior,"wall","W");
        this.isPassable=false;
    }
}