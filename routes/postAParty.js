//Import express and express router as shown in lecture code and worked in previous labs
//You can make your axios calls to the API directly in the routes
import axios from 'axios';
import fs from 'fs';
//imported the router from express
import {Router} from 'express';
import { functions } from "../config/mongoCollections.js"
import { addParty, calcDistances } from '../data/pushParty.js';
import userData  from '../data/users.js';
import eventData  from '../data/events.js';

//create an instance of the Router() named router
const router = Router();
import dotenv from 'dotenv';
dotenv.config({path: '.env'})
const result = dotenv.config();

// Check if there was an error loading the .env file


let apiKey = process.env.API_KEY


router.route('/addressnotfound').get(async (req, res) => {
  res.render('error', {message: "Error: Address not found."})
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
    //validate party address here, 

    try{

      let apiKey = process.env.API_KEY

      let formattedSrc = partyAddressInput.replace(/ /g, '+');
 
      let geocodeFromURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + formattedSrc + '&sensor=false&key=' + apiKey;


      let geocodeFrom = await axios.get(geocodeFromURL)

      if (geocodeFrom.data.status == "ZERO_RESULTS"){
        return res.status(404).render('error', { error: "404. Address not found" });
      }

      
    }
    catch (e){
      return res.render('error', {message: "Error: invalid party address"})
    }

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
    // Hao Dian added this to update the user's attributes ==================
    try {
      const eventId = insertParty.id;
      const userId = req.session.user.id;
      const previousGuestsAttending = (await eventData.get(eventId)).guestsAttending;
      const updatedFields = {
        guestsAttending: [...previousGuestsAttending, userId]
      }
      const updatedEvent = await eventData.update(eventId, updatedFields);
      const updatedRegisteredEvents = await userData.updateRegisteredEvents(userId, eventId.toString(), 'register');
      const updatedCurrentlyHostingEvents = await userData.updateCurrentlyHostingEvents(userId, eventId.toString(), 'add');
      const updatedPreviouslyHostedEvents = await userData.updatePreviouslyHostedEvents(userId, eventId.toString(), 'add');
      const updatedPastEventsAttended = await userData.updatePastEventsAttended(userId, eventId.toString(), 'add');
      // res.json({ event: updatedEvent, user: updatedUser });
    } catch (e) {
      console.log(e);
      return res.status(500).render('error', { error: "500. Internal Server Error" });
    }
    // =======================
    res.render("partyPostedConfirmation")
})

export default router;