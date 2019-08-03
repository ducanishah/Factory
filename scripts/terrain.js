import { getNeighborLocations } from "./worldMap.js";
import { randomNumberBetween } from "./helperScripts/randomGeneration.js";

export class Terrain {
    constructor(worldMap) {
        this.mapParent = worldMap;
        this.name = "You forgot to name the child, probs color too"
        this.color = "black";
    }
}

export class Grassland extends Terrain {
    constructor(worldMap) {
        super(worldMap);
        this.name = "Grassland"
        this.color = "lightgreen"
    }
}

export class Mountain extends Terrain {
    constructor(worldMap) {
        super(worldMap);
        this.name = "Mountain";
        this.color = "grey";
    }
}

export class MountainRange {
    constructor(worldMap, inputLocation, isFirst = true) {
        let locations = [inputLocation, ...getNeighborLocations(inputLocation)];
        for (let i = 0; i < locations.length; i++) {
            if(locations[i].terrain && locations[i].terrain.name!=="Mountain"){

                locations[i].terrain = new Mountain(worldMap);
            }
        }
        if (isFirst) {

            new MountainRange(worldMap, locations[randomNumberBetween(1, locations.length)], false);
        }
    }
}

export class TempleOfRNGesus extends Terrain {
    constructor(worldMap) {
        super(worldMap);
        this.name = "TempleOfRNGesus";
        this.color = "purple";
    }
}

export class Water extends Terrain {
    constructor(worldMap) {
        super(worldMap);
        this.name = "Water";
        this.color = "royalblue";
    }
}