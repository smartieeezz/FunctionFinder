import { ObjectId } from 'mongodb';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import users from '../data/users.js'
import events from '../data/events.js'
import { eventData } from '../data/index.js';
import { userData } from '../data/index.js';
// import { events } from '../config/mongoCollections.js';

//lets drop the database each time this is run


const db = await dbConnection();
await db.dropDatabase();

try {
    // create user1
    let user1= await users.create("John", "Snow", "john.snow", "john.snow@gmail.com", "01/01/1960","Javascript99!", ["Alternative", "Indie"]);
    console.log(user1)

    let user2= await users.create("Mary", "Anne", "mary.anne", "mary.anne@gmail.com", "01/01/2000","Password99!", ["Jazz"]);
    console.log(user2)

    let user3= await users.create("Roland", "John", "arjay", "rjohn5@stevens.edu", "08/15/1992","Geoffrey92!", ["R&B", "Indie"]);
    console.log(user3)

    let user4= await users.create("Tanner", "Marshall", "t.marshall", "tmarsha1@stevens.edu", "01/01/2002","Password123!", ["Alternative", "Indie"]);
    console.log(user4)

    let user5= await users.create("Stephanie", "Martinez", "s.martinez", "smartin7@stevens.edu", "01/01/2002","Password123!", ["Caribbean", "R&B", "Pop"]);
    console.log(user5)

    let user6= await users.create("Hao", "Li", "h.li", "hli144@stevens.edu", "01/01/2002","Password123!", ["Caribbean", "Pop", "Throwbacks"]);
    console.log(user6)

    let user7= await users.create("Hasani", "Edwards", "h.edwards", "hasan.edwards@gmail.com", "05/15/1970","Password123!", ["Caribbean", "Hip Hop","Pop", "Throwbacks", "R&B"]);
    console.log(user7)

    let user8= await users.create("Neadria", "Hazel", "n.hazel", "neadria.hazel@gmail.com", "04/15/1995","Password123!", ["Caribbean", "Hip Hop","Pop", "Throwbacks", "R&B", "Rock", "Pop"]);
    console.log(user8)

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
        "3467 VIRGINIA RD LOS ANGELES CA 90016-4231 USA", // location
        69, // price
        ["Rock", "Pop"], // musicType
        [], // functionComments
        "Keanu's House" //venue
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
        "1301 W 27TH ST LOS ANGELES CA 90007-2261 USA", // location
        420, // price
        ["Rock", "Pop", "Hip Hop"], // musicType
        [], // functionComments
        "Jlo's crib" //venue
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
//This will find the user and display the welcome message because it is a valid test
try {
    let getuser2 = await users.checkUser("mary.anne@gmail.com", "cs546")
    console.log(getuser2)
} catch (error) {
    console.log(error)
}

console.log('Done!')
await closeConnection();
