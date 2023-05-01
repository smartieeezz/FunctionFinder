import {ObjectId} from 'mongodb';
import { calcDistances } from './pushParty.js';
import { events } from "../config/mongoCollections.js";
export async function findNearbyFunctions(src, distance, startDate, endDate){
    let distanceBetween
    let partiesWithinDistance = []
    let final = []
    const functionCollection = await events()
    let functionList = await functionCollection.find({}).toArray()
    for (const element of functionList) {
        distanceBetween = await calcDistances(src, element.location)
        if (distanceBetween <= distance){
            partiesWithinDistance.push(element)
        }
    }
    for (const element of partiesWithinDistance){
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        let partyDate = new Date(element.date);
        if (partyDate >= startDate && partyDate <= endDate) {
            final.push(element)
        }
    }
    console.log(final)
    return final
}
