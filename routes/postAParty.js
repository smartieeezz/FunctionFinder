//Import express and express router as shown in lecture code and worked in previous labs
//You can make your axios calls to the API directly in the routes
import axios from 'axios';
import fs from 'fs';
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


router.route('/test').post(async(req,res) => {
  console.log(req.body)
  res.render('error')
})
router.route('/').get(async (req, res) => {
    res.render('postAPartyForm', {apiRoute : `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`})
  });

router.route('/partypostedconfirmation').get(async (req, res) => {
  res.render('partyPostedConfirmation')
});

router.route('/').post(async (req,res) => {
    let insertParty

    let content = req.body
    let partyNameInput = req.body.partyName
    let partyAddressInput = req.body.partyAddress
    let genresInput = req.body.genres
    let coverPriceInput = req.body.coverPrice
    let typesInput = req.body.types
    let partyDateInput = req.body.partyDate
    let partyVenueInput = req.body.partyVenue
    let minimumAgeInput = req.body.minimumAge
    let maximumCapacityInput = req.body.maximumCapacity
    let partyDescriptionInput = req.body.partyDescription
    let partyCoverPhotoInput = req.body.partyCoverPhoto
    console.log(req.body)
    try{
      insertParty = await addParty(
        partyNameInput, 
        partyAddressInput, 
        coverPriceInput, 
        partyDateInput, 
        partyVenueInput, 
        minimumAgeInput, 
        maximumCapacityInput, 
        partyDescriptionInput, 
        typesInput, 
        genresInput, 
        req.session.user.id,
        partyCoverPhotoInput) 
    } catch (e){
      console.log(e)
      return res.status(500).render('error', { error: "500. Internal Server Error"})
    }
    res.render('partyPostedConfirmation')
})

export default router;