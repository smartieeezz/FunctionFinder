import {ObjectId} from 'mongodb';
import { calcDistances } from './pushParty.js';
import { events } from "../config/mongoCollections.js";
export async function findNearbyFunctions(src, distance, startDate, endDate){
    if (!src) throw "Error: src missing"
    if (!distance) throw "Error: distance missing"
    if (!startDate) throw "Error: start date missing"
    if (!endDate) throw "Error: end date missing"
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

        let startDateDay = startDate.slice(0,10)
        let endDateDay = endDate.slice(0,10)
        let partyDateDay = element.date.slice(0,10)
        let lolstartDate = new Date(startDateDay);
        let lolendDate = new Date(endDateDay);
        let lolpartyDate = new Date(partyDateDay);

        // Check if party date is within range
        if (lolpartyDate >= lolstartDate && lolpartyDate <= lolendDate) {
            final.push(element);
        }

        // Check if party date is the same as start date or end date
        if (lolpartyDate.getTime() === lolstartDate.getTime() || lolpartyDate.getTime() === lolendDate.getTime()) {
            final.push(element);
        }

    }
    return final
}

export async function filterFunctions(ages, genres, price, types, functions){
    final = []
    for (const f of functions){
        let dj2valid 
        for (const a of ages){
            if (!a.age.includes(f.minimumAge)){
                dj2valid = false
            }
        }   
        
    }
}