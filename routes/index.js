/*var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
*/

exports.article = require('./article');
exports.user=require('./user');
exports.index = function(req, res, next){
  req.collections.articles.find({}, {sort:{expiration:-1}}).toArray(function(error, articles){
    if (error) return next(error);
    res.render('index', { articles: articles});
    //res.render('index', {title: 'Express'});
  })
};
