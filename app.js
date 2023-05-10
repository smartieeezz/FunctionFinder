import express from 'express';
const app = express();
import session from 'express-session';
import configRoutes from './routes/index.js';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import exphbs from 'express-handlebars';
import { closeConnection, dbConnection } from './config/mongoConnection.js';
import bodyParser from 'body-parser';




const apiKey = process.env.API_KEY
let loggedIn = false;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + '/public');

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }

  // let the next middleware run:
    next();
};

app.use('/public', staticDir);

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use(
  session({
    name: 'AuthCookie',
    secret: "Secret",
    saveUninitialized: false,
    resave: false,
  })
);

//Middleware to make sure the user can only access their own account settings
app.use('/account/settings', (req, res, next) => {
  if(!req.session.user){
    loggedIn = false;
    return res.redirect('/account/login');
  }
  next();
});



app.use('/account/login', (req, res, next) => {
  // Check if the user is already authenticated
  if (req.session.user) {
    loggedIn = true;
    return res.redirect('/');
  }
  // If the user is not authenticated, allow them to get through to the GET /login route
  next();
});


app.use('/postaparty', (req, res, next) => {
  if(!req.session.user)
  {
    loggedIn = false;
    return res.redirect('/account/login');
  }
  next();
});
app.use('/account/parties', (req, res, next) => {
  if(!req.session.user)
  {
    loggedIn = false;
    return res.redirect('/account/login');
  }
  next();
});

app.use('/cancelanevent', (req, res, next) => {
  if(!req.session.user){
    loggedIn = false;
    return res.redirect('/account/login');
  }
  next();  
});


app.use('/registered-events', (req, res, next) => {
  if(!req.session.user){
    loggedIn = false;
    return res.redirect('/account/login');
  }
  next();  
});

app.use('/favorited-events', (req, res, next) => {
  if(!req.session.user){
    loggedIn = false;
    return res.redirect('/account/login');
  }
  next();  
});

app.use('/account/settings', (req, res, next) => {
  if(!req.session.user){
    loggedIn = false;
    return res.redirect('/account/login');
  }
  next();  
});

app.use('/account/create', (req, res, next) => {
  if (req.session.user) {
    loggedIn = true;
    return res.redirect('/');
  }
  // If the user is not authenticated, allow them to get through to the GET /login route
  next();
});


app.use('/events/:id/info', (req, res, next) => {
  if(!req.session.user){
    loggedIn = false;
    return res.redirect('/account/login');
  }
  next();  
});
app.use('/events/:id/guests', (req, res, next) => {
  if(!req.session.user){
    loggedIn = false;
    return res.redirect('/account/login');
  }
  next();  
});

app.use('/events/:id/comments', (req, res, next) => {
  if(!req.session.user){
    loggedIn = false;
    return res.redirect('/account/login');
  }
  next();  
});



app.use('/', (req, res, next) => {
  if (req.session.user)
    loggedIn = true;
  else
    loggedIn = false;
  next();
})


app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.get('/', (req, res) => { res.render('homepage', {apiRoute : `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`, hasUser: loggedIn})});

const db = await dbConnection();


configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
