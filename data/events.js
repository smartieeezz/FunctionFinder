import { ObjectId } from "mongodb";
import { events } from "../config/mongoCollections.js";
import eventData from "./events.js";
import users from './users.js'

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

    async getHostUsername(id) {
        const eventsCollection = await events();
        const event = await eventsCollection.findOne({ _id: new ObjectId(id) });
        if (!event) throw 'Event not found';
      
        const partyHostUsername = await users.getUsername(event.partyHost);
      
        return partyHostUsername;
    },

    async create(partyHost, name, date, hasOccured, guestsAttending, maximumCapacity, category, description, minimumAge, location, price, musicType, functionComments) {
        if (!partyHost || !name || !date || !guestsAttending || !maximumCapacity || !category || !description || !minimumAge || !location || !price || !musicType) {
            throw "Error: Provide all fields.";
        }
        const eventsCollection = await events();
        const newEvent = {
            _id: new ObjectId(),
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
            functionComments: functionComments
        };
        const insertInfo = await eventsCollection.insertOne(newEvent);
        if (insertInfo.insertedCount === 0) {
            throw "Could not add event.";
        }
        const newId = insertInfo.insertedId;
        const event = await this.get(newId.toString());
        return event;
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

    // add more functions
    
};

export default exportedMethods;

/*

(async () => {
    try {
      // Call the update function with valid parameters
      const eventId = "644deb018157ffaa8920aa33";
      const updatedEvent = {date: "2024-01-01" };
      const result = await eventData.getHostUsername(eventId);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  })();
  
  // */