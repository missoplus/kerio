const express = require('express');
const logger = require('morgan');
const jwtSecret = require('./config/jwt')
const bodyParser = require('body-parser');
const servers = require('./routes/servers') ;
const users = require('./routes/users');
const groups = require('./routes/groups');
const requestLogger = require('./middleware/request.middleware')
const mongoose = require('./config/db'); //database configuration
const jwtMiddleware = require('./middleware/jwt.middleware')
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cors = require('cors');
const bodParser = require('body-parser');
const authRoutes = require('./routes/auth-routes');
const homeRoutes = require('./routes/home-routes');
const app = express();
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(bodParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(homeRoutes.routes);
app.use(authRoutes.routes);
// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
// const app=express()
app.set('secretKey', 'nodeRestApi'); // jwt secret token
// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
//app.use(requestLogger);
// public route
app.use('/users', users);
// private route
app.use('/servers', jwtMiddleware, servers);
app.use('/groups', jwtMiddleware, groups);
// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// handle errors
app.use(function(err, req, res, next) {
    console.log(err);

    if(err.status === 404)
        res.status(404).json({message: "Not found"});
    else
        res.status(500).json({message: "Something looks wrong :( !!!"});
});
app.listen(8000, function(){
    console.log('Node server listening on port 8000');
});
