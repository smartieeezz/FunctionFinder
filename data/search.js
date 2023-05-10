import {ObjectId} from 'mongodb';
import { calcDistances } from './pushParty.js';
import { events } from "../config/mongoCollections.js";
const priceRanges = {
    "lessThan25": {
      withinRange: function(price) {
        return price < 25;
      }
    },
    "$25-$50": {
      withinRange: function(price) {
        return price >= 25 && price <= 50;
      }
    },
    "$50-$75": {
      withinRange: function(price) {
        return price >= 50 && price <= 75;
      }
    },
    "$75-$100": {
      withinRange: function(price) {
        return price >= 75 && price <= 100;
      }
    },
    "$100+": {
      withinRange: function(price) {
        return price >= 100;
      }
    }
  };
  
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
        else if (lolpartyDate.getTime() === lolstartDate.getTime() || lolpartyDate.getTime() === lolendDate.getTime()) {
            final.push(element);
        }

    }
    return final
}

function findCommonElements(arr1, arr2) {
    for (let i = 0; i < arr2.length; i++) {
      if (arr1.indexOf(arr2[i]) == -1) {
        return false;
      }
    }
    return true;
  }

  export function filterParties(functions, ages, genres, types, price) {
    const final = [];

    let meetsAgeCriteria = true
    let meetsGenreCriteria = true
    let meetsTypeCriteria = true
    let meetsPriceCriteria = true
    for (const f of functions) {
        if (ages){
            meetsAgeCriteria = ages.includes(f.minimumAge);
        }
        if (genres){
            meetsGenreCriteria = findCommonElements(f.musicType, genres);

        }
      
        if (types){
            meetsTypeCriteria = findCommonElements(f.category, types);
        }
      
        if (price){
            for (const p of price) {
              if (priceRanges[p].withinRange(f.price)){
                meetsPriceCriteria = true
                break
              }
              else{
                meetsPriceCriteria = false
              }
            }
        }

      if (meetsAgeCriteria && meetsGenreCriteria && meetsTypeCriteria && meetsPriceCriteria) {
        final.push(f);
      }
    }
    return final;
  }
