//Import express and express router as shown in lecture code and worked in previous labs
//You can make your axios calls to the API directly in the routes
import axios from 'axios';
//imported the router from express
import {Router} from 'express';
import userData  from '../data/users.js';
//create an instance of the Router() named router
const router = Router();

router.get('/account/login', async (req, res) => {
    try {
    //make the response const equal to all the venues
    return res.render('login');
    
    } catch (e) {
    console.error(e);
    return res.status(500).render('error', { message: 'Something broke.' });
    }
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
        //show the account has been created and show the user's first name
        return res.render('accountCreated', {firstName, username})
        } catch (error) {
        return res.status(500).json({ error: 'Failed to create account' });
        }
    });

export default router