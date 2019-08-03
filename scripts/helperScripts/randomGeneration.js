import { Terrain, Grassland, Mountain, TempleOfRNGesus, Water, MountainRange } from "../terrain.js";
import { generateRandomCoordinates } from "../worldMap.js";

export function randomGenOn(worldMap) {
    for (let i = 0; i < worldMap.map.length; i++) {
        for (let j = 0; j < worldMap.map[i].length; j++) {
            worldMap.map[i][j].terrain = new Grassland(worldMap);
        }
    }

    new MountainRange(worldMap, worldMap.RandomLocation());
    worldMap.RandomLocation().terrain = new Water(worldMap);
}

//RANDOM NUMBER GENERATORRRRRRR
export function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}