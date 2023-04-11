import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import { checkAge } from "../helpers/validation.js";
import userData from "./users.js";


const exportedMethods = {
    async create(
        firstName,
        lastName,
        username,
        email,
        dateOfBirth,
        password
    ) {
        /*check to make sure all fields were provided. If all field was not provided then throw and error
        reminding the user to provide all fields.*/
        if (!firstName) {
        throw `Error: All of the fields must be filled.`;
        }
        if (!lastName) {
        throw `Error: All of the fields must be filled.`;
        }
        if (!username) {
        throw `Error: All of the fields must be filled.`;
        }
        if (!email) {
        throw `Error: All of the fields must be filled.`;
        }
        if (!dateOfBirth) {
        throw `Error: All of the fields must be filled.`;
        }
        if (!password) {
            throw `Error: All of the fields must be filled.`
        }
        //If the firstName, lastName or username are not strings we will throw an error
        if (typeof firstName !== "string") {
        throw `Error: The name must be a string type value.`;
        }
        if (typeof lastName !== "string") {
        throw `Error: The name must be a string type value.`;
        }
        if (typeof username !== "string") {
        throw `Error: The name must be a string type value.`;
        }

        //If the firstName, lastName or username are empty strings we will throw an error
        firstName = firstName.trim();
        lastName = lastName.trim();
        username = username.trim();
        email = email.trim()
        dateOfBirth = dateOfBirth.trim()
        password = password.trim()
        if (firstName == "") {
        throw `Error: The name cannot consist of just empty space`;
        }
        if (lastName == "") {
        throw `Error: The name cannot consist of just empty space`;
        }
        if (username == "") {
        throw `Error: The name cannot consist of just empty space`;
        }
        checkAge(dateOfBirth)
        const usersCollection = await users();

        let newUser = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        dateOfBirth: dateOfBirth,
        password: password,
        favoritedEvents: [],
        registeredEvents: [],
        pastEventsAttended:[],
        favoriteCategories: [],
        userComments: [],
        currentlyHostingEvents: [],
        previouslyHostedEvents: []
        };

        const insertInfo = await usersCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) {
            throw `Error: Could not insert new band.`;
        }
        //get ID for user
        const newId = await insertInfo.insertedId.toString();
        //create newID as a string
        const user = await this.get(newId.toString());
        //turn the _id to a string and assign it to the band
        user._id = user._id.toString();
        return await user;
    },
    async get (id) {
        //check if the id exists
    if (!id) {
        throw `Error: The ID must be provided. `
    }
    //check if the id is a string
    if (typeof id!=='string') {
        throw `Error: The ID must be a string.`
    }
    //trim the id to get rid of whitespace at the edges of the string
    id = id.trim()
    if (id.length==0 || id=="") {
        throw `Error: The ID must not be empty spaces.`
    }
    
    //if we hve no errors from the ID we can just load the bands database now
    if (!ObjectId.isValid(id)) {
        throw 'invalid object ID'
    }
    const usersCollection = await users();
    const thisUser = await usersCollection.findOne({_id: new ObjectId(id)});
    if (thisUser === null) {
        throw 'Error: No user with that id';
    }
    thisUser._id = thisUser._id.toString();
    
    return thisUser;
    },
    async getByEmail(email) {
        if (!email) {
            throw `Error: The email was not given.`
        }
        email = email.trim()
        const usersCollection = await users()
        const thisUser = await usersCollection.find({email})

        if (typeof thisUser!=='undefined' || thisUser!==null) {
            throw `Error: The email was used already.`
        }
    }
};

export default exportedMethods;
