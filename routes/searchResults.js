import axios from 'axios';
import xss from 'xss';

//imported the router from express
import {Router} from 'express';
import exportedMethods from '../data/events.js'
import { filterParties, findNearbyFunctions } from '../data/search.js';
const router = Router();

import dotenv from 'dotenv';
dotenv.config({path: '.env'})
const result = dotenv.config();


let apiKey = process.env.API_KEY


router.route('/').get(async (req, res) => {
    res.render('searchResults')
  });


router.route('/getfunctions').post(async (req,res) => {
  console.log("am i here")
  console.log(req.body)
  let realFunctions = []
  for (const element of req.body.f) {
    let party = await exportedMethods.get(element)
    console.log("party")
    console.log(party)
    realFunctions.push(party)
  }
  console.log("function that are real")
  console.log(realFunctions)
  console.log("req body genres")
  console.log(req.body.genres)
  let filtered = filterParties(realFunctions, req.body.ages, req.body.genres, req.body.types, req.body.prices)
  console.log("filter")
  console.log(filtered)
  res.send(filtered)
})
  router.route('/resultsjson').post(async (req, res) => {
    res.render("searchresults", {searchResults:req.body.results} )
  })

router.route('/').post(async (req, res) => {
  const {location, distance, startDate, endDate} = req.body
  let nearby
  let formattedSrc = location.replace(/ /g, '+');
  let geocodeLocation

    let geocodeLocationURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + formattedSrc + '&sensor=false&key=' + apiKey;

    try {
      geocodeLocation = await axios.get(geocodeLocationURL)
    } catch(e){
      res.status(500).json('error');
    }

 
    let latitude = geocodeLocation.data.results[0].geometry.location.lat
    let longitude =geocodeLocation.data.results[0].geometry.location.lng
  try{
    nearby = await findNearbyFunctions(location, distance, startDate, endDate)
  } catch(e){
    console.log(e)
    res.status(500).json('error');
  }

  for (const element of nearby){
    element._id = element._id.toString()
  }


  res.render('searchResults',{searchResults:nearby, 'apiKey': apiKey, 'location':location, 'longitude':longitude, "latitude":latitude})
});

export default router;