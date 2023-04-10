import users from '../data/users.js'
import { ObjectId } from 'mongodb';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import { userData } from '../data/index.js';

//lets drop the database each time this is run
console.log('Booting up database...!');

const db = await dbConnection();
await db.dropDatabase();

try {
    //declare the 3 bands we will want to make
    let user1= await users.create("John", "Snow", "john.snow", "john.snow@gmail.com", 
    "01/01/1900","password");
    console.log(user1)

} catch (error) {
    console.log(error)
}

console.log('Done!')
await closeConnection();
