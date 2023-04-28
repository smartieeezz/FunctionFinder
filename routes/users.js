//Import express and express router as shown in lecture code and worked in previous labs
//You can make your axios calls to the API directly in the routes
import axios from 'axios';
//imported the router from express
import {Router} from 'express';
import userData  from '../data/users.js';
import eventData  from '../data/events.js';
//create an instance of the Router() named router
const router = Router();

// gets the user info
router.get('/users/:id', async (req, res) => {
    try {
        const user = await userData.get(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

router.get('/account/login', async (req, res) => {
    try {
    //make the response const equal to all the venues
    return res.render('login');
    
    } catch (e) {
    console.error(e);
    return res.status(500).render('error', { message: 'Something broke.' });
    }
});

router.post('/account/login', async (req, res) => {
    const {emailInput, passwordInput} = req.body;
    let error = [];
    let userCheck;
    try {
        userCheck = await userData.checkUser(emailInput, passwordInput);
    } catch (e) {
        error.push(e);
    }

    if(error.length > 0){
        res.render('login', {errors: error, hasErrors: true, loginInfo: req.body});
        return;
    }

    const uid = userCheck._id;
    res.redirect(`/${uid}`);
});

router.get('/account/create', (req, res) => {
    // Render the EJS template for the create account page
    res.render('accountCreation');
});  

router.post('/account/create', async (req, res) => {
    const { firstName, lastName, username, email, dob, password } = req.body;
    //check to see if we have all the fields
    if (!firstName || !lastName || !username || !email || !dob || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }  
    try {
        //create the user
        const result = await userData.create(firstName, lastName, username, email, dob, password);
        const uid = result._id;
        req.session.user = {id: uid, userName: username};
        //show the account has been created and show the user's first name
        return res.render('accountCreated', {firstName, username})
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create account' });
    }
});

// get user's registered events
router.get('/:id/registered-events', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userData.get(userId);
        const registeredEventIds = user.registeredEvents;
        const registeredEvents = [];
        for (const eventId of registeredEventIds) {
            const event = await eventData.get(eventId);
            registeredEvents.push(event);
        }
        res.render('eventsRegistered', { events: registeredEvents });
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await userData.get(req.params.id);
        res.render('homepageSignedin', { user: user });
    } catch (error) {
        res.status(404).json({ message: error});
    }
    
});
// add more routes

export default router;