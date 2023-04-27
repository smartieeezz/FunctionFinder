import {ObjectId} from 'mongodb';
import { calcDistances } from './pushParty.js';
import { functions } from "../config/mongoCollections.js";
export async function findNearbyFunctions(src, distance){
    let distanceBetween
    let partiesWithinDistance = []
    const functionCollection = await functions()
    let functionList = await functionCollection.find({}).toArray()
    for (const element of functionList) {
        distanceBetween = await calcDistances(src, element.partyAddress)
        if (distanceBetween <= distance){
            partiesWithinDistance.push(element)
        }
    }
    return partiesWithinDistance
}
