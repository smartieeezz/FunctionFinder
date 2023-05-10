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
  let realFunctions = []
  console.log("we made it into get functions")
  const cleanAges = xss(req.body.ages)
  const cleanGenres = xss(req.body.genres)
  const cleanTypes = xss(req.body.types)
  const cleanPrices = xss(req.body.prices)
  console.log(req.body.f)
  req.body.f = req.body.f.filter(str => str !== '');
  for (const element of req.body.f) {
 
    let party = await exportedMethods.get(element)
    realFunctions.push(party)
  }

  for (const element of realFunctions){
   
    element._id = element._id.toString()

    let formattedSrc2 = element.location.replace(/ /g, '+');


 
    let geocodeFromURL2 = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + formattedSrc2 + '&sensor=false&key=' + apiKey;


    let geocodeFrom2
    try{
      geocodeFrom2 = await axios.get(geocodeFromURL2)
    } catch(e){
      console.log(e)
    }

    let latitude2 = geocodeFrom2.data.results[0].geometry.location.lat
    let longitude2 = geocodeFrom2.data.results[0].geometry.location.lng
    element.latitude = latitude2
    element.longitude = longitude2
  }

  let filtered = filterParties(realFunctions, req.body.ages, req.body.genres, req.body.types, req.body.prices)
  console.log(filtered)
  res.send(filtered)
})
router.route('/getfunctions').get(async (req,res) => {
  res.redirect('/');
})
router.route('/resultsjson').post(async (req, res) => {
    const clean = xss(req.body.results)
    res.render("searchresults", {searchResults:req.body.results} )
  })
router.route('/resultsjson').get(async (req, res) => {
  res.redirect('/');
})

router.route('/').post(async (req, res) => {
  const location = xss(req.body.location)
  const distance = xss(req.body.distance)
  const startDate = xss(req.body.startDate)
  const endDate = xss(req.body.endDate)
  let nearby
  let longitude
  let latitude



    try{

      let apiKey = process.env.API_KEY

      let formattedSrc = location.replace(/ /g, '+');
 
      let geocodeFromURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + formattedSrc + '&sensor=false&key=' + apiKey;


      let geocodeFrom = await axios.get(geocodeFromURL)

      latitude = geocodeFrom.data.results[0].geometry.location.lat
      longitude =geocodeFrom.data.results[0].geometry.location.lng

      if (geocodeFrom.data.status == "ZERO_RESULTS"){
        return res.status(404).render('error', { error: "404. Address not found" });
      }

      
    }
    catch (e){
      return res.render('error', {message: "Error: invalid party address"})
    }
  try{
    nearby = await findNearbyFunctions(location, distance, startDate, endDate)
  } catch(e){
    console.log(e)
    res.status(500).json('error');
  }

  for (const element of nearby){
    element._id = element._id.toString()
    let formattedSrc2 = element.location.replace(/ /g, '+');
 
    let geocodeFromURL2 = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + formattedSrc2 + '&sensor=false&key=' + apiKey;

    let geocodeFrom2
    try{
    geocodeFrom2 = await axios.get(geocodeFromURL2)
    } catch(e){
      console.log(e)
    }

    let latitude2 = geocodeFrom2.data.results[0].geometry.location.lat
    let longitude2 =geocodeFrom2.data.results[0].geometry.location.lng
    element.latitude = latitude2
    element.longitude = longitude2
  }


  res.render('searchResults',{searchResults:nearby, 'apiKey': apiKey, 'location':location, 'longitude':longitude, "latitude":latitude})
});

export default router;