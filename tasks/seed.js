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
        user5._id.toString(), // partyHost
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

    // create event2
    let event2 = await eventData.create(
        user6._id.toString(), // partyHost
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
        ["Rock", "Pop", "Hip-Hop"], // musicType
        [], // functionComments
        "Jlo's crib" //venue
    );
    console.log(event2);

    let event3 = await eventData.create(
        user3._id.toString(), // partyHost
        "Madison Square Garden Show", // name
        "07/04/2023", // date
        false, // hasOccured
        [], // guestsAttending
        1000, // maximumCapacity
        ["Live Show", "Concert"], // category
        "JAY Z Performance", // description
        21, // minimumAge
        "4 Pennsylvania Plaza New York NY 10001 USA", // location
        100, // price
        ["Rock", "Pop", "Hip-Hop"], // musicType
        [], // functionComments
        "MSG" //venue
    );
    console.log(event3);


    let event4 = await eventData.create(
        user3._id.toString(), // partyHost
        "Let's Get Wasted at The Clover", // name
        "08/15/2023", // date
        false, // hasOccured
        [], // guestsAttending
        50, // maximumCapacity
        ["Bar", "Concert"], // category
        "We're just going to drink until we can't see straight. Moscow Mules for days.", // description
        21, // minimumAge
        "210 Smith St Brooklyn NY 11201 USA", // location
        20, // price
        ["Rock", "Pop", "Hip-Hop", "Indie", "Alternative"], // musicType
        [], // functionComments
        "The Clover" //venue
    );
    console.log(event4);


    //for event5 add user3
    let event5 = await eventData.create(
        user3._id.toString(), // partyHost
        "Hoboken Hobo Activities", // name
        "09/15/2023", // date
        false, // hasOccured
        [], // guestsAttending
        50, // maximumCapacity
        ["Bar", "Live Show"], // category
        "Honestly, I ran out of creativity for events right around this mark.", // description
        21, // minimumAge
        "1301 Sinatra Dr Hoboken NJ 07030 USA", // location
        20, // price
        ["Rock", "Indie", "Alternative"], // musicType
        [], // functionComments
        "The Big Boat on Pier 13" //venue
    );
    console.log(event5)

    let event6 = await eventData.create(
        user5._id.toString(), // partyHost
        "Cool Soul Concert", // name
        "06/15/2023", // date
        false, // hasOccured
        [], // guestsAttending
        19000, // maximumCapacity
        ["Concert", "Live Show"], // category
        "D'Angelo and Lauryn Hill Live In Concert!!.", // description
        21, // minimumAge
        "620 Atlantic Ave Brooklyn NY 11217 USA", // location
        100, // price
        ["Throwbacks", "R&B", "Hip-Hop"], // musicType
        [], // functionComments
        "Barclays Center" //venue
    );
    console.log(event6)

    let event7 = await eventData.create(
        user5._id.toString(), // partyHost
        "Kendrick Lamar in Concert!", // name
        "06/09/2023", // date
        false, // hasOccured
        [], // guestsAttending
        19000, // maximumCapacity
        ["Concert", "Live Show"], // category
        "Kendrick Lamar newest Album Mr. Morale and The Big Steppers.", // description
        18, // minimumAge
        "2400 Hempstead Turnpike Elmont NY 11003 USA", // location
        100, // price
        ["Indie", "R&B", "Hip-Hop"], // musicType
        [], // functionComments
        "UBS Arena" //venue
    );
    console.log(event7)

    let event8 = await eventData.create(
        user5._id.toString(), // partyHost
        "Kendrick Lamar in Concert!", // name
        "06/09/2023", // date
        false, // hasOccured
        [], // guestsAttending
        19000, // maximumCapacity
        ["Concert", "Live Show"], // category
        "Kendrick Lamar newest Album Mr. Morale and The Big Steppers.", // description
        18, // minimumAge
        "2400 Hempstead Turnpike Elmont NY 11003 USA", // location
        100, // price
        ["Indie", "R&B", "Hip-Hop"], // musicType
        [], // functionComments
        "UBS Arena" //venue
    );

    console.log(event8);
    
    // // update event1 to add user5's id to guestsAttending

    event1.guestsAttending.push(user5._id.toString());
    const updatedEvent = await eventData.update(event1._id.toString(), event1);
    // update user5 to add event1's id to registeredEvents
    const user5addevent1 = await eventData.get(event1._id.toString());
    user5.registeredEvents.push(user5addevent1._id.toString());
    const updatedUser = await userData.update(user5._id.toString(), user5);
    console.log(updatedEvent);
    console.log(updatedUser);

    // // update event2 to add user6's id to guestsAttending

    event2.guestsAttending.push(user6._id.toString());
    const updatedEvent2 = await eventData.update(event2._id.toString(), event2);
    // update user6 to add event1's id to registeredEvents
    const user6addevent2 = await eventData.get(event2._id.toString());
    user6.registeredEvents.push(user6addevent2._id.toString());
    const updatedUser2 = await userData.update(user6._id.toString(), user6);
    console.log(updatedEvent2);
    console.log(updatedUser2);


    //add user3 to event3 registered events
    event3.guestsAttending.push(user3._id.toString());
    const updatedEvent3 = await eventData.update(event3._id.toString(), event3);
    // update user2 to add event1's id to registeredEvents
    const user3addevent3 = await eventData.get(event3._id.toString());
    user3.registeredEvents.push(user3addevent3._id.toString());
    const updatedUser3 = await userData.update(user3._id.toString(), user3);
    console.log(updatedEvent3);
    console.log(updatedUser3);

    //to event4 you have to add user3
    event4.guestsAttending.push(user3._id.toString());
    const updatedEvent4 = await eventData.update(event4._id.toString(), event4);
    // update user2 to add event1's id to registeredEvents
    const user3addevent4 = await eventData.get(event4._id.toString());
    user3.registeredEvents.push(user3addevent4._id.toString());
    const updatedUser32 = await userData.update(user3._id.toString(), user3);
    console.log(updatedEvent4);
    console.log(updatedUser32);

    //for event5 add user3
    event5.guestsAttending.push(user3._id.toString());
    const updatedEvent5 = await eventData.update(event5._id.toString(), event5);
    // update user2 to add event1's id to registeredEvents
    const user3addevent5 = await eventData.get(event5._id.toString());
    user3.registeredEvents.push(user3addevent5._id.toString());
    const updatedUser30 = await userData.update(user3._id.toString(), user3);
    console.log(updatedEvent5);
    console.log(updatedUser30);

    //add event6 to user5
    event6.guestsAttending.push(user5._id.toString());
    const updatedEvent6 = await eventData.update(event6._id.toString(), event6);
    // update user5 to add event6's id to registeredEvents
    const user5addevent6 = await eventData.get(event6._id.toString());
    user5.registeredEvents.push(user5addevent6._id.toString());
    const updatedUser31 = await userData.update(user5._id.toString(), user5);
    console.log(updatedEvent6);
    console.log(updatedUser31);

    //update event7 with user5
    event7.guestsAttending.push(user5._id.toString());
    const updatedEvent7 = await eventData.update(event7._id.toString(), event7);
    // update user5 to add event6's id to registeredEvents
    const user5addevent7 = await eventData.get(event7._id.toString());
    user5.registeredEvents.push(user5addevent7._id.toString());
    const updatedUser52 = await userData.update(user5._id.toString(), user5);
    console.log(updatedEvent7);
    console.log(updatedUser52);

    //add event8 to user5
    event8.guestsAttending.push(user5._id.toString());
    const updatedEvent8 = await eventData.update(event8._id.toString(), event8);
    // update user5 to add event6's id to registeredEvents
    const user5addevent8 = await eventData.get(event8._id.toString());
    user5.registeredEvents.push(user5addevent8._id.toString());
    const updatedUser53 = await userData.update(user5._id.toString(), user5);
    console.log(updatedEvent8);
    console.log(updatedUser53);

    


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
