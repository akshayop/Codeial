const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// Used for session cookies
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport_local_strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-startegy');

const MongoStore = require('connect-mongo');
const flash =require('connect-flash');
const customMware = require('./config/middleware')

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));

// Make the upload path available to browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayouts);

// extract the style  and scripts from subpages into the layouts
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);




// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


// mongo store is ude to store the session cookies in the db 
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/session',
        autoRemove: 'disabled'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);


//  use express router

app.use('/', require('./routes'));

app.listen(port, (err) => {
    if(err) {
        console.log('error', err);
        return;
    }

    console.log(`server is successfully running on Port: ${port}`);
});