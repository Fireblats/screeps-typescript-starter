/**
 * @file ./lib is a great place to keep all your code.
 * You can then choose what to make available by default by
 * exporting your lib modules from the ./src/index.ts entrypoint.
 */

/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawnhandler');
 * mod.thing == 'a thing'; // true
 */

// const { map } = require("lodash");
import _ from "lodash";

const BODYPART_COST = {
    move: 50,
    work: 100,
    attack: 80,
    carry: 50,
    heal: 250,
    ranged_attack: 150,
    tough: 10,
    claim: 600
};

type BodyPartCosts = {
    [key in BodyPartConstant]: number;
};

function GetCreepCost(bodyParts: BodyPartConstant[]): number {
    // return _.sumBy(bodyParts, (part) => BODYPART_COST[part]);
    return _.sum(bodyParts.map(part => BODYPART_COST[part]));
}

interface CreepType {
    type: string;
    size: string;
    body: string[];
    cost: number;
}

/**
 * Finds the biggest creep of a given type that can be created within the specified maximum cost.
 * @param {string} type The type of creep to find.
 * @param {number} maxCost The maximum cost of the creep.
 * @param {object[]} creepTypes The list of available creep types.
 * @returns {object} The biggest creep of the given type that can be created within the specified maximum cost, or undefined if no such creep exists.
 */
function findBiggestCreep(type: string, maxCost: number, creepTypes: { type: string; size: string; body: BodyPartConstant[]; cost: number }[]): { type: string; size: string; body: BodyPartConstant[]; cost: number } | undefined {
    // Find all creeps of the given type
    const matchingCreeps = creepTypes.filter(creep => creep.type === type);

    // Sort the creeps in descending order by cost
    const sortedCreeps = matchingCreeps.sort((a, b) => b.cost - a.cost);

    // Find the first creep that can be created within the specified maximum cost
    return sortedCreeps.find(creep => creep.cost <= maxCost);
}

const creepTypes = [
    {
        type: "worker",
        size: "small",
        body: [WORK, CARRY, MOVE],
        cost: GetCreepCost([WORK, CARRY, MOVE])
    },
    {
        type: "worker",
        size: "medium",
        body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        cost: GetCreepCost([WORK, WORK, CARRY, CARRY, MOVE, MOVE])
    },
    {
        type: "worker",
        size: "large",
        body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        cost: GetCreepCost([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE])
    }
];

// Create main spawn handler function
export class SpawnHandler {
    public static run() {
        // Get the main spawn
        const spawn = Game.spawns["Spawn1"];

        // Get the energy available
        const energyAvailable = spawn.room.energyAvailable;

        // Find the biggest worker creep that can be created
        const biggestWorker = findBiggestCreep("worker", energyAvailable, creepTypes);

        // If a worker creep can be created
        if (biggestWorker) {
            // Create the creep
            let gameTime = Game.time;
            spawn.spawnCreep(biggestWorker.body, "Worker" + gameTime);
        }
    }
}
