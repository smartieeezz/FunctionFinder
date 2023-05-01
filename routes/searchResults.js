import axios from 'axios';
//imported the router from express
import {Router} from 'express';
import { findNearbyFunctions } from '../data/search.js';
const router = Router();

import dotenv from 'dotenv';
dotenv.config({path: '.env'})
const result = dotenv.config();


let apiKey = process.env.API_KEY


router.route('/').get(async (req, res) => {
    res.render('searchResults')
  });

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
      res.status(500).json('error');
    }
    res.render('searchResults',{searchResults:nearby, 'apiKey': apiKey, 'location':location, 'longitude':longitude, "latitude":latitude})
  });

export default router;