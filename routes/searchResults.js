import axios from 'axios';


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
  console.log("we made it here")
  console.log(req.body)
  let realFunctions = []
  for (let i = 0; i < req.body.f.length; i++) {
    let party = await exportedMethods.get(req.body.f[i])
    realFunctions.push(party)
  }
  let filtered = filterParties(realFunctions, req.body.ages, req.body.genres, req.body.types, req.body.prices)
  // console.log("real functions")
  // console.log(realFunctions)
  // console.log(req.body.ages)
  // console.log(req.body.genres)
  // console.log(req.body.types)
  // console.log(req.body.prices)
  // console.log("filtered")
  // console.log(filtered)
  res.send(filtered)
})
  router.route('/filter').post(async (req, res) => {
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