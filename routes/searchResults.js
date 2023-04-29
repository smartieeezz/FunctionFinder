import axios from 'axios';
//imported the router from express
import {Router} from 'express';
import { findNearbyFunctions } from '../data/search.js';
const router = Router();


router.route('/').get(async (req, res) => {
    res.render('searchResults')
  });

  router.route('/').post(async (req, res) => {
    const {location, distance, startDate, endDate} = req.body
    console.log(location)
    const nearby = await findNearbyFunctions(location, distance)
    console.log("nearby parties")
    console.log(nearby)
    console.log("here")
  });

export default router;