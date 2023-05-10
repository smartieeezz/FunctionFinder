//Import express and express router as shown in lecture code and worked in previous labs
//You can make your axios calls to the API directly in the routes
import axios from 'axios';
//imported the router from express
import {Router} from 'express';
import xss from 'xss';
import userData  from '../data/users.js';
import eventData  from '../data/events.js';
import { checkAge, checkEmail, checkName, checkPassword, checkString } from '../helpers/validation.js';
//create an instance of the Router() named router
const router = Router();
import dotenv from 'dotenv';
dotenv.config({path: '.env'})
const result = dotenv.config();

// Check if there was an error loading the .env file


let apiKey = process.env.API_KEY

// gets the user info
router.get('/users/:id', async (req, res) => {
    try {
        const user = await userData.get(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

router.get('/cancelanevent', async (req, res) => {
    try {
        const userId = req.session.user.id;
        const user = await userData.get(userId);
        const hostedEventIds = user.currentlyHostingEvents;
        const currentlyHostingEvents = [];
  
        for (const eventId of hostedEventIds) {
            const event = await eventData.get(eventId);
            currentlyHostingEvents.push({ ...event, userId });
        }

        res.render('cancelAnEvent', { events: currentlyHostingEvents, userId });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: error });
    }
});
router.post('/cancelanevent', async (req, res) => {
    const eventId = req.body.eventId;
  
    try {
      const event = await eventData.get(eventId);
      if (!event) {
        res.status(404).json({ message: 'Event not found' });
      } else {
        await eventData.cancelEvent(eventId);
        res.json({ message: 'Event cancelled successfully' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something broke.' });
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
        userCheck = await userData.checkUser(xss(emailInput), xss(passwordInput));

    } catch (e) {
        error.push(e);
    }

    if(error.length > 0){
        res.render('login', {errors: error, hasErrors: true, loginInfo: req.body});
        return;
    }

    const uid = userCheck._id;
    const uName = userCheck.username;
    req.session.user = {id: uid, userName: uName};
    res.redirect('/');
});

router.get('/account/create', (req, res) => {
    res.render('accountCreation');
});  




router.post('/account/create', async (req, res) => {
    const { firstName, lastName, username, email, dob, password, confirmPassword, favoriteCategories } = req.body;
    const sanitizedFirstName = xss(firstName);
    const sanitizedLastName = xss(lastName);
    const sanitizedUsername = xss(username);
    const sanitizedEmail = xss(email);
    const sanitizedDOB = xss(dob)
    const sanitizedPassword = xss(password);
    const sanitizedFavoriteCategories = xss(favoriteCategories);
    let error = [];
    //check to see if we have all the fields
    if (!firstName || !lastName || !username || !email || !dob || !password, !confirmPassword, !favoriteCategories) {
        error.push("You have to fill in all the fields")
        res.render('accountCreation',{errors: error, hasErrors: true, accountInfo: req.body});
        return
    } 
    //check to see if we have a valid age
    
    try {
        let checkDOB = checkAge(dob)
    } catch (e) {
        error.push(e)
        res.render('accountCreation', {errors: error,hasErrors: true, accountInfo: req.body })
        return
    }
    //check to see we have valid names
    try {
        let checkFname  = checkName(firstName)
    } catch (e) {
        error.push(e)
        res.render('accountCreation', {errors: error,hasErrors: true, accountInfo: req.body })
        return
    }

    //check to see we have valid names
    try {
        let checkLname  = checkName(lastName)

    } catch (e) {
        error.push(e)
        res.render('accountCreation', {errors: error,hasErrors: true, accountInfo: req.body })
        return
    }

    //check to see the password is valid
    try {
    let validatePassword = checkPassword(password)

    } catch (e) {
        error.push(e)
  
        res.render('accountCreation', {errors: error,hasErrors: true, accountInfo: req.body })
        return 
    }
    //make sure the password and confirmPassword varialbes match
    if (password!==confirmPassword) {
        error.push("The passwords must match.")

        res.render('accountCreation', {errors: error,hasErrors: true, accountInfo: req.body })
        return
    }

    //check if we have a valid username (without spaces)
    try {
        let validateUsername = checkString(username)
  
    } catch (e) {
        error.push('The username must not have spaces.')

        res.render('accountCreation', {errors: error,hasErrors: true, accountInfo: req.body })
        return
    }

    //make sure we don't create two identical usernames
    try {
        const user = await userData.getUserByUsername(username);
        if (user) {
            error.push("Username already exists. Please choose another username.")
    
            res.render('accountCreation', {errors: error,hasErrors: true, accountInfo: req.body })
            
            return
        }
    } catch (e) {
        // handle database error
        error.push(e);
        res.render('accountCreation', {errors: error,hasErrors: true, accountInfo: req.body })
        return
    }
    try {
        const user = await userData.getByEmail(email);
        if (user) {
            error.push("Email already exists. Please choose another email address.")
         
            res.render('accountCreation', {errors: error,hasErrors: true, accountInfo: req.body })
            
            return
        }
    } catch (e) {
        // handle database error
        error.push(e);
        res.render('accountCreation', {errors: error,hasErrors: true, accountInfo: req.body })
        return
    }
    try {
        //create the user
        const result = await userData.create(firstName, lastName, username, email, dob, password, favoriteCategories);
        const uid = result._id;
        req.session.user = {id: uid, userName: username};
        //show the account has been created and show the user's first name
        return res.render('accountCreated', {firstName, username})
        
    } catch (e) {
        error.push(e)
        res.render('accountCreation',{errors: error,hasErrors: true, accountInfo: req.body });
        return
    }
});

// get user's registered events
router.get('/registered-events', async (req, res) => {
    try {
        const userId = req.session.user.id;
        const user = await userData.get(userId);
        const registeredEventIds = user.registeredEvents;
        const registeredEvents = [];
  
        for (const eventId of registeredEventIds) {
            const event = await eventData.get(eventId);
            registeredEvents.push({ ...event, userId });
        }
  
        res.render('eventsRegistered', { events: registeredEvents, userId });
    } catch (error) {
      res.status(404).json({ message: error });
    }
});

// get user's favorited events
router.get('/favorited-events', async (req, res) => {
    try {
        const userId = req.session.user.id;
        const user = await userData.get(userId);
        const favoritedEventIds = user.favoritedEvents;
        const favoritedEvents = [];
  
        for (const eventId of favoritedEventIds) {
            const event = await eventData.get(eventId);
            favoritedEvents.push({ ...event, userId });
        }
  
        res.render('eventsFavorited', { events: favoritedEvents, userId });
    } catch (error) {
        res.status(404).json({ message: error });
    }
});


router.get('/account/settings', async (req, res) => {
    

    const id = req.session.user.id
    // make sure user is logged in and updating their own settings
    if (!id) {
        res.redirect("/account/login");
    //if the user is logged in then let's check
    } else {
        const user = await userData.get(id)

        if (!user) {

            res.redirect("/error");
        } else {

            res.render('updateSettings', {user: user, id: id})
    }
}

});  

router.post('/account/settings', async (req, res) => {

    const {firstName, lastName, username, email, dob, password, confirmPassword, favoriteCategories } = req.body;
    const id = req.session.user.id
    let error = [];

        const sanitizedFirstName = xss(firstName);
        const sanitizedLastName = xss(lastName);
        const sanitizedEmail = xss(email);
        const sanitizedDOB = xss(dob)
        const sanitizedPassword = xss(password);
        const sanitizedFavoriteCategories = xss(favoriteCategories);
    
    //check to see if we have all the fields
    if (!firstName || !lastName  || !email || !dob || !password, !confirmPassword, !favoriteCategories) {
        
        error.push("You have to fill in all the fields")
        res.render('updateSettings',{errors: error, hasErrors: true, updateForm: req.body,id: id});

        return
    } 

    //check to validate firstName
    try {
        const checkFirstName = checkName(firstName)
  
    } catch (e) {
        error.push(e)
  
        res.render('updateSettings', {errors: error, hasErrors: true, updateForm: req.body,id: id})
        return
    }
    //check to validate lastName
    try {
        const checkLastName = checkName(lastName)
      
    } catch (e) {
        error.push(e)
     
        res.render('updateSettings', {errors: error, hasErrors: true, updateForm: req.body, id: id})
        return
    }
    


    //check to validate email
    try {
        let userByEmail = checkEmail(email)
       
        const existingUser = await userData.getByEmailUpdate(email);
        
        if (existingUser && existingUser._id.toString() !== id) {
            throw `Error: A user with the email ${email} already exists.`;
        }
    } catch (e) {
        error.push(e)
       
        res.render('updateSettings', {errors: error, hasErrors: true, updateForm: req.body, id: id})
        return
    }
    let checkDOB
    //check to validate dob
    try {
        checkDOB = checkAge(dob)
    
    } catch (e) {
        error.push(e)
      
        res.render('updateSettings', {errors: error, hasErrors: true, updateForm: req.body, id: id})
        return
    }

    //check to validate password
    try {
        const validatePassword = checkPassword(password)
    
    } catch (e) {
        error.push(e)
     

        res.render('updateSettings', {errors: error, hasErrors: true, updateForm: req.body, id: id})
        return
    }
    
    //make sure the passwords match
    if (password!==confirmPassword) {
        error.push("The passwords must match.")
     

        res.render('updateSettings', {errors: error,hasErrors: true, updateForm: req.body, id: id })
        return
    }
  

    //if we pass all those validations we should be able to update the fields
        try {
            const updatedUser = await userData.updateUser(id, {
                firstName: firstName,
                lastName: lastName,
                email: email,
                dateOfBirth: checkDOB,
                password: password,
                favoriteCategories: favoriteCategories
            });
            // const username = await userData.getUserByUsername(id)
         
            res.render('accountUpdated', {username: updatedUser.username})
            req.session.userId = updatedUser._id
            //res.render('updateSettings',{updated: true })
            //res.redirect(`${id}`);
        } catch (e) {
            error.push(e);
            console.log(error);

            res.render('updateSettings', { errors: error, hasErrors: true, updateForm: req.body, id: id});
            return;
        }
    });

router.get('/account/parties', async (req, res) => {

    
    //get the user's id that is currently logged in
    const id = req.session.user.id
    // make sure user is logged in and updating their own settings
    if (!id) {
        res.redirect("/account/login");
    //if the user is logged in then let's check
    } else {
        let user = await userData.get(id)
        user = user.username
   

        //this is the ID we will search for that is attending/hosting the parties
        const searchId = user._id
        const hosted = await userData.findPartiesUserHosts(id)
      
        const attending = await userData.findPartiesUserAttending(id)
        const previouslyAttended = await userData.findPartiesPreviouslyAttended(id)
        
        let notAttendedMessage
        let notAttendingMessage
        let notHostingMessage
        if (hosted.length == 0) {
            notHostingMessage = ["Not hosting any functions."]
        }
        if (attending.length == 0) {
            notAttendingMessage = ["Not attending any functions."]
        }
        if (previouslyAttended.length == 0) {
            notAttendedMessage = ["You haven't attended any functions."]
        }
   
        if (!user) {
          
            res.redirect("/error");
        } else {
            res.render('userParties',  {
                user,
                hosted, 
                attending, 
                previouslyAttended,
                notHostingMessage,
                notAttendingMessage, 
                notAttendedMessage})
        }
}

});  


router.get('/signout', async (req, res) => {
    req.session.destroy();
    res.redirect("/");
    });




export default router;