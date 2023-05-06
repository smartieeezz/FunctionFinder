//Import express and express router as shown in lecture code and worked in previous labs
//You can make your axios calls to the API directly in the routes
import axios from 'axios';
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
console.log(apiKey)

router.route('/').get(async (req, res) => {
    res.render('postAPartyForm', {apiRoute : `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`})
  });

router.route('/').post(async (req,res) => {
    let insertParty
    console.log(req.body)
    const {partyName, partyAddress, genres, coverPrice, types, partyDate, partyVenue, minimumAge, maximumCapacity, partyDescription, fileInput} = req.body

    try{
      insertParty = await addParty(partyName, partyAddress, coverPrice, partyDate, partyVenue, minimumAge, maximumCapacity, partyDescription, types, genres, req.session.user.id )
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