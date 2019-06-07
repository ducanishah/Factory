import {myActorHolder,actorPlace} from "./index.js"

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