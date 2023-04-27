import { dbConnection } from './mongoConnection.js';

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

// Note: You will need to change the code below to have the collection required by the assignment!
export const users = getCollectionFn('users');
<<<<<<< HEAD
export const functions = getCollectionFn("functions")
=======
export const events = getCollectionFn('events')
>>>>>>> 26d099b0475b500e57cc9d606cc0354880d8525f
