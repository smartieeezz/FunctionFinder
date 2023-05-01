//Import express and express router as shown in lecture code and worked in previous labs
//You can make your axios calls to the API directly in the routes
import axios from 'axios';
//imported the router from express
import {Router} from 'express';
import { functions } from "../config/mongoCollections.js"
import { addParty, calcDistances } from '../data/pushParty.js';
import userData  from '../data/users.js';

//create an instance of the Router() named router
const router = Router();
import dotenv from 'dotenv';
dotenv.config({path: '.env'})
const result = dotenv.config();

// Check if there was an error loading the .env file


let apiKey = process.env.API_KEY
console.log(apiKey)

router.route('/').get(async (req, res) => {
    res.render('postAPartyForm', {apiRoute : `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`})
  });

router.route('/').post(async (req,res) => {
    let insertParty
    console.log(req.body)
    const {partyName, partyAddress, coverPrice, partyDate, partyVenue, minimumAge, maximumCapacity, partyDescription, fileInput} = req.body
    
    try{
      insertParty = await addParty(partyName, partyAddress, coverPrice, partyDate, partyVenue, minimumAge, maximumCapacity, partyDescription, )
    } catch (e){
      return res.status(500).render('error', { error: "500. Internal Server Error"})
    }
    res.render("partyPostedConfirmation")
})

export default router;