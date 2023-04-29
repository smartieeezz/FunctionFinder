import {ObjectId} from 'mongodb';
import { calcDistances } from './pushParty.js';
import { events } from "../config/mongoCollections.js";
export async function findNearbyFunctions(src, distance, startDate, endDate){
    let distanceBetween
    let partiesWithinDistance = []
    const functionCollection = await events()
    let functionList = await functionCollection.find({}).toArray()
    for (const element of functionList) {
        distanceBetween = await calcDistances(src, element.partyAddress)
        if (distanceBetween <= distance){
            partiesWithinDistance.push(element)
        }
    }
    return partiesWithinDistance
}
