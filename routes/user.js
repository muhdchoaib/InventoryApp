/*var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('respond with a resource');
});

module.exports = router;*/

exports.login=function(req, res, next){
   res.render('login');
};

exports.authenticate=function(req, res, next){
 if(!req.body.email||!req.body.password)
   return res.render('login', {error: "either password or user name is incorrect"});
  if(!req.collections.users) return next(new Error("Unable to load users collections")); 
 var user={email: req.body.email, password: req.body.password}
 req.collections.users.findOne(user, function(err, doc){
   if(err) return next(new Error("mongodb error"));
   if(!doc) return res.render('login', {error: "incorrect password or username"});
   req.session.user=doc;
   req.session.admin=doc.admin;
   res.redirect('/admin');
 });
};

exports.logout=function(req, res, next){
  req.session.destroy();
   res.redirect('/');
}
