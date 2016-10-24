var routes=require('./routes');
var session = require('express-session');
var everyauth=require('everyauth'); 
//connect=require('connect');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoskin = require('mongoskin'), 
dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/inventory',
  db = mongoskin.db(dbUrl, {safe: true});
var collections={
    articles: db.collection('articles'),
    users: db.collection('users')
};

everyauth.debug=true;
everyauth.linkedin
  .consumerKey('75px733om9plkf')
  .consumerSecret('XeQWAgIXi7uGgXnn')
  .findOrCreateUser( function (session, accessToken, accessTokenSecret, linkedinUserMetadata) {
    // find or create user logic goes here
    var promise = this.Promise();
    process.nextTick(function(){
        if (linkedinUserMetadata.firstName==='Muhammad' && linkedinUserMetadata.lastName==='Shoaib') {
          session.user = linkedinUserMetadata;
          session.admin = true;
        }
        /*if(linkedinUserMetadata.firstName==='Muhammad' && linkedinUserMetadata.lastName==='Shoaib'){ console.info("hurray, we found the match!!!!!!!!!!!!!");}
         Object.keys(linkedinUserMetadata).forEach(function(iUser){
            console.info(iUser+" "+linkedinUserMetadata[iUser]);
         })*/

        promise.fulfill(linkedinUserMetadata);
    })
    return promise;
  })
  .redirectPath('/admin')
  .entryPath('/auth/linkedIn');
  //.callbackPath('/auth/linkedin/callback');
everyauth.everymodule.handleLogout(routes.user.logout);
everyauth.everymodule.findUserById( function (user, callback) {
  callback(user)
});
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(session({secret: 'whodunnit',     resave: true,
    saveUninitialized: true}));
app.use(everyauth.middleware());
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){
   if(req.session && req.session.admin){
     res.locals.admin=true;
   }
   next();
});

app.locals.appTitle="Inventory App";
app.use(function(req, res, next){
    if(!collections.articles || !collections.users)
      return next(new Error('No collections.'));
    req.collections=collections;
    return next();
});

var authorize = function(req, res, next){
   if(req.session && req.session.admin)
     next();
   else
     res.send(401);
}

app.get('/', routes.index);
app.get('/articles/:slug', routes.article.show);
//app.get('/post', routes.article.post);
app.get('/login', routes.user.login);
app.post('/login', routes.user.authenticate);
app.get('/admin', authorize, routes.article.admin);
app.get('/logout', routes.user.logout);
app.get('/post',authorize, routes.article.post);
app.post('/post',authorize, routes.article.insert);

app.all('/api',authorize );
app.get('/api/articles', routes.article.list);
app.post('/api/articles', routes.article.add);
app.put('/api/articles/:id', routes.article.edit);
app.del('/api/articles/:id', routes.article.del);
//app.get('/auth/linkedin', );

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
