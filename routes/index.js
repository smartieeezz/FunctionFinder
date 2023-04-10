//Here you will import route files and export them as used in previous labs
import userRoutes from './users.js';
import path from 'path'

const constructorMethod = (app) => {

    app.use('/', userRoutes);
    app.use('*', (req, res) => {
    res.status(404).json({error: 'Route Not found!'});
    });
};

export default constructorMethod;
