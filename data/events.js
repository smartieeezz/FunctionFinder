import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import { events } from "../config/mongoCollections.js";
import eventData from "./events.js";
import userData from './users.js'

const exportedMethods = {
    async get(id) {
        if (!id) throw "Must provide an ID";
        const eventsCollection = await events();
        const getEvent = await eventsCollection.findOne({ _id: new ObjectId(id) });
        if (!getEvent) throw `No event with id ${id}`;
        return getEvent;
    },

    async getAll() {
        const eventsCollection = await events();
        const allEvents = await eventsCollection.find({}).toArray();
        return allEvents;
    },
    async delete(id) {
        if (!id){
            throw "Error: Must provide an ID"
        }
        const eventsCollection = await events();
        const deletionInfo = await eventsCollection.deleteOne({ _id: new ObjectId(id) });
        if (deletionInfo.deletedCount === 0) {
            throw `Error: Could not delete event with id ${id}`;
        }
        return deletionInfo.deletedCount;
    },
    async deleteAll(id) {
        if (!id) {
            throw "Error: Must provide an ID"
        }
        //get the function with the get method
        const party = await this.get(id);
        // Check if the event has occurred yet
        const eventDate = new Date(party.date);
        const today = new Date();
        if (eventDate <= today) {
            throw "Error: You cannot delete a party that has already happened.";
        }

        //get the events in the database
        const functionCollections = await events();
        //delete the events in the collection that have this database
        const deletionInfo = await functionCollections.deleteMany({_id: new ObjectId(id)});
        if (deletionInfo.deletedCount == 0) {
            throw `Error: Could not delete event with id ${id}`;
        }
        // Delete the event from all users' registeredEvents
        const usersCollection = await users();

        const updateResult = await usersCollection.updateMany(
            { registeredEvents: id },
            { $pull: { registeredEvents: id } }
        );
        if (updateResult.modifiedCount == 0) {
            throw `Error: Could not delete event ${id} from users' registeredEvents`;
        }
        return deletionInfo.deletedCount;
        },

    // async getHostUsername(id) {
    //     const eventsCollection = await events();
    //     const event = await eventsCollection.findOne({ _id: new ObjectId(id) });
    //     if (!event) throw 'Event not found';
      
    //     const partyHostUsername = await users.getUsername(event.partyHost);
      
    //     return partyHostUsername;
    // },

    async create(partyHost, name, date, hasOccured, guestsAttending, maximumCapacity, category, description, minimumAge, location, price, musicType, functionComments, partyVenue, partyCoverPhoto) {
        if (!partyHost) {
            throw "Error: partyHost field is required.";
        }
        if (!name) {
            throw "Error: name field is required.";
        }
        if (!date) {
            throw "Error: date field is required.";
        }
        if (guestsAttending === null) {
            throw "Error: guestsAttending field is required.";
        }
        if (guestsAttending === undefined) {
            throw "Error: guestsAttending field is required.";
        }
        if (!maximumCapacity) {
            throw "Error: maximumCapacity field is required.";
        }
        if (!category) {
            throw "Error: category field is required.";
        }
        if (!description) {
            throw "Error: description field is required.";
        }
        if (!minimumAge) {
            throw "Error: minimumAge field is required.";
        }
        if (!location) {
            throw "Error: location field is required.";
        }
        if (!price) {
            throw "Error: price field is required.";
        }
        if (!musicType) {
            throw "Error: musicType field is required.";
        }
        if (!partyVenue){
            throw "Error: party venue field is required."
        }

        const eventsCollection = await events();
        let newId = new ObjectId()
        let newIdString = newId.toString()
        const newEvent = {
            _id: newId,
            newIdString: newIdString,
            partyHost: partyHost,
            name: name,
            date: date,
            hasOccured: hasOccured,
            guestsAttending: guestsAttending,
            maximumCapacity: maximumCapacity,
            category: category,
            description: description,
            minimumAge: minimumAge,
            location: location,
            price: price,
            musicType: musicType,
            functionComments: functionComments,
            partyVenue: partyVenue, 
            partyCoverPhoto: partyCoverPhoto

        };
        const insertInfo = await eventsCollection.insertOne(newEvent);
        if (insertInfo.insertedCount === 0) {
            throw "Could not add event.";
        }
        return newEvent
    },

    async update(id, updatedEvent) {
        if (!id) throw "Must provide an ID";
        if (!updatedEvent) throw "Must provide an updated event";
        const eventsCollection = await events();
        const updatedInfo = await eventsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedEvent }
        );
        
        if (updatedInfo.modifiedCount === 0) {
            throw `Could not update event with id ${id}`;
        }
        return await this.get(id);
    },

    async getUserComment(eventId, userId) {        
        if (!eventId) throw new Error('Event ID must be provided');
        if (!userId) throw new Error('User ID must be provided');

        const eventsCollection = await events();
        const eventObj = await eventsCollection.findOne({ _id: new ObjectId(eventId) });

        if (!eventObj) throw new Error('Event not found');

        const userComment = eventObj.functionComments
            .sort((a, b) => a.createdAt - b.createdAt)
            .filter((c) => c.user.id === userId)
            .pop();

        if (!userComment) return;

        return userComment;
    },      

    async  createComment(eventId, userId, comment) {
        
        if (!eventId) throw "You must provide an eventId";
        if (!userId) throw "You must provide a userId";
        if (!comment) throw "You must provide a comment";
        if (comment.length > 280) throw "Comment cannot be more than 280 characters";

        const usersCollection = await users();
        const eventsCollection = await events();

        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) throw "User not found";

        const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
        if (!event) throw "Event not found";

        const username = user.username;
        // const hasCommented = event.functionComments.some(c => c.user.id === userId);

        // if (hasCommented) throw "You have already commented on this event";

        const newComment = { user: { id: userId, name: username }, comment, timestamp: Date.now() };
        event.functionComments.push(newComment);

        const updatedEvent = await eventsCollection.updateOne({ _id: new ObjectId(eventId) }, { $set: event });
        if (updatedEvent.modifiedCount === 0) throw "Could not add comment to event";

        user.userComments.push({ userId, eventId, comment });
        const updatedUser = await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $set: user });
        if (updatedUser.modifiedCount === 0) throw "Could not add comment to user";

        return newComment;
    },
    async deleteOldestComment(eventId, userId) {

        // deletes the oldest comment
        if (!eventId) throw "You must provide an eventId";
        if (!userId) throw "You must provide a userId";
      
        const eventsCollection = await events();
        const eventObj = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
      
        if (!eventObj) throw "Event not found";
      
        const commentIndex = eventObj.functionComments.findIndex(c => c.user.id === userId);
      
        if (commentIndex === -1) throw "User has not commented on this event";
      
        const usersCollection = await users();
        const userObj = await usersCollection.findOne({ _id: new ObjectId(userId) });
        const userComment = userObj.userComments.find(c => c.eventId === eventId);
      
        if (!userComment) throw "User has not commented on this event";
      
        eventObj.functionComments.splice(commentIndex, 1);
        userObj.userComments.splice(userComment, 1);
      
        const updatedUserInfo = await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $set: userObj });
        if (updatedUserInfo.modifiedCount === 0) throw "Could not delete user comment";
      
        const updatedEventInfo = await eventsCollection.updateOne({ _id: new ObjectId(eventId) }, { $set: eventObj });
        if (updatedEventInfo.modifiedCount === 0) throw "Could not delete comment";
      
        return true;
    },

    async  deleteRecentComment(eventId, userId) {

        // deletes the recent comment
        if (!eventId) throw "You must provide an eventId";
        if (!userId) throw "You must provide a userId";
      
        const eventsCollection = await events();
        const eventObj = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
      
        if (!eventObj) throw "Event not found";
      
        const comments = eventObj.functionComments.slice().reverse();
        const comment = comments.find(c => c.user.id === userId);
      
        if (!comment) throw "User has not commented on this event";
      
        const commentIndex = eventObj.functionComments.indexOf(comment);
        eventObj.functionComments.splice(commentIndex, 1);
      
        const usersCollection = await users();
        const userObj = await usersCollection.findOne({ _id: new ObjectId(userId) });
      
        if (!userObj) throw "User not found";
      
        const userComment = userObj.userComments.find(c => c.eventId === eventId);
      
        if (!userComment) throw "User has not commented on this event";
      
        const userCommentIndex = userObj.userComments.indexOf(userComment);
        userObj.userComments.splice(userCommentIndex, 1);
      
        const updatedUserInfo = await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $set: userObj });
      
        if (updatedUserInfo.modifiedCount === 0) throw "Could not delete user comment";
      
        const updatedEventInfo = await eventsCollection.updateOne({ _id: new ObjectId(eventId) }, { $set: eventObj });
      
        if (updatedEventInfo.modifiedCount === 0) throw "Could not delete comment";
      
        return true;
    },

    async cancelEvent(eventId) {
        const eventCollection = await events();
        const usersCollection = await users();
      
        const event = await eventCollection.findOne({ _id: new ObjectId(eventId) });
      
        // currentlyHostingEvents and previouslyHostedEvents
        const hostUser = await usersCollection.findOne({ _id: new ObjectId(event.partyHost) });
        hostUser.currentlyHostingEvents = hostUser.currentlyHostingEvents.filter(
          (id) => id.toString() !== eventId.toString()
        );
        // hostUser.previouslyHostedEvents = hostUser.previouslyHostedEvents.filter(
        //   (id) => id.toString() !== eventId.toString()
        // );
        await usersCollection.updateOne({ _id: new ObjectId(event.partyHost) }, { $set: hostUser });
      
        // registeredEvents and pastEventsAttended
        const usersAttending = await usersCollection.find({ registeredEvents: eventId }).toArray();
        for (const user of usersAttending) {
          user.registeredEvents = user.registeredEvents.filter(
            (id) => id.toString() !== eventId.toString()
          );
          user.pastEventsAttended = user.pastEventsAttended.filter(
            (id) => id.toString() !== eventId.toString()
          );
          await usersCollection.updateOne({ _id: new ObjectId(user._id) }, { $set: user });
        }
      
        // delete event
        const deleteInfo = await eventCollection.deleteOne({ _id: new ObjectId(eventId) });
        if (deleteInfo.deletedCount === 0) {
          throw `Could not delete event with ID of ${eventId}`;
        }
    }, 
    async getGuestList(id) {
        //have to get the party first
        const event = await this.get(id)
        //then get the list of id's that represent the guests attending
        const guestList = event.guestsAttending
        console.log(guestList)
        //lets get the users to query against
        // const usersCollections = await users()
        let attendees  = []
        guestList.forEach(async guestId => {
            const guest = await userData.get(guestId)
            const guestName = `${guest.firstName} ${guest.lastName}`
            attendees.push(guestName)
        });
        

        


        return attendees
        console.log("wow")
        console.log(event.guestsAttending)
      }
      
    // add more functions
    
};

export default exportedMethods;

