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


router.route('/').get(async (req, res) => {
    res.render('postAPartyForm', {apiRoute : `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`})
  });

router.route('/').post(async (req,res) => {
    let insertParty
    let content = req.body
    let partyNameInput = req.body.images.partyName
    let partyAddressInput = req.body.images.partyAddress
    let genresInput = req.body.images.genres
    let coverPriceInput = req.body.images.coverPrice
    let typesInput = req.body.images.types
    let partyDateInput = req.body.images.partyDate
    let partyVenueInput = req.body.images.partyVenue
    let minimumAgeInput = req.body.images.minimumAge
    let maximumCapacityInput = req.body.images.maximumCapacity
    let partyDescriptionInput = req.body.images.partyDescription
    let partyCoverPhotoInput = req.body.images.partyCoverPhoto

    // try{
    //   insertParty = await addParty(
    //     partyNameInput, 
    //     partyAddressInput, 
    //     coverPriceInput, 
    //     partyDateInput, 
    //     partyVenueInput, 
    //     minimumAgeInput, 
    //     maximumCapacityInput, 
    //     partyDescriptionInput, 
    //     typesInput, 
    //     genresInput, 
    //     req.session.userId,
    //     partyCoverPhotoInput )
    // } catch (e){
    //   console.log(e)
    //   return res.status(500).render('error', { error: "500. Internal Server Error"})
    // }
    res.render('partyPostedConfirmation')
})

export default router;