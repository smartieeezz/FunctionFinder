import express from 'express';
const app = express();
import session from 'express-session';
import configRoutes from './routes/index.js';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import exphbs from 'express-handlebars';
import { closeConnection, dbConnection } from './config/mongoConnection.js';

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
app.use(express.json());

app.use(
  session({
    name: 'AuthCookie',
    secret: "Secret",
    saveUninitialized: false,
    resave: false,
  })
);

//Middleware to make sure the user can only access their own account settings
// app.use('/account/settings/:id', (req, res, next) => {
//   const userId = req.params.id;
//   const validatedUser = req.session.userId;
//   console.log(userId)
//   console.log(validatedUser)

//   if (!validatedUser || validatedUser.id !== userId) {
//     res.render('error', { message: 'You do not have permission to access this page' });
//   }

//   next();
// });



// app.use('/account/login', (req, res, next) => {
//   // Check if the user is already authenticated
//   if (req.session.user) {
//     // If the user is authenticated and has the role of admin, redirect to the /admin route
//     if (req.session.user.role === 'admin') {
//       return res.redirect('/admin');
//     }
//     // If the user is authenticated and has the role of user, redirect to the /protected route
//     if (req.session.user.role === 'user') {
//       return res.redirect('/protected');
//     }
//   }
//   // If the user is not authenticated, allow them to get through to the GET /login route
//   next();
// })


// app.use('/:id', (req, res, next) => {
//   if(!req.session.user)
//     return res.redirect('/account/login');
//   next();
// });

// app.use('/', (req, res, next) => {
//   if(req.session.user)
//     res.redirect('')
// });

app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.get('/', (req, res) => { res.render('homepage');});

const db = await dbConnection();


configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
