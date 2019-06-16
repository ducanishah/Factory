import {myActorHolder, sharesLocation, worldMap, playerChar} from "./index.js"
import {actorPlace} from "./worldMap.js"
import {breadthFirstPathfinding} from "./pathfinding.js"
//has a destroy function!
//constructor parameters: x value, y value, display priority, name, symbol
export class Actor {
    constructor(xSet, ySet, dispPrior = 0, myName, mySymbol) {
        this.name = myName;
        this.mapSymbol = mySymbol;
        this.displayPriority = dispPrior;
        this.location;
        this.alive=true;
        myActorHolder.aliveActors.push(this);
        if(actorPlace(this, xSet, ySet)===false){
            this.destroy();
        }
    }
    destroy (){
        this.alive=false;
        myActorHolder.aliveActors.splice(myActorHolder.aliveActors.indexOf(this),1);
        if(this.location){
            worldMap[this.location.x][this.location.y].presentActors.splice(
                worldMap[this.location.x][this.location.y].presentActors.indexOf(this),
                1
            )
        }
    }
}

//Call update on this to have it call update AND postUpdate on all the actors
//put movement and stuff in update, checking for shared squares in postUpdate
//call destroyAll on it to do exactly what you expect
export class ActorHolder {
    constructor() {
        this.aliveActors = [];
    }
    update() {
        for (let i = 0; i < this.aliveActors.length; i++) {
            if (this.aliveActors[i].update) { this.aliveActors[i].update(); }
        }
        for (let i = 0; i < this.aliveActors.length; i++) {
            if (this.aliveActors[i].postUpdate) { this.aliveActors[i].postUpdate(); }
        }
    }
    destroyAll(){
        this.destroyList=[];
        for(let i=0;i<this.aliveActors.length;i++){
            this.destroyList.push(this.aliveActors[i]);
        }
        for(let i=0;i<this.destroyList.length;i++){
            this.destroyList[i].destroy();
        }
        
            
    }
}

export class Player extends Actor {
    constructor(setX, setY, dispPrior = 2) {
        super(setX, setY, dispPrior, "player", "P")
    }
    move(direction) {
        if(this.alive===false){
            return;
        }
        switch (direction) {
            case "up":
                actorPlace(this, this.location.x, this.location.y - 1);
                break;
            case "down":
                actorPlace(this, this.location.x, this.location.y + 1)
                break;
            case "left":
                actorPlace(this, this.location.x - 1, this.location.y)
                break;
            case "right":
                actorPlace(this, this.location.x + 1, this.location.y)
                break;
            default:
                console.log("Why the fuck isn't there a direction for this move")
                break;
        }
    }
}

export class Goblin extends Actor {
    constructor(setX, setY, dispPrior = 1) {
        super(setX, setY, dispPrior, "goblin", "g");
    }
    update() {
        // this.wander()
        if(!sharesLocation(this,Player)){
            this.path=breadthFirstPathfinding(this.location, playerChar.location);
            actorPlace(this,this.path[0].x,this.path[0].y);
        }
        
    }
    postUpdate() {
        if (sharesLocation(this, Player)) {
            // console.log("Eek! A player!")
        }
    }
    // outdated wander and move function, uses array of direction not direct location
    // wander() {
    //     let myDirection;
    //     switch (Math.ceil(Math.random() * 4)) {
    //         case (1):
    //             //up
    //             myDirection = [0, -1]
    //             break;
    //         case (2):
    //             //down
    //             myDirection = [0, 1]
    //             break;
    //         case (3):
    //             //left
    //             myDirection = [1, 0]
    //             break;
    //         case (4):
    //             //right
    //             myDirection = [-1, 0]
    //             break;
    //     }
    //     this.move(myDirection)
    // }
    // move(direction) {
    //     actorPlace(this, this.location.x + direction[0], this.location.y + direction[1]);
    // }
}

export class Tree extends Actor {
    constructor(setX, setY, dispPrior = 0) {
        super(setX, setY, dispPrior, "tree", "T");
    }
}

export class Wall extends Actor {
    constructor (setX,setY, dispPrior=-1){
        super(setX,setY,dispPrior,"wall","W");
        this.isPassable=false;
    }
    postUpdate(){
        if(sharesLocation(this,Actor)){
            console.log("Someone's on the wall!");
        }
    }
}

export class Cave extends Actor {
    constructor(setX,setY,dispPrior=-1){
        super(setX,setY,dispPrior,"cave","C")
    }
}

export class TestObject extends Actor{
    constructor(setX,setY,dispPrior=3){
        super(setX,setY,dispPrior,"testObject","T");
        // console.log(getNeighborLocations(this.location))
    }
}