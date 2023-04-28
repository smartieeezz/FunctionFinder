//Here you will import route files and export them as used in previous labs
import userRoutes from './users.js';
import postAPartyRoutes from './postAParty.js'
import searchResultsRoutes from './searchResults.js'
import eventRoutes from './events.js';
import path from 'path'

const constructorMethod = (app) => {
    app.use('/postaparty', postAPartyRoutes)
    app.use('/searchresults', searchResultsRoutes)
    app.use('/', userRoutes);
    app.use('/', eventRoutes);
    app.use('*', (req, res) => {
        res.status(404).json({error: 'Route Not found!'});
    });
};

export default constructorMethod;
