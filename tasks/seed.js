import { ObjectId } from 'mongodb';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import users from '../data/users.js'
import events from '../data/events.js'
import { eventData } from '../data/index.js';
import { userData } from '../data/index.js';
// import { events } from '../config/mongoCollections.js';

//lets drop the database each time this is run
console.log('Booting up database...!');

const db = await dbConnection();
await db.dropDatabase();

try {
    // create user1
    let user1= await users.create("John", "Snow", "john.snow", "john.snow@gmail.com", "01/01/1900","password");
    console.log(user1)
    
    // create user2
    let user2= await users.create("Mary", "Anne", "mary.anne", "mary.anne@gmail.com", "01/01/2000","cs546");
    console.log(user2)

    // create event1
    let event1 = await eventData.create(
        user1._id.toString(), // partyHost
        "Keanu Reeves Live Show!", // name
        "06/01/2023", // date
        false, // hasOccured
        [], // guestsAttending
        300, // maximumCapacity
        ["Live Show", "Concert"], // category
        "This is going to be a super cool concert!!", // description
        21, // minimumAge
        "123 Keanu Drive, Los Angeles California, 90210", // location
        69, // price
        ["Rock", "Pop"], // musicType
        [] // functionComments
    );
    console.log(event1);

    // create event2
    let event2 = await eventData.create(
        user1._id.toString(), // partyHost
        "Jennifer Lopez Live Show!", // name
        "07/01/2023", // date
        false, // hasOccured
        [], // guestsAttending
        1000, // maximumCapacity
        ["Live Show", "Concert", "Costume"], // category
        "FREE MERCH!!", // description
        21, // minimumAge
        "123 Jennifer Drive, Los Angeles California, 90210", // location
        420, // price
        ["Rock", "Pop", "Hip Hop"], // musicType
        [] // functionComments
    );
    console.log(event2);

    // update event1 to add user2's id to guestsAttending
    event1.guestsAttending.push(user2._id.toString());
    const updatedEvent = await eventData.update(event1._id.toString(), event1);
    // update user2 to add event1's id to registeredEvents
    const user2addevent1 = await eventData.get(event1._id.toString());
    user2.registeredEvents.push(user2addevent1._id.toString());
    const updatedUser = await userData.update(user2._id.toString(), user2);
    console.log(updatedEvent);
    console.log(updatedUser);

    // get all events
    let getEvents = await eventData.getAll();
    console.log(getEvents);

} catch (error) {
    console.log(error)
}


//the password and email combination here is valid. 
try {
    let findJonSnow = await users.checkUser("john.snow@gmail.com", "password")
    console.log(findJonSnow)
} catch (error) {
    console.log(error)
}

try {
    // this is a duplicate EMAIL we are trying to create. Thus it should fail
    let shouldFailOne= await users.create("John", "Snow", "john.snow", "john.snow@gmail.com", "01/01/1900","password");
    console.log(shouldFailOne)
} catch (error) {
    console.log(error)
}

try {
    // this is a duplicate USERNAME we are trying to create. Thus it should fail
    let shouldFailTwo= await users.create("John", "Snow", "john.snow", "john.snow@stevens.edu", "01/01/1900","password");
    console.log(shouldFailTwo)
} catch (error) {
    console.log(error)
}

//invalid email and password combination thus we throw an error
try {
    let shouldFailThree = await users.checkUser("john.snow@gmail.com", "wrongpassword")
    console.log(findJonSnow)
} catch (error) {
    console.log(error)
}

try {
    // create user1
    let user1= await users.create("Roland", "John", "rolandjohn92", "arjay92@msn.com", "08/13/2020","password");
    console.log(user1)
} catch (error) {
    console.log(error)
}

console.log('Done!')
await closeConnection();
