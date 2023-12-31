import { ObjectId } from "mongodb";
import { users, events } from "../config/mongoCollections.js";
import { checkAge, checkName, checkEmail,checkPassword, checkString } from "../helpers/validation.js";
import bcrypt from 'bcrypt'
const saltRounds = 12;
import userData from "./users.js";


const exportedMethods = {
    async create(
        firstName,
        lastName,
        username,
        email,
        dateOfBirth,
        password, 
        favoriteCategories
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
        if (!favoriteCategories) {
            throw  `Error: All of the fields must be filled.`
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

        //check if we have a valid email address and if we do then convert to lowercase and trim it
        email = checkEmail(email);
        //If the firstName, lastName or username are empty strings we will throw an error
        firstName = firstName.trim();
        lastName = lastName.trim();
        username = username.trim();
        dateOfBirth = dateOfBirth.trim();

        dateOfBirth = checkAge(dateOfBirth);
        //connect to our database for users
        const usersCollection = await users();
        const existingEmail = await usersCollection.findOne({ email: email.toLowerCase() });
        //if we have that email address in our database already then we will throw an error
        if (existingEmail) {
            throw 'Error: A user with that email address already exists.'; 
        }
        const existingUserName = await usersCollection.findOne({ username: username.toLowerCase() });
        //if we have that username in our database already then we will throw an error
        if (existingUserName) {
            throw 'Error: A user with that username already exists.'; 
        }

        if (firstName == "") {
        throw `Error: The name cannot consist of just empty space`;
        }
        if (lastName == "") {
        throw `Error: The name cannot consist of just empty space`;
        }
        if (username == "") {
        throw `Error: The name cannot consist of just empty space`;
        }
        dateOfBirth = checkAge(dateOfBirth);
        
        //use bcrypt to hash the passwords

        //hashed password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        let newUser = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        dateOfBirth: dateOfBirth,
        password: hashedPassword,
        favoritedEvents: [],
        registeredEvents: [],
        pastEventsAttended:[],
        favoriteCategories: favoriteCategories,
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

    async checkUser (emailAddress, password) {
        //Both emailAddress and password must be supplied or you will throw an error
        if (!emailAddress) {
            throw `Error: The Email Address must be provided.`;
        }
        if (!password) {
            throw `Error: The password must be provided.`;
        }
        //emailAddress should be a valid email address format. example@example.com
        emailAddress = checkEmail(emailAddress);
        password = checkPassword(password)
        
        // emailAddress = emailAddress.trim()

        /*Query the db for the emailAddress supplied, if it is not found, throw an error stating 
        "Either the email address or password is invalid".*/
        const usersCollections = await users();
        const existingUser = await usersCollections.findOne({ email: emailAddress.toLowerCase()});
        if (!existingUser) {
            throw 'Invalid username/password.'; 
        }
        /*If the emailAddress supplied is found in the DB, you will then use bcrypt to compare the
        hashed password in the database with the password input parameter.*/
        const passwordsMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordsMatch) {
            throw `Invalid username/password.`;
        }
        return existingUser;

    },

    async get (id) {
        //check if the id exists
        if (!id) {
            throw `Error: The ID must be provided. `;
        }
        //check if the id is a string
        if (typeof id!=='string') {
            throw `Error: The ID must be a string.`;
        }
        //trim the id to get rid of whitespace at the edges of the string
        id = id.trim();
        if (id.length==0 || id=="") {
            throw `Error: The ID must not be empty spaces.`;
        }
    
        //if we hve no errors from the ID we can just load the bands database now
        if (!ObjectId.isValid(id)) {
            throw 'invalid object ID';
        }
        const usersCollection = await users();
        const thisUser = await usersCollection.findOne({_id: new ObjectId(id)});
        if (thisUser === null) {
            throw 'Error: No user with that id';
        }
        thisUser._id = thisUser._id.toString();
    
        return thisUser;
    },

    async getName(id) {
        // check if the id is valid
        if (!ObjectId.isValid(id)) {
          throw "Invalid id";
        }
      
        const usersCollection = await users();
        const user = await usersCollection.findOne(
          { _id: new ObjectId(id) },
          { firstName: 1, lastName: 1, username: 1 }
        );
      
        if (!user) {
          throw "User not found";
        }
      
        user._id = user._id.toString();
        return user;
    },      

    async getByEmail(email) {
        if (!email) {
            throw `Error: The email was not given.`;
        }
        email = email.trim();
        let thisEmail = checkEmail(email)
        const usersCollection = await users();
        const thisUser = await usersCollection.findOne({email:thisEmail});

        if (thisUser) {
            throw `Error: The email ${email} was used already.`;
        }
    },

    async getByEmailUpdate(email) {
      if (!email) {
        throw 'Error: The email was not given.';
      }
      email = email.trim()
      email = checkEmail(email)
      const usersCollection = await users();
      const user = await usersCollection.findOne({ email });
    
      return user;
    },
    
    async getUserByUsername(username) {
        const usersCollections = await users();
        const thisUser = await usersCollections.findOne({ username });
        return thisUser;
    },

    async updateRegisteredEvents(userId, eventId, action) {
        const usersCollection = await users();
        const user = await this.get(userId);
        if (!user) {
            throw new Error(`User with id ${userId} not found.`);
        }
      
        if (action === 'register') {
            user.registeredEvents.push(eventId);
            const updatedUser = await usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $set: { registeredEvents: user.registeredEvents } }
            );
            if (updatedUser.modifiedCount === 0) {
                throw "Error: Could not update user's registered events.";
            }
        } 
        else if (action === 'unregister') {
            user.registeredEvents = user.registeredEvents.filter(event => event !== eventId);
            const updatedUser = await usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $set: { registeredEvents: user.registeredEvents } }
            );
            if (updatedUser.modifiedCount === 0) {
                throw "Error: Could not update user's registered events.";
            }
        }
      
        return await this.get(userId);
    },      

    async update(id, updatedUser) {
        if (!id) throw "You must provide an ID";
        if (!updatedUser) throw "You must provide an updated user";
        const usersCollection = await users();
        const updateObj = {};
        for (let key in updatedUser) {
          if (key !== '_id') {
            updateObj[key] = updatedUser[key];
          }
        }
        const updateInfo = await usersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateObj }
        );
        if (updateInfo.modifiedCount === 0) {
          throw `Could not update user with ID of ${id}`;
        }
        return await this.get(id);
    },

    async updateCurrentlyHostingEvents(userId, eventId, action) {
        const user = await this.get(userId);
        const currentlyHostingEvents = user.currentlyHostingEvents || [];
        let updatedCurrentlyHostingEvents;
        if (action === 'add') {
          updatedCurrentlyHostingEvents = [...currentlyHostingEvents, eventId];
        } else if (action === 'remove') {
          updatedCurrentlyHostingEvents = currentlyHostingEvents.filter(event => event !== eventId);
        } else {
          throw "Invalid action provided. Must be 'add' or 'remove'.";
        }
        const updatedUser = { ...user, currentlyHostingEvents: updatedCurrentlyHostingEvents };
        return await this.update(userId, updatedUser);
      },
      
      async updatePastEventsAttended(userId, eventId, action) {
        const user = await this.get(userId);
        const pastEventsAttended = user.pastEventsAttended || [];
        let updatedPastEventsAttended;
        if (action === 'add') {
          updatedPastEventsAttended = [...pastEventsAttended, eventId];
        } else if (action === 'remove') {
          updatedPastEventsAttended = pastEventsAttended.filter(event => event !== eventId);
        } else {
          throw "Invalid action provided. Must be 'add' or 'remove'.";
        }
        const updatedUser = { ...user, pastEventsAttended: updatedPastEventsAttended };
        return await this.update(userId, updatedUser);
      },

    async updatePreviouslyHostedEvents(id, eventId, action) {
        if (!id) throw "You must provide an ID";
        if (!eventId) throw "You must provide an event ID";
        if (!action) throw "You must provide an action (add or remove)";
        const usersCollection = await users();
        const updateObj = {};
        const user = await this.get(id);
        const events = user.previouslyHostedEvents || [];
        if (action === 'add') {
          events.push(eventId);
        } else if (action === 'remove') {
          const index = events.indexOf(eventId);
          if (index > -1) {
            events.splice(index, 1);
          }
        } else {
          throw "Invalid action. Must be add or remove.";
        }
        updateObj.previouslyHostedEvents = events;
        const updateInfo = await usersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateObj }
        );
        if (updateInfo.modifiedCount === 0) {
          throw `Could not update user with ID of ${id}`;
        }
        return await this.get(id);
      },
      
    //we will use this function to update the user details in the settings field
    async updateUser(id, updatedUser) {
        const user = await this.get(id);
        const usersCollection = await users()
        if (!user) {
            throw `Error: User: ${id} not found`;
        }
        let updatedUserInfo = {};
        if (updatedUser.firstName) {
            updatedUserInfo.firstName = checkName(updatedUser.firstName)
            updatedUserInfo.firstName = updatedUser.firstName;
        }
        if (updatedUser.lastName) {
            updatedUserInfo.lastName = checkName(updatedUser.lastName)
            updatedUserInfo.lastName = updatedUser.lastName;
        }
        // if (updatedUser.username) {
        //     updatedUserInfo.username = checkString(updatedUser.username)
        //     const existingUser = await this.getUserByUsername(updatedUser.username);
        //     if (existingUser && existingUser._id.toString() !== id) {
        //         throw "Username already exists. Please choose another username.";
        //     }
        
        // }
        if (updatedUser.email) {
            updatedUserInfo.email = checkEmail(updatedUser.email)
            const existingUser = await this.getByEmailUpdate(updatedUser.email)
            if (existingUser && existingUser._id.toString()!==id) {
                throw `Email:${updatedUser.email} already exists. Please choose another email.`
            }
            updatedUserInfo.email = updatedUser.email;
        }
        if (updatedUser.dateOfBirth) {
            updatedUserInfo.dateOfBirth = checkAge(updatedUser.dateOfBirth)
            updatedUserInfo.dateOfBirth = updatedUser.dateOfBirth;
        }
        if (updatedUser.password) {
            updatedUserInfo.password= checkPassword(updatedUser.password)
            updatedUserInfo.password = await bcrypt.hash(updatedUser.password, saltRounds);
        }
        if (updatedUser.favoriteCategories) {
            updatedUserInfo.favoriteCategories = updatedUser.favoriteCategories;
        }
        const updatedInfo = await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedUserInfo });
        if (updatedInfo.modifiedCount === 0) {
                throw `Could not update user with id ${id}`;
        }
        return this.get(id);
    },

    async getUsername(id) {
        try {
            const userCollection = await users();
            const user = await userCollection.findOne({ _id: new ObjectId(id) });
            if (user) {
              return user.username;
            } else {
              return null;
            }
          } catch (e) {
            throw new Error(`Error finding username: ${e}`);
          }
    },

    async addComment(eventId, userId, comment) {
        if (!eventId) throw "You must provide an eventId";
        if (!userId) throw "You must provide a userId";
        if (!comment) throw "You must provide a comment";
        if (comment.length > 280) throw "Comment cannot be more than 280 characters";
      
        const usersCollection = await users();
        const userObj = await usersCollection.findOne({ _id: new ObjectId(userId) });
      
        if (!userObj) throw "User not found";
        
        const username = await userData.getUsername(userId);
      
        const newComment = { user: { id: userId, name: username }, comment, timestamp: Date.now() };
        userObj.userComments.push(newComment);

        const updatedInfo = await usersCollection.updateOne({ _id: userObj._id }, { $set: userObj });
        if (updatedInfo.modifiedCount === 0) throw "Could not add comment";

        return newComment;
      },


      async findPartiesUserHosts(id) {
        //get functionCollection
        const functionCollection = await events()
        const functionsHosted = await functionCollection.find({ partyHost: id }).toArray();
        // if (functionsHosted.length===0) {
        //     return ["Not hosting any parties :("]
        // }
        return functionsHosted;
      },

      async findPartiesUserAttending(id) {
        //get functionCollection and find today's date
        const today = new Date();
        const functionCollection = await events()
        
        //get all the functions we are attending in the form of an array
        const functionsAttending = await functionCollection.find({ partyHost: id }).toArray();
        const previouslyAttended = functionsAttending.filter(func => new Date(func.date) < today)

        //return these functions
        // if (functionsAttending.length===0) {
        //     return ["Not attending any parties :("]
        // }
        return functionsAttending;
      },
      
      async find(query) {
        const usersCollection = await users();
        const users = await usersCollection.find(query).toArray();
        return users;
      },

      async findPartiesPreviouslyAttended(id) {
        //get functionCollection and find today's date
        const today = new Date();
        const functionCollection = await events()
        
        //get all the functions we are attending in the form of an array
        const functionsAttending = await functionCollection.find({ partyHost: id }).toArray();
        const previouslyAttended = functionsAttending.filter(func => new Date(func.date) < today)

        //return these functions
        // if (functionsAttending.length===0) {
        //     return ["Not attending any parties :("]
        // }
        return previouslyAttended;
      }

      
      
}      

export default exportedMethods;



