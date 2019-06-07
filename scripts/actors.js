import {myActorHolder,actorPlace, sharesLocation} from "./index.js"

//constructor parameters: x value, y value, display priority, name, symbol
export class Actor {
    constructor(xSet, ySet, dispPrior = 0, myName, mySymbol) {
        this.name = myName;
        this.mapSymbol = mySymbol;
        this.displayPriority = dispPrior;
        this.location;
        myActorHolder.aliveActors.push(this);
        actorPlace(this, xSet, ySet);
    }
}

//Call update on this to have it call update AND postUpdate on all the actors
//put movement and stuff in update, checking for shared squares in postUpdate
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
}

export class Player extends Actor {
    constructor(setX, setY, dispPrior = 2) {
        super(setX, setY, dispPrior, "player", "P")
    }
    move(direction) {
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
        this.wander()
    }
    postUpdate() {
        if (sharesLocation(this, Player)) {
            console.log("Eek! A player!")
        }
    }
    wander() {
        let myDirection;
        switch (Math.ceil(Math.random() * 4)) {
            case (1):
                //up
                myDirection = [0, -1]
                break;
            case (2):
                //down
                myDirection = [0, 1]
                break;
            case (3):
                //left
                myDirection = [1, 0]
                break;
            case (4):
                //right
                myDirection = [-1, 0]
                break;
        }
        this.move(myDirection)
    }
    move(direction) {
        actorPlace(this, this.location.x + direction[0], this.location.y + direction[1]);
    }
}

export class Tree extends Actor {
    constructor(setX, setY, dispPrior = 0) {
        super(setX, setY, dispPrior, "tree", "T")
    }
}
