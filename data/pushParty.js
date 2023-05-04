import axios from "axios"
import { events} from "../config/mongoCollections.js"
import dotenv from 'dotenv';
import exportedMethods from "./events.js";
const {create} = exportedMethods
dotenv.config({path: '../.env'})



export async function addParty(partyName, 
                 partyAddress,
                 coverPrice,
                 partyDate, 
                 partyVenue,
                 minimumAge,
                 maximumCapacity, 
                 partyDescription,
                 categories,
                 musicType,
                 partyHost, 
    ){
        let party = {
            "name":partyName,
            "location": partyAddress,
            "price": coverPrice,
            "date": partyDate, 
            "partyVenue": partyVenue,
            "minimumAge": minimumAge,
            "maximumCapacity":maximumCapacity,
            "description":partyDescription,
            "category":categories,
            "musicType":musicType,
            "hasOccured":false,
            "guestsAttending":[], 
            "functionComments":[],
            "partyHost":partyHost
        }
        console.log(party)
        const pushparty = await create(
          party['partyHost'], 
          party['name'],
          party['date'],
          party['hasOccured'],
          party['guestsAttending'],
          party['maximumCapacity'],
          party['category'],
          party['description'],
          party['minimumAge'],
          party['location'],
          party['price'],
          party['musicType'],
          party['functionComments'],
          party['partyVenue']
          )
        return party
}

export async function calcDistances(src, dest){
    // https://www.codexworld.com/distance-between-two-addresses-google-maps-api-php/
    //drew inspiration from this code, but still had to write my own as php is different from js 
    //and also google maps api is not the same as it was when this video was made, still had to debug because request response is slightly different now (compared to 2018)
    //stephanie
    let apiKey = process.env.API_KEY

    let formattedSrc = src.replace(/ /g, '+');
    let formattedDest = dest.replace(/ /g, '+');

    let geocodeFromURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + formattedSrc + '&sensor=false&key=' + apiKey;

    let geocodeFrom = await axios.get(geocodeFromURL)



    let geocodeToURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + formattedDest + '&sensor=false&key=' + apiKey;
    
    let geocodeTo = await axios.get(geocodeToURL)

    let latitudeFrom = geocodeFrom.data.results[0].geometry.location.lat
    let longitudeFrom =geocodeFrom.data.results[0].geometry.location.lng
    let latitudeTo = geocodeTo.data.results[0].geometry.location.lat
    let longitudeTo = geocodeTo.data.results[0].geometry.location.lng


    let theta = longitudeFrom - longitudeTo;
    let dist = Math.sin(deg2rad(latitudeFrom)) * Math.sin(deg2rad(latitudeTo)) + Math.cos(deg2rad(latitudeFrom)) * Math.cos(deg2rad(latitudeTo)) * Math.cos(deg2rad(theta));
    let distInRadians = Math.acos(dist);
    let distInDegrees = rad2deg(distInRadians);
    let miles = distInDegrees * 60 * 1.1515;
    
    function deg2rad(degrees) {
      return degrees * (Math.PI/180);
    }
    
    function rad2deg(radians) {
      return radians * (180/Math.PI);
    }
    
    return Math.round(miles * 100) / 100;x
    
}
